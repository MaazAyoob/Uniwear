const CompanySettings = require('../models/CompanySettings');
const Product = require('../models/Product');
const CustomerProduct = require('../models/CustomerProduct');
const TaxAuditLog = require('../models/TaxAuditLog');
const { isValidGstin, resolveStateCode } = require('../services/taxService');

/**
 * GET /api/admin/tax/settings
 * Retrieves global tax and GST configuration.
 */
const getTaxSettings = async (req, res) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({
        companyName: 'UNIWEAR',
        defaultGstRate: 5,
        defaultHsnCode: '6109',
        supplierGstin: '29ABCDE1234F1ZH',
        supplierState: 'Karnataka',
        supplierStateCode: '29',
        taxCalculationType: 'exclusive',
        taxConfigStatus: 'Active'
      });
    }

    // Count product overrides and customer overrides
    const configuredProductsCount = await Product.countDocuments({
      taxConfigStatus: 'Configured',
      taxPercent: { $ne: null }
    });

    const customerOverridesCount = await CustomerProduct.countDocuments({
      taxPercent: { $ne: null }
    });

    res.json({
      success: true,
      data: {
        defaultGstRate: settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5,
        defaultHsnCode: settings.defaultHsnCode || '6109',
        supplierGstin: settings.supplierGstin || '29ABCDE1234F1ZH',
        supplierState: settings.supplierState || 'Karnataka',
        supplierStateCode: settings.supplierStateCode || '29',
        taxCalculationType: settings.taxCalculationType || 'exclusive',
        taxConfigStatus: settings.taxConfigStatus || 'Active',
        hsnStatus: settings.hsnStatus || 'Pending Accountant Verification',
        hsnVerificationNote: settings.hsnVerificationNote || 'Default apparel HSN 6109 pending final tax audit sign-off by Chartered Accountant.',
        hsnVerifiedBy: settings.hsnVerifiedBy || '',
        hsnVerifiedAt: settings.hsnVerifiedAt || null,
        lastTaxUpdated: settings.lastTaxUpdated || null,
        lastTaxUpdatedBy: settings.lastTaxUpdatedBy || null,
        configuredProductsCount,
        customerOverridesCount
      }
    });
  } catch (err) {
    console.error('[TaxController] getTaxSettings error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve tax settings: ' + err.message });
  }
};

/**
 * PUT /api/admin/tax/settings
 * Updates global GST rate, supplier GSTIN, state and calculation type.
 */
const updateTaxSettings = async (req, res) => {
  try {
    const {
      defaultGstRate,
      defaultHsnCode,
      supplierGstin,
      supplierState,
      supplierStateCode,
      taxCalculationType,
      taxConfigStatus,
      changeReason
    } = req.body;

    // Validation
    const rate = Number(defaultGstRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid default GST rate. Must be a numeric value between 0 and 100.'
      });
    }

    if (supplierGstin && !isValidGstin(supplierGstin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid supplier GSTIN format. Expected 15-character alphanumeric GSTIN (e.g. 29ABCDE1234F1ZH).'
      });
    }

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }

    const previousRate = settings.defaultGstRate;
    const previousHsn = settings.defaultHsnCode || '6109';

    settings.defaultGstRate = rate;
    if (defaultHsnCode !== undefined) settings.defaultHsnCode = String(defaultHsnCode).trim();
    if (supplierGstin !== undefined) {
      settings.supplierGstin = supplierGstin.trim().toUpperCase();
      // Also update settings.gst for backwards compatibility
      settings.gst = settings.supplierGstin;
      const derivedCode = resolveStateCode(settings.supplierGstin);
      if (derivedCode) {
        settings.supplierStateCode = derivedCode;
      }
    }
    if (supplierState !== undefined) settings.supplierState = String(supplierState).trim();
    if (supplierStateCode !== undefined) settings.supplierStateCode = String(supplierStateCode).trim();
    if (taxCalculationType && ['exclusive', 'inclusive'].includes(taxCalculationType)) {
      settings.taxCalculationType = taxCalculationType;
    }
    if (taxConfigStatus && ['Active', 'Draft'].includes(taxConfigStatus)) {
      settings.taxConfigStatus = taxConfigStatus;
    }

    settings.lastTaxUpdated = new Date();
    settings.lastTaxUpdatedBy = req.user?.email || req.user?.userId || 'admin';

    await settings.save();

    // Create Audit Log entry
    await TaxAuditLog.create({
      targetType: 'global',
      targetName: 'Company Default GST',
      previousRate,
      newRate: rate,
      previousHsn,
      newHsn: settings.defaultHsnCode,
      adminId: String(req.user?.userId || req.user?._id || 'admin'),
      adminEmail: req.user?.email || 'admin@uniwear.in',
      changeReason: changeReason || 'Global GST settings update'
    });

    res.json({
      success: true,
      message: 'Tax settings updated successfully.',
      data: {
        defaultGstRate: settings.defaultGstRate,
        defaultHsnCode: settings.defaultHsnCode,
        supplierGstin: settings.supplierGstin,
        supplierState: settings.supplierState,
        supplierStateCode: settings.supplierStateCode,
        taxCalculationType: settings.taxCalculationType,
        taxConfigStatus: settings.taxConfigStatus,
        lastTaxUpdated: settings.lastTaxUpdated,
        lastTaxUpdatedBy: settings.lastTaxUpdatedBy
      }
    });
  } catch (err) {
    console.error('[TaxController] updateTaxSettings error:', err);
    res.status(500).json({ success: false, message: 'Failed to update tax settings: ' + err.message });
  }
};

