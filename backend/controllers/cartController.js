const Cart = require('../models/Cart');
const CustomerProduct = require('../models/CustomerProduct');
const Product = require('../models/Product');
const Quotation = require('../models/Quotation');
const CompanySettings = require('../models/CompanySettings');

// Helper: Calculate cart totals safely
async function calculateCartTotals(cart) {
  const settings = await CompanySettings.findOne().lean() || {};
  const defaultTaxRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;
  const freeThreshold = settings.freeDeliveryThreshold || 0;
  const stdDelivery = settings.standardDeliveryCharge || 0;

  let subtotal = 0;
  cart.items.forEach(item => {
    item.lineTotal = Math.round(item.unitRate * item.totalQuantity);
    subtotal += item.lineTotal;
  });

  const taxRate = defaultTaxRate;
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  let deliveryCharge = 0;
  if (subtotal > 0) {
    deliveryCharge = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : stdDelivery;
  }

  cart.subtotal = subtotal;
  cart.taxRate = taxRate;
  cart.taxAmount = taxAmount;
  cart.deliveryCharge = deliveryCharge;
  cart.grandTotal = subtotal + taxAmount + deliveryCharge;
  return cart;
}

// Helper: Find or create cart for user
async function getOrCreateCart(req) {
  const customerId = req.user.id || req.user._id;
  const clientEmail = (req.user.email || '').toLowerCase().trim();

  let cart = await Cart.findOne({ clientEmail });
  if (!cart) {
    cart = await Cart.create({
      customerId,
      clientEmail,
      items: [],
      subtotal: 0,
      taxAmount: 0,
      taxRate: 5,
      deliveryCharge: 0,
      grandTotal: 0
    });
  }
  return cart;
}

// Helper: Find customer-product assignment & product info
async function resolveProductAssignment(customerId, userEmail, productId) {
  const assignment = await CustomerProduct.findOne({
    $or: [{ customerId: customerId }, { customerId: String(customerId) }, { customerId: userEmail }],
    productId: productId
  }).lean() || await CustomerProduct.findOne({
    productId: String(productId)
  }).lean();

  const isObjectId = typeof productId === 'string' && productId.length === 24 && /^[0-9a-fA-F]{24}$/.test(productId);
  const productQuery = isObjectId
    ? { $or: [{ _id: productId }, { id: productId }] }
    : { id: isNaN(productId) ? productId : Number(productId) };

  let product = await Product.findOne(productQuery).lean();
  if (!product && !isObjectId) {
    product = await Product.findOne({ sku: productId }).lean();
  }

  return { assignment, product };
}

// GET /api/portal/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req);
    await calculateCartTotals(cart);
    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (err) {
    console.error('[getCart Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error fetching cart' });
  }
};

// POST /api/portal/cart/items
exports.addItem = async (req, res) => {
  try {
    const { productId, quantity, sizeBreakdown, notes } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const totalQty = parseInt(quantity, 10);
    if (isNaN(totalQty) || totalQty <= 0) {
      return res.status(400).json({ success: false, message: 'A valid total quantity is required.' });
    }

    const customerId = req.user.id || req.user._id;
    const userEmail = (req.user.email || '').toLowerCase();
    const { assignment, product } = await resolveProductAssignment(customerId, userEmail, productId);

    if (!assignment && !product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (assignment && assignment.visible === false) {
      return res.status(403).json({ success: false, message: 'Product is not available for this account.' });
    }

    // Rate & MOQ authority from backend
    const unitRate = assignment && assignment.customPrice !== null && assignment.customPrice !== undefined
      ? assignment.customPrice
      : (product && product.price ? product.price : 0);

    const moq = assignment && assignment.customMOQ !== null && assignment.customMOQ !== undefined
      ? assignment.customMOQ
      : (product && product.moq ? product.moq : 100);

    if (totalQty < moq) {
      return res.status(400).json({
        success: false,
        message: `Order quantity (${totalQty}) cannot be less than the minimum order quantity of ${moq} pieces.`
      });
    }

    // Validate size allocation
    const allowedSizes = (assignment && assignment.availableSizes && assignment.availableSizes.length > 0)
      ? assignment.availableSizes
      : ((product && product.sizes && product.sizes.length > 0) ? product.sizes : ['S', 'M', 'L', 'XL', '2XL']);

    let allocatedSum = 0;
    const cleanSizes = {};

    if (sizeBreakdown && typeof sizeBreakdown === 'object') {
      for (const [sz, count] of Object.entries(sizeBreakdown)) {
        const num = parseInt(count, 10) || 0;
        if (num < 0) {
          return res.status(400).json({ success: false, message: `Size ${sz} quantity cannot be negative.` });
        }
        if (num > 0) {
          if (!allowedSizes.includes(sz)) {
            return res.status(400).json({ success: false, message: `Size "${sz}" is not an approved size for this product.` });
          }
          cleanSizes[sz] = num;
          allocatedSum += num;
        }
      }
    }

    if (allocatedSum !== totalQty) {
      return res.status(400).json({
        success: false,
        message: `Size allocation mismatch: ${allocatedSum} pieces allocated across sizes, but total quantity is ${totalQty} pieces.`
      });
    }

    const cart = await getOrCreateCart(req);
    const existingIndex = cart.items.findIndex(i => String(i.productId) === String(productId));

    const itemData = {
      productId,
      sku: (product && product.sku) || `UW-SKU-${productId}`,
      name: (product && product.name) || 'Approved Workwear Uniform',
      image: (product && (product.img || product.image)) || 'assets/images/products/corporate-blazer-detail.png',
      fabric: (product && product.fabric) || '100% Cotton, Bio-Washed',
      gsm: (product && product.gsm) || '220 GSM',
      unitRate,
      totalQuantity: totalQty,
      sizeBreakdown: cleanSizes,
      moq,
      lineTotal: Math.round(unitRate * totalQty),
      notes: notes || '',
      addedAt: new Date()
    };

    if (existingIndex >= 0) {
      cart.items[existingIndex] = itemData;
    } else {
      cart.items.push(itemData);
    }

    await calculateCartTotals(cart);
    await cart.save();

    res.json({
      success: true,
      message: 'Item saved to cart.',
      cart
    });
  } catch (err) {
    console.error('[addItem Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error updating cart item.' });
  }
};

