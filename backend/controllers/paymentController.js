const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const CustomerProduct = require('../models/CustomerProduct');
const Product = require('../models/Product');
const CompanySettings = require('../models/CompanySettings');
const Notification = require('../models/Notification');
const cashfreeService = require('../services/cashfreeService');
const taxService = require('../services/taxService');

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
    const defaultTaxRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;
    const stdDelivery = settings.standardDeliveryCharge || 0;
    const freeThreshold = settings.freeDeliveryThreshold || 0;
    const isTaxInclusive = settings.taxCalculationType === 'inclusive';

    const customerGstin = (billingAddress && billingAddress.gstin) || (deliveryAddress && deliveryAddress.gstin) || '';
    let customerState = (billingAddress && billingAddress.state) || (deliveryAddress && deliveryAddress.state) || '';

    // If state is not explicitly given, check for recognized city in delivery address
    if (!customerState.trim() && deliveryAddress && deliveryAddress.city) {
      const cityLower = deliveryAddress.city.toLowerCase().trim();
      if (['bengaluru', 'bangalore', 'mysuru', 'mysore', 'hubballi', 'mangalore', 'belagavi'].includes(cityLower)) {
        customerState = 'Karnataka';
      }
    }

    const supplyInfo = taxService.determineSupplyType(customerGstin, customerState, settings);

    // CRITICAL GUARD: Never proceed with checkout if place of supply cannot be legally determined
    if (!supplyInfo.placeOfSupplyDetermined) {
      return res.status(400).json({
        success: false,
        message: 'Delivery or billing state (or valid GSTIN) is required to determine the place of supply for GST compliance before checkout.'
      });
    }

    // Server-side recalculation and validation of every item
    let subtotal = 0;
    let totalVolume = 0;
    let totalTax = 0;
    let dominantTaxRate = defaultTaxRate;
    const orderItems = [];

    for (const item of cart.items) {
      const assignment = await CustomerProduct.findOne({
        $or: [{ customerId }, { customerId: String(customerId) }, { customerId: clientEmail }],
        productId: item.productId
      }).lean() || await CustomerProduct.findOne({ productId: String(item.productId) }).lean();

      const isObjectId = typeof item.productId === 'string' && item.productId.length === 24 && /^[0-9a-fA-F]{24}$/.test(item.productId);
      let productQuery;
      if (isObjectId) {
        productQuery = { _id: item.productId };
      } else if (!isNaN(item.productId) && String(item.productId).trim() !== '') {
        productQuery = { id: Number(item.productId) };
      } else {
        productQuery = { sku: item.productId };
      }

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

      const taxInfo = await taxService.resolveEffectiveTax(item.productId, customerId, clientEmail, settings);
      dominantTaxRate = taxInfo.taxRate;
      const itemTax = taxService.calculateTaxBreakdown(lineTotal, taxInfo.taxRate, supplyInfo.isIntraState, isTaxInclusive);
      totalTax += itemTax.totalTax;

      orderItems.push({
        productId: item.productId,
        productName: item.name,
        sku: item.sku,
        fabric: item.fabric,
        gsm: item.gsm,
        unitPrice: unitRate,
        volume: qty,
        sizeBreakdown: item.sizeBreakdown || {},
        lineTotal,
        hsnCode: taxInfo.hsnCode,
        taxRate: taxInfo.taxRate,
        taxAmount: itemTax.totalTax
      });
    }

    const deliveryCharge = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : stdDelivery;
    const taxAmount = totalTax;
    const grandTotal = isTaxInclusive ? (subtotal + deliveryCharge) : (subtotal + taxAmount + deliveryCharge);

    const orderTaxBreakdown = taxService.calculateTaxBreakdown(subtotal, dominantTaxRate, supplyInfo.isIntraState, isTaxInclusive);
    orderTaxBreakdown.totalTax = totalTax;
    if (supplyInfo.isIntraState) {
      orderTaxBreakdown.cgstAmount = Math.round(totalTax / 2);
      orderTaxBreakdown.sgstAmount = totalTax - orderTaxBreakdown.cgstAmount;
    } else {
      orderTaxBreakdown.igstAmount = totalTax;
    }
    orderTaxBreakdown.supplierGstin = settings.supplierGstin || settings.gst || '29ABCDE1234F1ZH';
    orderTaxBreakdown.customerGstin = customerGstin;
    orderTaxBreakdown.placeOfSupply = supplyInfo.placeOfSupply;

    // Check for recent active pending order with identical grandTotal to prevent duplicate order generation
    const existingPendingOrder = await Order.findOne({
      clientEmail,
      'payment.paymentStatus': 'PENDING',
      grandTotal,
      createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }
    }).sort({ createdAt: -1 });

    if (existingPendingOrder && existingPendingOrder.payment && existingPendingOrder.payment.paymentSessionId) {
      try {
        const cfExisting = await cashfreeService.getOrder(existingPendingOrder.id, grandTotal);
        if (cfExisting.order_status === 'ACTIVE') {
          return res.status(200).json({
            success: true,
            orderId: existingPendingOrder.id,
            paymentSessionId: cfExisting.payment_session_id || existingPendingOrder.payment.paymentSessionId,
            orderAmount: grandTotal,
            currency: 'INR',
            cashfreeMode: cashfreeService.getClientSdkMode(),
            isSimulation: Boolean(cfExisting.isSimulation),
            isExistingSession: true
          });
        }
      } catch (checkErr) {
        // If lookup fails, proceed with fresh order creation below
      }
    }

    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const internalOrderId = `UW-ORD-${uniqueNum}`;

    const host = req.get('host');
    const protocol = req.protocol;
    const defaultReturnUrl = `${protocol}://${host}/customer-portal.html?order_id=${internalOrderId}&payment_status=return`;
    const defaultNotifyUrl = process.env.WEBHOOK_BASE_URL
      ? `${process.env.WEBHOOK_BASE_URL.replace(/\/+$/, '')}/api/portal/payment/webhook`
      : `${protocol}://${host}/api/portal/payment/webhook`;

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
      taxRate: dominantTaxRate,
      taxAmount,
      taxBreakdown: orderTaxBreakdown,
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
        gatewayEnvironment: (process.env.CASHFREE_ENV || 'sandbox').toUpperCase(),
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
      cashfreeMode: cashfreeService.getClientSdkMode(),
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

    // Idempotency: If already confirmed as PAID in database
    if (order.payment && order.payment.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        verified: true,
        paymentState: 'SUCCESS',
        message: 'Order already confirmed and paid.',
        order
      });
    }

    // Verify status with Cashfree Gateway
    const cfTargetId = order.id || orderId;
    let cfOrder, payments = [];
    try {
      cfOrder = await cashfreeService.getOrder(cfTargetId, order.grandTotal);
      payments = await cashfreeService.getOrderPayments(cfTargetId, order.grandTotal);
    } catch (cfFetchErr) {
      console.error(`[verifyPayment] Cashfree fetch error for ${cfTargetId}:`, cfFetchErr.message);
      return res.json({
        success: false,
        verified: false,
        paymentState: 'API_ERROR',
        message: 'Checking the payment status securely with Cashfree. Please wait a moment and check status again.',
        order,
        canRetry: false
      });
    }

    // Simulator safety check: Fail closed if simulated result in unauthorized environment
    if (cfOrder && cfOrder.isSimulation) {
      if (!cashfreeService.isSimulatorAllowed()) {
        return res.status(403).json({
          success: false,
          verified: false,
          paymentState: 'FAILED',
          message: 'Simulated payment verification is strictly forbidden in this environment.'
        });
      }
    }

    // Strict amount and currency validation against gateway
    if (cfOrder && cfOrder.order_amount !== undefined && !cfOrder.isSimulation) {
      if (Math.round(Number(cfOrder.order_amount)) !== Math.round(Number(order.grandTotal))) {
        console.error(`[verifyPayment] Amount mismatch: Gateway has ₹${cfOrder.order_amount}, expected ₹${order.grandTotal}`);
        return res.status(400).json({
          success: false,
          verified: false,
          paymentState: 'FAILED',
          message: 'Order amount mismatch between gateway and portal record.'
        });
      }
    }
    if (cfOrder && cfOrder.order_currency && cfOrder.order_currency !== 'INR') {
      return res.status(400).json({
        success: false,
        verified: false,
        paymentState: 'FAILED',
        message: 'Invalid currency detected. Only INR transactions are accepted.'
      });
    }

    // Search payments for outcome
    const successfulPayment = (payments || []).find(p => p.payment_status === 'SUCCESS') || (cfOrder.order_status === 'PAID' ? (payments && payments[0]) : null);
    const pendingPayment = (payments || []).find(p => p.payment_status === 'PENDING');
    const droppedPayment = (payments || []).find(p => p.payment_status === 'USER_DROPPED');
    const failedPayment = (payments || []).find(p => p.payment_status === 'FAILED');

    // 1. STATE: SUCCESS
    if (cfOrder.order_status === 'PAID' || Boolean(successfulPayment)) {
      if (successfulPayment && successfulPayment.payment_amount !== undefined && !successfulPayment.isSimulation) {
        if (Math.round(Number(successfulPayment.payment_amount)) !== Math.round(Number(order.grandTotal))) {
          console.error(`[verifyPayment] Payment amount mismatch: Gateway payment has ₹${successfulPayment.payment_amount}, expected ₹${order.grandTotal}`);
          return res.status(400).json({
            success: false,
            verified: false,
            paymentState: 'FAILED',
            message: 'Individual payment amount mismatch.'
          });
        }
      }

      const resolvedMethod = (successfulPayment && (
        successfulPayment.payment_group ||
        (typeof successfulPayment.payment_method === 'string' ? successfulPayment.payment_method : Object.keys(successfulPayment.payment_method || {})[0])
      )) || 'Online';

      const attemptRecord = {
        attemptId: `att_${Date.now()}`,
        cfPaymentId: (successfulPayment && successfulPayment.cf_payment_id) || cfPaymentId || `PAY-${Date.now()}`,
        status: 'SUCCESS',
        paymentMethod: String(resolvedMethod),
        amount: (successfulPayment && successfulPayment.payment_amount) || order.grandTotal,
        time: new Date(),
        rawResponse: { cfOrder, payments }
      };
      order.payment.attempts.push(attemptRecord);
      order.payment.paymentStatus = 'PAID';
      order.payment.cfPaymentId = attemptRecord.cfPaymentId;
      order.payment.paymentMethod = attemptRecord.paymentMethod;
      order.payment.paymentTime = new Date();
      order.payment.failureReason = '';
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
        paymentState: 'SUCCESS',
        message: 'Payment confirmed. Your order has been successfully placed.',
        order
      });
    }

    // 2. STATE: PENDING
    // If Cashfree order is ACTIVE and any payment is PENDING, or no payment attempts yet (e.g. window opened)
    if (cfOrder.order_status === 'ACTIVE' && (Boolean(pendingPayment) || (payments || []).length === 0)) {
      order.payment.paymentStatus = 'PENDING';
      await order.save();

      return res.json({
        success: true,
        verified: false,
        paymentState: 'PENDING',
        message: 'We are waiting for payment confirmation. Please do not make another payment yet. Check the status shortly.',
        order,
        canRetry: false
      });
    }

    // 3. STATE: CANCELLED / USER_DROPPED
    if (Boolean(droppedPayment) && cfOrder.order_status === 'ACTIVE') {
      order.payment.paymentStatus = 'CANCELLED';
      order.payment.failureReason = 'Customer exited or cancelled the checkout.';
      order.payment.attempts.push({
        attemptId: `att_${Date.now()}`,
        cfPaymentId: (droppedPayment && droppedPayment.cf_payment_id) || `DROP-${Date.now()}`,
        status: 'CANCELLED',
        paymentMethod: 'Online',
        amount: order.grandTotal,
        time: new Date(),
        rawResponse: { cfOrder, droppedPayment }
      });
      await order.save();

      return res.json({
        success: true,
        verified: false,
        paymentState: 'CANCELLED',
        message: 'Checkout was cancelled. Your cart and size selections are preserved.',
        order,
        canRetry: true
      });
    }

    // 4. STATE: FAILED
    const latestFailed = failedPayment || (payments && payments[0]);
    const errCode = (latestFailed && latestFailed.error_details && latestFailed.error_details.error_code) || 'PAYMENT_FAILED';
    const errDesc = (latestFailed && latestFailed.error_details && latestFailed.error_details.error_description) ||
                    (latestFailed && latestFailed.payment_message) ||
                    'Payment was not completed or rejected by gateway.';

    order.payment.paymentStatus = 'FAILED';
    order.payment.failureReason = errDesc;
    order.payment.attempts.push({
      attemptId: `att_${Date.now()}`,
      cfPaymentId: (latestFailed && latestFailed.cf_payment_id) || `FAIL-${Date.now()}`,
      status: 'FAILED',
      paymentMethod: (latestFailed && latestFailed.payment_group) || 'Online',
      amount: (latestFailed && latestFailed.payment_amount) || order.grandTotal,
      time: new Date(),
      rawResponse: { cfOrder, latestFailed }
    });
    await order.save();

    return res.status(200).json({
      success: false,
      verified: false,
      paymentState: 'FAILED',
      errorCode: errCode,
      failureReason: errDesc,
      message: 'Your payment could not be completed. No confirmed order has been created. Your cart is saved. You can retry after reviewing the payment status.',
      order,
      canRetry: true
    });
  } catch (err) {
    console.error('[verifyPayment Error]', err);
    res.status(500).json({
      success: false,
      verified: false,
      paymentState: 'API_ERROR',
      message: 'Checking the payment status securely with Cashfree. Please wait a moment and check status again.'
    });
  }
};

