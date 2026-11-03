const Order = require('../models/Order');
const Cart = require('../models/Cart');
const CustomerProduct = require('../models/CustomerProduct');
const Product = require('../models/Product');
const CompanySettings = require('../models/CompanySettings');
const Notification = require('../models/Notification');
const cashfreeService = require('../services/cashfreeService');

// POST /api/portal/checkout/create-order
exports.createCheckoutOrder = async (req, res) => {
  try {
    const customerId = req.user.id || req.user._id;
    const clientEmail = (req.user.email || '').toLowerCase().trim();
    const {
      deliveryAddress,
      billingAddress,
      agreeTerms,
      poReference,
      returnUrl
    } = req.body;

    if (!agreeTerms) {
      return res.status(400).json({
        success: false,
        message: 'You must confirm the specifications and agree to the order terms.'
      });
    }

    if (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.address || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address (contact name, address, city, pincode) is required.'
      });
    }

    // Retrieve active cart
    const cart = await Cart.findOne({ clientEmail });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add approved products before proceeding to checkout.'
      });
    }

    const settings = await CompanySettings.findOne().lean() || {};
    const taxRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;
    const stdDelivery = settings.standardDeliveryCharge || 0;
    const freeThreshold = settings.freeDeliveryThreshold || 0;

    // Server-side recalculation and validation of every item
    let subtotal = 0;
    let totalVolume = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const assignment = await CustomerProduct.findOne({
        $or: [{ customerId }, { customerId: String(customerId) }, { customerId: clientEmail }],
        productId: item.productId
      }).lean() || await CustomerProduct.findOne({ productId: String(item.productId) }).lean();

      const isObjectId = typeof item.productId === 'string' && item.productId.length === 24 && /^[0-9a-fA-F]{24}$/.test(item.productId);
      const productQuery = isObjectId
        ? { $or: [{ _id: item.productId }, { id: item.productId }] }
        : { id: isNaN(item.productId) ? item.productId : Number(item.productId) };

      let product = await Product.findOne(productQuery).lean();
      if (!product && !isObjectId) {
        product = await Product.findOne({ sku: item.productId }).lean();
      }

      const unitRate = assignment && assignment.customPrice !== null && assignment.customPrice !== undefined
        ? assignment.customPrice
        : (product && product.price ? product.price : item.unitRate);

      const moq = assignment && assignment.customMOQ !== null && assignment.customMOQ !== undefined
        ? assignment.customMOQ
        : (product && product.moq ? product.moq : 100);

      const qty = parseInt(item.totalQuantity, 10);
      if (qty < moq) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name}" does not meet the minimum order quantity of ${moq} pieces.`
        });
      }

      const lineTotal = Math.round(unitRate * qty);
      subtotal += lineTotal;
      totalVolume += qty;

      orderItems.push({
        productId: item.productId,
        productName: item.name,
        sku: item.sku,
        fabric: item.fabric,
        gsm: item.gsm,
        unitPrice: unitRate,
        volume: qty,
        sizeBreakdown: item.sizeBreakdown || {},
        lineTotal
      });
    }

    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const deliveryCharge = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : stdDelivery;
    const grandTotal = subtotal + taxAmount + deliveryCharge;

    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const internalOrderId = `UW-ORD-${uniqueNum}`;

    const host = req.get('host');
    const protocol = req.protocol;
    const defaultReturnUrl = `${protocol}://${host}/customer-portal.html?order_id=${internalOrderId}&payment_status=return`;
    const defaultNotifyUrl = `${protocol}://${host}/api/portal/payment/webhook`;

    // 1. Create or retrieve pending Order in database first
    const pendingOrder = await Order.create({
      id: internalOrderId,
      clientEmail,
      clientCompany: deliveryAddress.company || req.user.companyName || '',
      contactPerson: deliveryAddress.name,
      contactNumber: deliveryAddress.phone || '',
      productName: orderItems.map(i => i.productName).join(', '),
      volume: totalVolume,
      value: `₹${grandTotal.toLocaleString('en-IN')}`,
      deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statusStep: 1,
      statusText: '01. Quotation & Contract Finalized',
      currentStageIndex: 1,
      currentStageName: '01. Quotation & Contract Finalized',
      orderType: 'PortalDirectOrder',
      items: orderItems,
      subtotal,
      taxRate,
      taxAmount,
      deliveryCharge,
      grandTotal,
      billingAddress: {
        name: billingAddress ? billingAddress.name || deliveryAddress.name : deliveryAddress.name,
        email: billingAddress ? billingAddress.email || clientEmail : clientEmail,
        phone: billingAddress ? billingAddress.phone || deliveryAddress.phone : deliveryAddress.phone,
        company: billingAddress ? billingAddress.company || deliveryAddress.company : deliveryAddress.company,
        gstin: billingAddress ? billingAddress.gstin || '' : (deliveryAddress.gstin || ''),
        address: billingAddress ? billingAddress.address || deliveryAddress.address : deliveryAddress.address,
        city: billingAddress ? billingAddress.city || deliveryAddress.city : deliveryAddress.city,
        state: billingAddress ? billingAddress.state || deliveryAddress.state : deliveryAddress.state,
        pincode: billingAddress ? billingAddress.pincode || deliveryAddress.pincode : deliveryAddress.pincode,
        poReference: poReference || ''
      },
      shippingAddress: {
        name: deliveryAddress.name,
        email: deliveryAddress.email || clientEmail,
        phone: deliveryAddress.phone || '',
        company: deliveryAddress.company || '',
        address: deliveryAddress.address,
        city: deliveryAddress.city,
        state: deliveryAddress.state || '',
        pincode: deliveryAddress.pincode
      },
      payment: {
        gateway: 'Cashfree',
        paymentStatus: 'PENDING',
        cfOrderId: '',
        paymentSessionId: '',
        attempts: []
      }
    });

    // 2. Call Cashfree PG to create checkout session
    const cfOrder = await cashfreeService.createOrder({
      orderId: internalOrderId,
      orderAmount: grandTotal,
      customerId,
      customerName: deliveryAddress.name,
      customerEmail: clientEmail,
      customerPhone: deliveryAddress.phone,
      returnUrl: returnUrl || defaultReturnUrl,
      notifyUrl: defaultNotifyUrl
    });

    pendingOrder.payment.cfOrderId = cfOrder.cf_order_id || cfOrder.order_id;
    pendingOrder.payment.paymentSessionId = cfOrder.payment_session_id;
    await pendingOrder.save();

    res.status(201).json({
      success: true,
      orderId: internalOrderId,
      paymentSessionId: cfOrder.payment_session_id,
      orderAmount: grandTotal,
      currency: 'INR',
      isSimulation: Boolean(cfOrder.isSimulation)
    });
  } catch (err) {
    console.error('[createCheckoutOrder Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error initiating checkout.' });
  }
};