/**
 * GET /api/admin/tax/products
 * Retrieves products with their tax and HSN configurations.
 */
const getProductTaxes = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ category: 1, name: 1 }).lean();
    const settings = await CompanySettings.findOne().lean() || {};
    const defaultRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;
    const defaultHsn = settings.defaultHsnCode || '6109';

    const formatted = products.map(p => {
      const isConfigured = p.taxConfigStatus === 'Configured' && p.taxPercent !== null && p.taxPercent !== undefined;
      return {
        _id: p._id,
        id: p.id,
        name: p.name,
        category: p.category,
        sku: p.sku || '',
        basePrice: p.basePrice || 0,
        hsnCode: p.hsnCode || defaultHsn,
        hsnStatus: p.hsnStatus || 'Pending Accountant Verification',
        hsnVerificationNote: p.hsnVerificationNote || 'Format checked; pending final review by corporate Chartered Accountant / Tax Auditor.',
        taxPercent: isConfigured ? p.taxPercent : null,
        effectiveTaxRate: isConfigured ? p.taxPercent : defaultRate,
        taxConfigStatus: isConfigured ? 'Configured' : 'Default',
        lastTaxUpdated: p.lastTaxUpdated || null,
        lastTaxUpdatedBy: p.lastTaxUpdatedBy || null
      };
    });

    res.json({
      success: true,
      data: formatted,
      defaultGstRate: defaultRate,
      defaultHsnCode: defaultHsn
    });
  } catch (err) {
    console.error('[TaxController] getProductTaxes error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve product taxes: ' + err.message });
  }
};

/**
 * PUT /api/admin/tax/products/:id
 * Updates tax rate and HSN code for a specific product.
 */