// POST /api/portal/payment/retry
exports.retryPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order reference is required.' });
    }

    const clientEmail = (req.user.email || '').toLowerCase().trim();
    const order = await Order.findOne({ id: orderId, clientEmail });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }

    // 1. If already paid in DB
    if (order.payment && order.payment.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        isPaid: true,
        paymentState: 'SUCCESS',
        message: 'Order is already paid and confirmed.',
        order
      });
    }

    // 2. Query Cashfree gateway to inspect real status before allowing retry
    let cfOrder, payments = [];
    try {
      cfOrder = await cashfreeService.getOrder(order.id, order.grandTotal);
      payments = await cashfreeService.getOrderPayments(order.id, order.grandTotal);
    } catch (cfErr) {
      return res.status(500).json({
        success: false,
        message: 'Unable to check gateway status before retry. Please wait a moment and try again.'
      });
    }

    // 3. Late success reconciliation: If payment succeeded earlier, confirm immediately!
    const successfulPayment = (payments || []).find(p => p.payment_status === 'SUCCESS') || (cfOrder.order_status === 'PAID' ? (payments && payments[0]) : null);
    if (cfOrder.order_status === 'PAID' || successfulPayment) {
      order.payment.paymentStatus = 'PAID';
      order.payment.cfPaymentId = (successfulPayment && successfulPayment.cf_payment_id) || order.payment.cfPaymentId || `CF-PAY-${Date.now()}`;
      order.payment.paymentTime = new Date();
      order.statusStep = 1;
      order.statusText = '01. Quotation & Contract Finalized';
      order.currentStageIndex = 1;
      order.currentStageName = '01. Quotation & Contract Finalized';
      await order.save();
      await Cart.findOneAndUpdate({ clientEmail }, { items: [], subtotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });

      return res.json({
        success: true,
        isPaid: true,
        paymentState: 'SUCCESS',
        message: 'Payment confirmed. Your order has been placed.',
        order
      });
    }

    // 4. If any payment attempt is PENDING, block retry to prevent double charge
    const pendingPayment = (payments || []).find(p => p.payment_status === 'PENDING');
    if (pendingPayment) {
      return res.status(409).json({
        success: false,
        isPending: true,
        paymentState: 'PENDING',
        message: 'A payment attempt is currently pending confirmation from your bank. Please do not make another payment yet.',
        order
      });
    }

    // 5. If order on Cashfree is ACTIVE, reuse existing payment_session_id
    if (cfOrder.order_status === 'ACTIVE') {
      const sessionId = cfOrder.payment_session_id || order.payment.paymentSessionId;
      return res.json({
        success: true,
        canRetry: true,
        orderId: order.id,
        paymentSessionId: sessionId,
        orderAmount: order.grandTotal,
        currency: 'INR',
        cashfreeMode: cashfreeService.getClientSdkMode(),
        isSimulation: Boolean(cfOrder.isSimulation)
      });
    }

    // 6. If order is EXPIRED or TERMINATED
    order.payment.paymentStatus = cfOrder.order_status;
    await order.save();
    return res.status(410).json({
      success: false,
      canRetry: false,
      expired: true,
      message: 'The previous payment session has expired. Your cart is preserved so you can initiate a fresh checkout.'
    });
  } catch (err) {
    console.error('[retryPayment Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error processing retry.' });
  }
};