// PUT /api/portal/cart/items/:productId
exports.updateItem = async (req, res) => {
  req.body.productId = req.params.productId;
  return exports.addItem(req, res);
};

// DELETE /api/portal/cart/items/:productId
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req);

    cart.items = cart.items.filter(i => String(i.productId) !== String(productId));
    await calculateCartTotals(cart);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart.',
      cart
    });
  } catch (err) {
    console.error('[removeItem Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error removing item from cart.' });
  }
};

// DELETE /api/portal/cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req);
    cart.items = [];
    cart.subtotal = 0;
    cart.taxAmount = 0;
    cart.deliveryCharge = 0;
    cart.grandTotal = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared.',
      cart
    });
  } catch (err) {
    console.error('[clearCart Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error clearing cart.' });
  }
};

// POST /api/portal/cart/transfer-quote
exports.transferQuoteToCart = async (req, res) => {
  try {
    const quotationId = req.body.quotationId || req.body.quotationNumber;
    if (!quotationId) {
      return res.status(400).json({ success: false, message: 'Quotation ID is required.' });
    }

    const userEmail = (req.user.email || '').toLowerCase();
    const quote = await Quotation.findOne({
      $or: [{ id: quotationId }, { quotationNumber: quotationId }],
      clientEmail: userEmail
    });

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quotation not found for this account.' });
    }

    const cart = await getOrCreateCart(req);

    // Transfer each item from quotation to cart
    for (const qItem of (quote.items || [])) {
      const pId = qItem.productId || qItem.product;
      const { assignment, product } = await resolveProductAssignment(req.user.id, userEmail, pId);

      const unitRate = qItem.unitPrice || (assignment && assignment.customPrice) || (product && product.price) || 0;
      const totalQty = qItem.quantity || 1;
      const sizeBreakdown = qItem.sizeBreakdown || {};

      const itemData = {
        productId: pId,
        sku: qItem.sku || (product && product.sku) || `UW-SKU-${pId}`,
        name: qItem.product || (product && product.name) || 'Approved Uniform',
        image: (product && (product.img || product.image)) || 'assets/images/products/corporate-blazer-detail.png',
        fabric: qItem.fabric || (product && product.fabric) || '100% Cotton',
        gsm: qItem.gsm || (product && product.gsm) || '220 GSM',
        unitRate,
        totalQuantity: totalQty,
        sizeBreakdown,
        moq: (assignment && assignment.customMOQ) || (product && product.moq) || 100,
        lineTotal: Math.round(unitRate * totalQty),
        notes: `Transferred from quote ${quote.id}`,
        addedAt: new Date()
      };

      const existingIndex = cart.items.findIndex(i => String(i.productId) === String(pId));
      if (existingIndex >= 0) {
        cart.items[existingIndex] = itemData;
      } else {
        cart.items.push(itemData);
      }
    }

    await calculateCartTotals(cart);
    await cart.save();

    res.json({
      success: true,
      message: `Items from quote ${quote.id} added to cart.`,
      cart
    });
  } catch (err) {
    console.error('[transferQuoteToCart Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error transferring quote to cart.' });
  }
};