const updateProductTax = async (req, res) => {
  try {
    const { id } = req.params;
    const { taxPercent, hsnCode, resetToDefault, changeReason } = req.body;

    const isObjectId = typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : (!isNaN(id) ? { id: Number(id) } : { sku: id });
    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const previousRate = product.taxPercent;
    const previousHsn = product.hsnCode || '';

    if (resetToDefault) {
      product.taxPercent = null;
      product.taxConfigStatus = 'Default';
    } else {
      const rate = Number(taxPercent);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        return res.status(400).json({
          success: false,
          message: 'Invalid tax rate. Must be a numeric value between 0 and 100.'
        });
      }
      product.taxPercent = rate;
      product.taxConfigStatus = 'Configured';
    }

    if (hsnCode !== undefined) {
      product.hsnCode = String(hsnCode).trim();
    }

    product.lastTaxUpdated = new Date();
    product.lastTaxUpdatedBy = req.user?.email || req.user?.userId || 'admin';

    await product.save();

    // Audit log
    await TaxAuditLog.create({
      targetType: 'product',
      targetId: String(product._id),
      targetName: product.name,
      sku: product.sku || '',
      previousRate,
      newRate: resetToDefault ? null : product.taxPercent,
      previousHsn,
      newHsn: product.hsnCode,
      adminId: String(req.user?.userId || req.user?._id || 'admin'),
      adminEmail: req.user?.email || 'admin@uniwear.in',
      changeReason: changeReason || (resetToDefault ? 'Reset to company default GST' : 'Product tax override update')
    });

    res.json({
      success: true,
      message: 'Product tax updated successfully.',
      data: {
        _id: product._id,
        name: product.name,
        taxPercent: product.taxPercent,
        hsnCode: product.hsnCode,
        taxConfigStatus: product.taxConfigStatus,
        lastTaxUpdated: product.lastTaxUpdated
      }
    });
  } catch (err) {
    console.error('[TaxController] updateProductTax error:', err);
    res.status(500).json({ success: false, message: 'Failed to update product tax: ' + err.message });
  }
};

/**
 * GET /api/admin/tax/customer-products
 * Retrieves customer-specific products and their tax override settings.
 */
const getCustomerProductTaxes = async (req, res) => {
  try {
    const cps = await CustomerProduct.find({}).sort({ customerEmail: 1, name: 1 }).lean();
    const settings = await CompanySettings.findOne().lean() || {};
    const defaultRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;

    const formatted = cps.map(cp => {
      const hasOverride = cp.taxPercent !== null && cp.taxPercent !== undefined;
      return {
        _id: cp._id,
        customerId: cp.customerId,
        customerEmail: cp.customerEmail,
        customerName: cp.customerName,
        productId: cp.productId,
        name: cp.name,
        sku: cp.sku || '',
        price: cp.price,
        hsnCode: cp.hsnCode || settings.defaultHsnCode || '6109',
        hsnStatus: cp.hsnStatus || 'Pending Accountant Verification',
        hsnVerificationNote: cp.hsnVerificationNote || 'Format checked; pending final review by corporate Chartered Accountant / Tax Auditor.',
        taxPercent: hasOverride ? cp.taxPercent : null,
        effectiveTaxRate: hasOverride ? cp.taxPercent : defaultRate,
        isOverridden: hasOverride,
        status: cp.status,
        lastTaxUpdated: cp.lastTaxUpdated || null,
        lastTaxUpdatedBy: cp.lastTaxUpdatedBy || null
      };
    });

    res.json({
      success: true,
      data: formatted,
      defaultGstRate: defaultRate
    });
  } catch (err) {
    console.error('[TaxController] getCustomerProductTaxes error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve customer product taxes: ' + err.message });
  }
};

/**
 * PUT /api/admin/tax/customer-products/:id
 * Updates customer-specific product tax override.
 */
const updateCustomerProductTax = async (req, res) => {
  try {
    const { id } = req.params;
    const { taxPercent, hsnCode, removeOverride, changeReason } = req.body;

    const cp = await CustomerProduct.findById(id);
    if (!cp) {
      return res.status(404).json({ success: false, message: 'Customer product mapping not found.' });
    }

    const previousRate = cp.taxPercent;
    const previousHsn = cp.hsnCode || '';

    if (removeOverride) {
      cp.taxPercent = null;
    } else {
      const rate = Number(taxPercent);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        return res.status(400).json({
          success: false,
          message: 'Invalid tax rate. Must be a numeric value between 0 and 100.'
        });
      }
      cp.taxPercent = rate;
    }

    if (hsnCode !== undefined) {
      cp.hsnCode = String(hsnCode).trim();
    }

    cp.lastTaxUpdated = new Date();
    cp.lastTaxUpdatedBy = req.user?.email || req.user?.userId || 'admin';

    await cp.save();

    // Audit log
    await TaxAuditLog.create({
      targetType: 'customer_product',
      targetId: String(cp._id),
      targetName: cp.name,
      sku: cp.sku || '',
      customerId: cp.customerId,
      customerEmail: cp.customerEmail,
      previousRate,
      newRate: removeOverride ? null : cp.taxPercent,
      previousHsn,
      newHsn: cp.hsnCode,
      adminId: String(req.user?.userId || req.user?._id || 'admin'),
      adminEmail: req.user?.email || 'admin@uniwear.in',
      changeReason: changeReason || (removeOverride ? 'Removed customer-specific tax override' : 'Customer contract tax override update')
    });

    res.json({
      success: true,
      message: 'Customer product tax override updated successfully.',
      data: {
        _id: cp._id,
        name: cp.name,
        taxPercent: cp.taxPercent,
        hsnCode: cp.hsnCode,
        customerEmail: cp.customerEmail,
        lastTaxUpdated: cp.lastTaxUpdated
      }
    });
  } catch (err) {
    console.error('[TaxController] updateCustomerProductTax error:', err);
    res.status(500).json({ success: false, message: 'Failed to update customer product tax: ' + err.message });
  }
};