// POST /api/portal/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, cfPaymentId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const clientEmail = (req.user.email || '').toLowerCase().trim();
    const order = await Order.findOne({ id: orderId, clientEmail });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }

    // Idempotency: If already confirmed as PAID, return success immediately
    if (order.payment && order.payment.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        verified: true,
        message: 'Order already confirmed and paid.',
        order
      });
    }

    // Verify status with Cashfree
    const cfTargetId = order.payment.cfOrderId || order.id;
    const cfOrder = await cashfreeService.getOrder(cfTargetId);
    const payments = await cashfreeService.getOrderPayments(cfTargetId);

    const successfulPayment = payments.find(p => p.payment_status === 'SUCCESS') || (cfOrder.order_status === 'PAID' ? payments[0] : null);

    const isPaid = cfOrder.order_status === 'PAID' || Boolean(successfulPayment);

    // Record this payment attempt
    const attemptRecord = {
      attemptId: `att_${Date.now()}`,
      cfPaymentId: cfPaymentId || (successfulPayment ? successfulPayment.cf_payment_id : `PAY-${Date.now()}`),
      status: isPaid ? 'SUCCESS' : 'FAILED',
      paymentMethod: (successfulPayment && successfulPayment.payment_method) || 'Online',
      amount: (successfulPayment && successfulPayment.payment_amount) || order.grandTotal,
      time: new Date(),
      rawResponse: { cfOrder, payments }
    };
    order.payment.attempts.push(attemptRecord);

    if (isPaid) {
      order.payment.paymentStatus = 'PAID';
      order.payment.cfPaymentId = attemptRecord.cfPaymentId;
      order.payment.paymentMethod = attemptRecord.paymentMethod;
      order.payment.paymentTime = new Date();
      order.statusStep = 1;
      order.statusText = '01. Quotation & Contract Finalized';
      order.currentStageIndex = 1;
      order.currentStageName = '01. Quotation & Contract Finalized';
      await order.save();

      // Clear customer cart now that order is confirmed
      await Cart.findOneAndUpdate({ clientEmail }, { items: [], subtotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });

      // Admin & Customer Notification
      await Notification.create({
        recipient: 'admin',
        title: 'New Portal Order Paid',
        text: `Order ${order.id} (₹${order.grandTotal.toLocaleString('en-IN')}) verified & confirmed for ${order.clientCompany || clientEmail}.`,
        time: 'Just now'
      });

      return res.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully. Order confirmed.',
        order
      });
    } else {
      order.payment.paymentStatus = 'FAILED';
      order.payment.failureReason = 'Payment was not completed or rejected by gateway.';
      await order.save();

      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Payment has not been completed. Your cart remains intact to retry safely.',
        order
      });
    }
  } catch (err) {
    console.error('[verifyPayment Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error verifying payment.' });
  }
};

