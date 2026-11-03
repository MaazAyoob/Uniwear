const Quotation = require('../models/Quotation');
const CustomerProduct = require('../models/CustomerProduct');
const Product = require('../models/Product');
const CompanySettings = require('../models/CompanySettings');
const User = require('../models/User');

// Helper to resolve client & product rates
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

// POST /api/portal/quotations/preview
exports.previewQuotation = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required for quotation preview.' });
    }

    const customerId = req.user.id || req.user._id;
    const userEmail = (req.user.email || '').toLowerCase();
    const user = await User.findById(customerId).lean() || await User.findOne({ email: userEmail }).lean() || {};
    const settings = await CompanySettings.findOne().lean() || {};

    const validatedItems = [];
    let subtotal = 0;
    let totalVolume = 0;

    for (const item of items) {
      const { productId, quantity, sizeBreakdown } = item;
      const totalQty = parseInt(quantity, 10);
      if (isNaN(totalQty) || totalQty <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity for an item.' });
      }

      const { assignment, product } = await resolveProductAssignment(customerId, userEmail, productId);
      const unitRate = assignment && assignment.customPrice !== null && assignment.customPrice !== undefined
        ? assignment.customPrice
        : (product && product.price ? product.price : 0);

      const moq = assignment && assignment.customMOQ !== null && assignment.customMOQ !== undefined
        ? assignment.customMOQ
        : (product && product.moq ? product.moq : 100);

      if (totalQty < moq) {
        return res.status(400).json({
          success: false,
          message: `Item ${(product && product.name) || productId} requires minimum order of ${moq} pcs.`
        });
      }

      // Check sizes allocation
      let allocSum = 0;
      const cleanSizes = {};
      if (sizeBreakdown && typeof sizeBreakdown === 'object') {
        for (const [sz, count] of Object.entries(sizeBreakdown)) {
          const num = parseInt(count, 10) || 0;
          if (num > 0) {
            cleanSizes[sz] = num;
            allocSum += num;
          }
        }
      }

      if (allocSum !== totalQty) {
        return res.status(400).json({
          success: false,
          message: `Allocation mismatch for ${(product && product.name) || 'product'}: ${allocSum} allocated vs ${totalQty} requested.`
        });
      }

      const lineTotal = Math.round(unitRate * totalQty);
      subtotal += lineTotal;
      totalVolume += totalQty;

      validatedItems.push({
        productId,
        product: (product && product.name) || 'Approved Workwear Uniform',
        sku: (product && product.sku) || `UW-SKU-${productId}`,
        fabric: (product && product.fabric) || '100% Cotton, Bio-Washed',
        gsm: (product && product.gsm) || '220 GSM',
        details: `${(product && product.fabric) || '100% Cotton'} · ${(product && product.gsm) || '220 GSM'}`,
        sizeBreakdown: cleanSizes,
        quantity: totalQty,
        unitPrice: unitRate,
        total: lineTotal
      });
    }

    const taxRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;
    const taxes = Math.round((subtotal * taxRate) / 100);
    const deliveryCharge = 0; // Included in corporate quotes
    const grandTotal = subtotal + taxes + deliveryCharge;

    const validityDays = settings.defaultQuoteValidityDays || 7;
    const validUntilDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const preview = {
      quotationNumber: `UW-QT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      validity: `${validityDays} Days`,
      validUntil: validUntilDate,
      clientCompany: user.companyName || 'Corporate Client',
      clientEmail: userEmail,
      contactPerson: user.representative || 'Procurement Team',
      contactNumber: user.phone || '',
      items: validatedItems,
      volume: totalVolume,
      subtotal,
      taxRate,
      taxes,
      deliveryCharge,
      grandTotal,
      currency: 'INR',
      paymentTerms: 'Full payment before production.',
      deliveryTerms: 'Ex-factory Bengaluru. Dispatch direct to Client address.',
      leadTime: settings.defaultLeadTimeDays || '10–15 working days'
    };

    res.json({ success: true, preview });
  } catch (err) {
    console.error('[previewQuotation Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error generating quotation preview.' });
  }
};

// POST /api/portal/quotations/save
exports.saveQuotation = async (req, res) => {
  try {
    const { items, quotationNumber } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required.' });
    }

    const customerId = req.user.id || req.user._id;
    const userEmail = (req.user.email || '').toLowerCase();
    const user = await User.findById(customerId).lean() || await User.findOne({ email: userEmail }).lean() || {};
    const settings = await CompanySettings.findOne().lean() || {};

    const qNumber = quotationNumber || `UW-QT-${Math.floor(1000 + Math.random() * 9000)}`;
    const validityDays = settings.defaultQuoteValidityDays || 7;
    const validUntilDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let subtotal = 0;
    let totalVolume = 0;
    const validatedItems = [];

    for (const item of items) {
      const { productId, quantity, sizeBreakdown } = item;
      const totalQty = parseInt(quantity, 10);
      const { assignment, product } = await resolveProductAssignment(customerId, userEmail, productId);

      const unitRate = assignment && assignment.customPrice !== null && assignment.customPrice !== undefined
        ? assignment.customPrice
        : (product && product.price ? product.price : (item.unitPrice || 0));

      const lineTotal = Math.round(unitRate * totalQty);
      subtotal += lineTotal;
      totalVolume += totalQty;

      validatedItems.push({
        productId,
        product: (product && product.name) || item.product || 'Approved Uniform',
        sku: (product && product.sku) || item.sku || `UW-SKU-${productId}`,
        fabric: (product && product.fabric) || item.fabric || '',
        gsm: (product && product.gsm) || item.gsm || '',
        details: item.details || '',
        sizeBreakdown: sizeBreakdown || item.sizeBreakdown || {},
        quantity: totalQty,
        unitPrice: unitRate,
        total: lineTotal
      });
    }

    const taxRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;
    const taxes = Math.round((subtotal * taxRate) / 100);
    const grandTotal = subtotal + taxes;

    // Check if quote exists to update version/revision
    let quote = await Quotation.findOne({
      $or: [{ id: qNumber }, { quotationNumber: qNumber }],
      clientEmail: userEmail
    });

    if (quote) {
      quote.version = (quote.version || 1) + 1;
      quote.items = validatedItems;
      quote.volume = totalVolume;
      quote.subtotal = subtotal;
      quote.taxes = taxes;
      quote.grandTotal = grandTotal;
      quote.amount = grandTotal;
      quote.value = `₹${grandTotal.toLocaleString('en-IN')}`;
      quote.validUntil = validUntilDate;
      await quote.save();
    } else {
      quote = await Quotation.create({
        id: qNumber,
        quotationNumber: qNumber,
        clientEmail: userEmail,
        clientCompany: user.companyName || 'Corporate Client',
        contactPerson: user.representative || 'Procurement Team',
        contactNumber: user.phone || '',
        productClass: validatedItems.map(i => i.product).join(', '),
        volume: totalVolume,
        date: new Date().toISOString().split('T')[0],
        value: `₹${grandTotal.toLocaleString('en-IN')}`,
        amount: grandTotal,
        subtotal,
        taxRate,
        taxes,
        grandTotal,
        status: 'Approved',
        isPortalQuote: true,
        version: 1,
        validUntil: validUntilDate,
        validity: `${validityDays} Days`,
        items: validatedItems,
        paymentTerms: 'Full payment online / PO advance.',
        deliveryTerms: 'Ex-factory Bengaluru. Dispatch direct to Client address.'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Quotation saved successfully.',
      quotation: quote
    });
  } catch (err) {
    console.error('[saveQuotation Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error saving quotation.' });
  }
};

// GET /api/portal/quotations/:id/view
exports.getQuotationDoc = async (req, res) => {
  try {
    const qId = req.params.id;
    const userEmail = (req.user.email || '').toLowerCase();
    const quote = await Quotation.findOne({
      $or: [{ id: qId }, { quotationNumber: qId }],
      clientEmail: userEmail
    }).lean();

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quotation not found.' });
    }

    res.json({ success: true, quotation: quote });
  } catch (err) {
    console.error('[getQuotationDoc Error]', err);
    res.status(500).json({ success: false, message: err.message || 'Error fetching quotation.' });
  }
};