// POST /api/portal/payment/webhook (Public, signature-verified)
exports.handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

    const sigDetails = cashfreeService.verifyWebhookSignatureDetails(rawBody, signature, timestamp);
    if (!sigDetails.isValid) {
      console.warn('[Webhook] Invalid Cashfree signature.');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const orderId = (payload.data && payload.data.order && payload.data.order.order_id) || payload.order_id;
    const paymentStatus = payload.data && payload.data.payment && payload.data.payment.payment_status;
    const webhookAmount = payload.data && payload.data.payment && payload.data.payment.payment_amount;
    const webhookCurrency = (payload.data && payload.data.payment && payload.data.payment.payment_currency) || 'INR';

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Ignored, missing order_id' });
    }

    const order = await Order.findOne({ id: orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }

    // Idempotency: Duplicate callbacks must be accepted cleanly without re-executing state changes
    if (order.payment && order.payment.paymentStatus === 'PAID') {
      return res.status(200).json({ success: true, message: 'Already marked as paid (idempotent).' });
    }

    // If webhook signature was valid but timestamp expired (> 15 min):
    // Use authoritative provider API reconciliation to safely reconcile without blindly trusting delayed payloads
    if (!sigDetails.isFresh) {
      console.warn(`[Webhook] Delayed webhook received for order ${orderId}. Reconciling authoritatively with Cashfree PG.`);
      try {
        const authoritativeOrder = await cashfreeService.getOrder(order.id, order.grandTotal);
        if (authoritativeOrder.order_status === 'PAID') {
          order.payment.paymentStatus = 'PAID';
          order.payment.paymentTime = new Date();
          order.statusStep = 1;
          order.statusText = '01. Quotation & Contract Finalized';
          await order.save();
          await Cart.findOneAndUpdate({ clientEmail: order.clientEmail }, { items: [], subtotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });
          return res.status(200).json({ success: true, reconciled: true });
        }
      } catch (authErr) {
        console.error('[Webhook Delayed Reconciliation Error]', authErr);
      }
      return res.status(400).json({ success: false, message: 'Expired webhook timestamp' });
    }

    if (paymentStatus === 'SUCCESS') {
      // Validate payment amount against order grand total
      if (webhookAmount !== undefined && Math.round(Number(webhookAmount)) !== Math.round(Number(order.grandTotal))) {
        console.error(`[Webhook] Amount mismatch for ${orderId}: received ₹${webhookAmount}, expected ₹${order.grandTotal}`);
        return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
      }

      // Validate currency
      if (webhookCurrency && webhookCurrency !== 'INR') {
        console.error(`[Webhook] Currency mismatch for ${orderId}: received ${webhookCurrency}`);
        return res.status(400).json({ success: false, message: 'Payment currency mismatch' });
      }

      order.payment.paymentStatus = 'PAID';
      order.payment.cfPaymentId = String((payload.data && payload.data.payment && payload.data.payment.cf_payment_id) || '');
      order.payment.paymentMethod = String((payload.data && payload.data.payment && payload.data.payment.payment_group) || 'Online');
      order.payment.paymentTime = new Date();
      order.payment.failureReason = '';
      order.statusStep = 1;
      order.statusText = '01. Quotation & Contract Finalized';
      order.currentStageIndex = 1;
      order.currentStageName = '01. Quotation & Contract Finalized';

      order.payment.attempts.push({
        attemptId: `wh_${Date.now()}`,
        cfPaymentId: order.payment.cfPaymentId,
        status: 'SUCCESS',
        paymentMethod: order.payment.paymentMethod,
        amount: order.grandTotal,
        time: new Date(),
        rawResponse: payload
      });
      await order.save();

      // Clear customer cart
      await Cart.findOneAndUpdate({ clientEmail: order.clientEmail }, { items: [], subtotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });

      // Admin Notification
      await Notification.create({
        recipient: 'admin',
        title: 'Webhook: Order Confirmed',
        text: `Order ${order.id} (₹${order.grandTotal.toLocaleString('en-IN')}) confirmed via signed Cashfree webhook for ${order.clientCompany || order.clientEmail}.`,
        time: 'Just now'
      });
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'USER_DROPPED') {
      // Record failed/dropped attempt if order is not already PAID
      if (order.payment.paymentStatus !== 'PAID') {
        order.payment.paymentStatus = paymentStatus === 'USER_DROPPED' ? 'CANCELLED' : 'FAILED';
        order.payment.failureReason = (payload.data && payload.data.payment && payload.data.payment.payment_message) || 'Gateway reported non-success status.';
        order.payment.attempts.push({
          attemptId: `wh_${Date.now()}`,
          cfPaymentId: String((payload.data && payload.data.payment && payload.data.payment.cf_payment_id) || ''),
          status: order.payment.paymentStatus,
          paymentMethod: String((payload.data && payload.data.payment && payload.data.payment.payment_group) || 'Online'),
          amount: order.grandTotal,
          time: new Date(),
          rawResponse: payload
        });
        await order.save();
      }
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

    const order = await Order.findOne({ id: orderId, clientEmail });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Active reconciliation: if order is still PENDING in DB, check Cashfree gateway
    if (order.payment && order.payment.paymentStatus === 'PENDING') {
      try {
        const cfOrder = await cashfreeService.getOrder(order.id, order.grandTotal);
        const payments = await cashfreeService.getOrderPayments(order.id, order.grandTotal);
        const successfulPayment = (payments || []).find(p => p.payment_status === 'SUCCESS') || (cfOrder.order_status === 'PAID' ? payments[0] : null);

        if (cfOrder.order_status === 'PAID' || successfulPayment) {
          order.payment.paymentStatus = 'PAID';
          order.payment.cfPaymentId = (successfulPayment && successfulPayment.cf_payment_id) || order.payment.cfPaymentId || `CF-PAY-${Date.now()}`;
          order.payment.paymentTime = new Date();
          order.statusStep = 1;
          order.statusText = '01. Quotation & Contract Finalized';
          order.currentStageIndex = 1;
          order.currentStageName = '01. Quotation & Contract Finalized';
          await order.save();
          await Cart.findOneAndUpdate({ clientEmail }, { items: [], subtotal: 0, taxAmount: 0, deliveryCharge: 0, grandTotal: 0 });
        }
      } catch (checkErr) {
        // Proceed with current DB state if gateway is temporarily unreachable
      }
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

// GET /api/portal/payment/config
// Provides trusted runtime gateway environment (sandbox vs production) without exposing any API keys or secrets
exports.getPaymentConfig = async (req, res) => {
  try {
    const cashfreeMode = cashfreeService.getClientSdkMode();
    res.json({
      success: true,
      cashfreeMode,
      currency: 'INR',
      apiVersion: cashfreeService.getApiVersion()
    });
  } catch (err) {
    console.error('[getPaymentConfig Error]', err);
    res.status(500).json({ success: false, message: 'Error fetching payment configuration.' });
  }
};