// POST /api/portal/payment/webhook (Public, signature-verified)
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const isValid = cashfreeService.verifyWebhookSignature(rawBody, signature, timestamp);
    if (!isValid) {
      console.warn('[Webhook] Invalid Cashfree signature.');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const payload = req.body;
    const orderId = payload.data && payload.data.order && payload.data.order.order_id;
    const paymentStatus = payload.data && payload.data.payment && payload.data.payment.payment_status;

    if (!orderId) {
      return res.status(200).json({ success: true, message: 'Ignored, no order_id' });
    }

    const order = await Order.findOne({ id: orderId });
    if (!order) {
      return res.status(200).json({ success: true, message: 'Order not found, ignored.' });
    }

    if (order.payment.paymentStatus === 'PAID') {
      return res.status(200).json({ success: true, message: 'Already marked as paid.' });
    }

    if (paymentStatus === 'SUCCESS') {
      order.payment.paymentStatus = 'PAID';
      order.payment.cfPaymentId = payload.data.payment.cf_payment_id || '';
      order.payment.paymentMethod = payload.data.payment.payment_group || 'Online';
      order.payment.paymentTime = new Date();
      order.payment.attempts.push({
        attemptId: `wh_${Date.now()}`,
        cfPaymentId: order.payment.cfPaymentId,
        status: 'SUCCESS',
        paymentMethod: order.payment.paymentMethod,
        amount: payload.data.payment.payment_amount || order.grandTotal,
        time: new Date(),
        rawResponse: payload
      });
      await order.save();

      // Clear customer cart
      await Cart.findOneAndUpdate({ clientEmail: order.clientEmail }, { items: [], subtotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });
    }

    res.status(200).json({ success: true, received: true });
  } catch (err) {
    console.error('[handleWebhook Error]', err);
    res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
};

// GET /api/portal/payment/status/:orderId
exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const clientEmail = (req.user.email || '').toLowerCase().trim();

    const order = await Order.findOne({ id: orderId, clientEmail }).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({
      success: true,
      orderId: order.id,
      paymentStatus: order.payment ? order.payment.paymentStatus : 'PENDING',
      order
    });
  } catch (err) {
    console.error('[getPaymentStatus Error]', err);
    res.status(500).json({ success: false, message: 'Error checking payment status.' });
  }
};