/**
 * GET /api/admin/tax/audit-logs
 * Retrieves tax change audit logs with sorting and limit.
 */
const getTaxAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);
    const logs = await TaxAuditLog.find({}).sort({ timestamp: -1, createdAt: -1 }).limit(limit).lean();

    res.json({
      success: true,
      data: logs
    });
  } catch (err) {
    console.error('[TaxController] getTaxAuditLogs error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve tax audit logs: ' + err.message });
  }
};

/**
 * PUT /api/admin/tax/verify-hsn
 * Allows Chartered Accountant / Tax Auditor to verify and sign off on HSN classifications.
 */
const verifyHsn = async (req, res) => {
  try {
    const { targetType, targetId, hsnCode, hsnStatus, verificationNote } = req.body;
    const note = verificationNote || 'Verified by Corporate Chartered Accountant';
    const status = hsnStatus || req.body.status || 'Verified by Accountant';
    const verifiedBy = req.user?.email || req.user?.userId || 'Chartered Accountant';
    const now = new Date();

    if (targetType === 'global') {
      let settings = await CompanySettings.findOne();
      if (settings) {
        settings.hsnStatus = status;
        settings.hsnVerificationNote = note;
        settings.hsnVerifiedBy = verifiedBy;
        settings.hsnVerifiedAt = now;
        await settings.save();
      }
    } else if (targetType === 'product') {
      const isObjectId = typeof targetId === 'string' && targetId.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { _id: targetId } : (!isNaN(targetId) ? { id: Number(targetId) } : { sku: targetId });
      const product = await Product.findOne(query);
      if (product) {
        product.hsnStatus = status;
        product.hsnVerificationNote = note;
        product.hsnVerifiedBy = verifiedBy;
        product.hsnVerifiedAt = now;
        await product.save();
      }
    } else if (targetType === 'customer_product') {
      const cp = await CustomerProduct.findById(targetId);
      if (cp) {
        cp.hsnStatus = status;
        cp.hsnVerificationNote = note;
        cp.hsnVerifiedBy = verifiedBy;
        cp.hsnVerifiedAt = now;
        await cp.save();
      }
    }

    await TaxAuditLog.create({
      targetType: targetType || 'global',
      targetId: targetId || '',
      targetName: `HSN Verification: ${hsnCode || '6109'}`,
      previousRate: null,
      newRate: 0,
      previousHsn: '',
      newHsn: hsnCode || '6109',
      adminId: String(req.user?.userId || req.user?._id || 'admin'),
      adminEmail: req.user?.email || 'ca@uniwear.in',
      changeReason: `Accountant HSN sign-off: ${status} - ${note}`
    });

    res.json({
      success: true,
      message: 'HSN classification verification status recorded successfully.',
      data: {
        hsnStatus: status,
        hsnVerificationNote: note,
        verifiedBy,
        verifiedAt: now
      }
    });
  } catch (err) {
    console.error('[TaxController] verifyHsn error:', err);
    res.status(500).json({ success: false, message: 'Failed to record HSN verification: ' + err.message });
  }
};

module.exports = {
  getTaxSettings,
  updateTaxSettings,
  getProductTaxes,
  updateProductTax,
  getCustomerProductTaxes,
  updateCustomerProductTax,
  getTaxAuditLogs,
  verifyHsn
};
