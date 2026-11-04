const mongoose = require('mongoose');
const CompanySettings = require('../models/CompanySettings');
const Product = require('../models/Product');
const CustomerProduct = require('../models/CustomerProduct');
const User = require('../models/User');

// Indian State Codes dictionary (first 2 digits of GSTIN)
const STATE_CODES = {
  'jammu and kashmir': '01',
  'himachal pradesh': '02',
  'punjab': '03',
  'chandigarh': '04',
  'uttarakhand': '05',
  'haryana': '06',
  'delhi': '07',
  'rajasthan': '08',
  'uttar pradesh': '09',
  'bihar': '10',
  'sikkim': '11',
  'arunachal pradesh': '12',
  'nagaland': '13',
  'manipur': '14',
  'mizoram': '15',
  'tripura': '16',
  'meghalaya': '17',
  'assam': '18',
  'west bengal': '19',
  'jharkhand': '20',
  'odisha': '21',
  'chhattisgarh': '22',
  'madhya pradesh': '23',
  'gujarat': '24',
  'daman and diu': '25',
  'dadra and nagar haveli': '26',
  'maharashtra': '27',
  'andhra pradesh': '28',
  'karnataka': '29',
  'goa': '30',
  'lakshadweep': '31',
  'kerala': '32',
  'tamil nadu': '33',
  'puducherry': '34',
  'andaman and nicobar islands': '35',
  'telangana': '36',
  'ladakh': '38'
};

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/**
 * Validates a GSTIN string format.
 */
function isValidGstin(gstin) {
  if (!gstin || typeof gstin !== 'string') return false;
  return GSTIN_REGEX.test(gstin.trim().toUpperCase());
}

/**
 * Resolves state code from GSTIN or state name.
 */
function resolveStateCode(gstin, stateName) {
  if (gstin && isValidGstin(gstin)) {
    return gstin.trim().substring(0, 2);
  }
  if (stateName && typeof stateName === 'string') {
    const normalized = stateName.toLowerCase().trim();
    if (STATE_CODES[normalized]) {
      return STATE_CODES[normalized];
    }
    // Check if stateName is already a 2-digit numeric code
    if (/^[0-9]{2}$/.test(normalized)) {
      return normalized;
    }
  }
  return null;
}

/**
 * Determines supply type (Intra-state vs Inter-state) and place of supply.
 * Supplier defaults to Karnataka (code 29) unless configured in CompanySettings.
 *
 * CRITICAL GUARD: Never silently assumes the supplier's state when customer location is missing.
 */
function determineSupplyType(customerGstin, customerState, settings = {}) {
  const supplierStateCode = String(settings.supplierStateCode || '29').trim();
  const supplierState = settings.supplierState || 'Karnataka';

  const custCode = resolveStateCode(customerGstin, customerState);
  const hasExplicitLocation = Boolean(custCode || (customerState && typeof customerState === 'string' && customerState.trim()));

  // Explicit guard against missing place of supply:
  if (!hasExplicitLocation) {
    return {
      taxType: 'undetermined',
      isIntraState: false,
      placeOfSupply: 'Undetermined (State or GSTIN required)',
      placeOfSupplyDetermined: false,
      requiresLocationNotice: true,
      warning: 'Place of supply cannot be determined without customer state or GSTIN. Final tax type (CGST+SGST vs IGST) pending customer address.',
      customerStateCode: null,
      supplierStateCode
    };
  }

  let isIntraState = false;
  let placeOfSupply = customerState ? String(customerState).trim() : '';

  if (custCode) {
    isIntraState = (custCode === supplierStateCode);
    if (!placeOfSupply) {
      const entry = Object.entries(STATE_CODES).find(([_, code]) => code === custCode);
      placeOfSupply = entry ? entry[0].replace(/\b\w/g, l => l.toUpperCase()) : `State Code ${custCode}`;
    }
  } else if (customerState) {
    const custNorm = customerState.toLowerCase().trim();
    isIntraState = custNorm.includes(supplierState.toLowerCase());
  }

  return {
    taxType: isIntraState ? 'intra_state' : 'inter_state',
    isIntraState,
    placeOfSupply,
    placeOfSupplyDetermined: true,
    requiresLocationNotice: false,
    customerStateCode: custCode,
    supplierStateCode
  };
}

/**
 * Resolves the effective tax rate and HSN code following the strict hierarchy:
 * 1. Active CustomerProduct tax override
 * 2. Product-specific configured tax
 * 3. Company-wide default GST configuration
 */
async function resolveEffectiveTax(productId, customerId, clientEmail, preloadedSettings = null) {
  const settings = preloadedSettings || (await CompanySettings.findOne().lean()) || {};
  const defaultRate = settings.defaultGstRate !== undefined ? settings.defaultGstRate : 5;
  const defaultHsn = settings.defaultHsnCode || '6109';

  // Priority 1: CustomerProduct Override
  if (customerId || clientEmail) {
    const matchIds = [];
    if (customerId) matchIds.push(customerId, String(customerId));
    if (clientEmail) matchIds.push(clientEmail.toLowerCase());

    const cp = await CustomerProduct.findOne({
      customerId: { $in: matchIds },
      $or: [{ productId: productId }, { productId: String(productId) }]
    }).lean();

    if (cp && cp.status !== 'Inactive' && cp.status !== 'Archived') {
      if (cp.taxPercent !== undefined && cp.taxPercent !== null) {
        return {
          taxRate: Number(cp.taxPercent),
          hsnCode: cp.hsnCode || defaultHsn,
          hsnStatus: cp.hsnStatus || 'Pending Accountant Verification',
          hsnVerificationNote: cp.hsnVerificationNote || 'Format checked; pending final review by corporate Chartered Accountant / Tax Auditor.',
          source: 'customer_override'
        };
      }
    }
  }

  // Priority 2: Product-specific configured tax
  if (productId) {
    const isObjectId = typeof productId === 'string' && productId.match(/^[0-9a-fA-F]{24}$/);
    const prodQuery = isObjectId ? { _id: productId } : (!isNaN(productId) ? { id: Number(productId) } : { sku: productId });
    const prod = await Product.findOne(prodQuery).lean();

    if (prod) {
      if (prod.taxPercent !== undefined && prod.taxPercent !== null) {
        return {
          taxRate: Number(prod.taxPercent),
          hsnCode: prod.hsnCode || defaultHsn,
          hsnStatus: prod.hsnStatus || 'Pending Accountant Verification',
          hsnVerificationNote: prod.hsnVerificationNote || 'Format checked; pending final review by corporate Chartered Accountant / Tax Auditor.',
          source: 'product_specific'
        };
      }
      if (prod.hsnCode) {
        return {
          taxRate: defaultRate,
          hsnCode: prod.hsnCode,
          hsnStatus: prod.hsnStatus || 'Pending Accountant Verification',
          hsnVerificationNote: prod.hsnVerificationNote || 'Format checked; pending final review by corporate Chartered Accountant / Tax Auditor.',
          source: 'company_default'
        };
      }
    }
  }

  // Priority 3: Company-wide default configuration
  return {
    taxRate: defaultRate,
    hsnCode: defaultHsn,
    hsnStatus: settings.hsnStatus || 'Pending Accountant Verification',
    hsnVerificationNote: settings.hsnVerificationNote || 'Default apparel HSN 6109 pending final tax audit sign-off by Chartered Accountant.',
    source: 'company_default'
  };
}

/**
 * Calculates tax breakdown mathematically:
 * - Subtotal
 * - CGST (taxRate / 2) & SGST (taxRate / 2) for intra-state
 * - IGST (taxRate) for inter-state
 * - Undetermined state when place of supply is unverified
 * - Exact sum guarantee (cgst + sgst === totalTax)
 */
function calculateTaxBreakdown(subtotal, taxRate, isIntraState, isTaxInclusive = false, supplyInfo = null) {
  const rate = Number(taxRate) || 0;
  let taxableAmount = subtotal;
  let totalTax = 0;

  if (isTaxInclusive) {
    taxableAmount = Math.round((subtotal * 100) / (100 + rate));
    totalTax = subtotal - taxableAmount;
  } else {
    taxableAmount = subtotal;
    totalTax = Math.round((taxableAmount * rate) / 100);
  }

  const isUndetermined = supplyInfo && supplyInfo.placeOfSupplyDetermined === false;

  let cgstRate = 0;
  let sgstRate = 0;
  let igstRate = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isUndetermined) {
    return {
      taxableAmount,
      taxRate: rate,
      totalTax,
      isIntraState: false,
      taxType: 'undetermined',
      placeOfSupplyDetermined: false,
      placeOfSupply: (supplyInfo && supplyInfo.placeOfSupply) || 'Undetermined (State or GSTIN required)',
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: 0,
      igstAmount: 0,
      undeterminedTaxAmount: totalTax,
      warning: 'Place of supply cannot be determined without customer state or GSTIN. Final tax type (CGST+SGST vs IGST) pending customer address.',
      isTaxInclusive
    };
  }

  if (isIntraState) {
    cgstRate = Number((rate / 2).toFixed(2));
    sgstRate = Number((rate / 2).toFixed(2));
    cgstAmount = Math.round((taxableAmount * cgstRate) / 100);
    sgstAmount = totalTax - cgstAmount; // Eliminates 1-rupee rounding variance
  } else {
    igstRate = rate;
    igstAmount = totalTax;
  }

  return {
    taxableAmount,
    taxRate: rate,
    totalTax,
    isIntraState,
    taxType: isIntraState ? 'intra_state' : 'inter_state',
    placeOfSupplyDetermined: true,
    cgstRate,
    cgstAmount,
    sgstRate,
    sgstAmount,
    igstRate,
    igstAmount,
    isTaxInclusive
  };
}

/**
 * Calculates authoritative cart financial snapshot with line-item and aggregate tax.
 */
async function calculateCartTax(cart, customerGstin = '', customerState = '') {
  const settings = await CompanySettings.findOne().lean() || {};
  const isTaxInclusive = settings.taxCalculationType === 'inclusive';
  const freeThreshold = settings.freeDeliveryThreshold || 0;
  const stdDelivery = settings.standardDeliveryCharge || 0;

  const supplyInfo = determineSupplyType(customerGstin, customerState, settings);

  let subtotal = 0;
  let totalTax = 0;
  let dominantTaxRate = settings.defaultGstRate || 5;

  for (const item of cart.items) {
    item.lineTotal = Math.round(item.unitRate * item.totalQuantity);
    subtotal += item.lineTotal;

    const taxInfo = await resolveEffectiveTax(item.productId, cart.customerId, cart.clientEmail, settings);
    item.hsnCode = taxInfo.hsnCode;
    item.hsnStatus = taxInfo.hsnStatus;
    item.hsnVerificationNote = taxInfo.hsnVerificationNote;
    item.taxRate = taxInfo.taxRate;
    dominantTaxRate = taxInfo.taxRate;

    const itemTax = calculateTaxBreakdown(item.lineTotal, item.taxRate, supplyInfo.isIntraState, isTaxInclusive, supplyInfo);
    item.taxAmount = itemTax.totalTax;
    totalTax += item.taxAmount;
  }

  let deliveryCharge = 0;
  if (subtotal > 0) {
    deliveryCharge = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : stdDelivery;
  }

  const aggregateBreakdown = calculateTaxBreakdown(subtotal, dominantTaxRate, supplyInfo.isIntraState, isTaxInclusive, supplyInfo);
  // Ensure aggregate totalTax matches sum of line items if multi-item rates vary
  aggregateBreakdown.totalTax = totalTax;
  if (supplyInfo.placeOfSupplyDetermined) {
    if (supplyInfo.isIntraState) {
      aggregateBreakdown.cgstAmount = Math.round(totalTax / 2);
      aggregateBreakdown.sgstAmount = totalTax - aggregateBreakdown.cgstAmount;
    } else {
      aggregateBreakdown.igstAmount = totalTax;
    }
  }

  aggregateBreakdown.supplierGstin = settings.supplierGstin || settings.gst || '29ABCDE1234F1ZH';
  aggregateBreakdown.customerGstin = customerGstin || '';
  aggregateBreakdown.placeOfSupply = supplyInfo.placeOfSupply;
  aggregateBreakdown.placeOfSupplyDetermined = supplyInfo.placeOfSupplyDetermined;
  if (!supplyInfo.placeOfSupplyDetermined) {
    aggregateBreakdown.warning = supplyInfo.warning;
  }

  cart.subtotal = subtotal;
  cart.taxRate = dominantTaxRate;
  cart.taxAmount = totalTax;
  cart.taxBreakdown = aggregateBreakdown;
  cart.deliveryCharge = deliveryCharge;
  cart.grandTotal = isTaxInclusive ? (subtotal + deliveryCharge) : (subtotal + totalTax + deliveryCharge);

  return cart;
}

/**
 * Generates an authoritative quotation financial snapshot.
 */
async function generateQuotationTaxSnapshot(items, clientEmail, customerGstin = '', customerState = '') {
  const settings = await CompanySettings.findOne().lean() || {};
  const isTaxInclusive = settings.taxCalculationType === 'inclusive';
  const freeThreshold = settings.freeDeliveryThreshold || 0;
  const stdDelivery = settings.standardDeliveryCharge || 0;

  const supplyInfo = determineSupplyType(customerGstin, customerState, settings);

  let subtotal = 0;
  let totalTax = 0;
  let dominantRate = settings.defaultGstRate || 5;

  const processedItems = [];
  for (const it of items) {
    const qty = it.quantity || it.totalQuantity || it.volume || 1;
    const rate = it.unitPrice || it.unitRate || 0;
    const lineTotal = Math.round(qty * rate);
    subtotal += lineTotal;

    const taxInfo = await resolveEffectiveTax(it.productId, null, clientEmail, settings);
    dominantRate = taxInfo.taxRate;

    const itemTax = calculateTaxBreakdown(lineTotal, taxInfo.taxRate, supplyInfo.isIntraState, isTaxInclusive, supplyInfo);
    totalTax += itemTax.totalTax;

    processedItems.push({
      ...it,
      quantity: qty,
      unitPrice: rate,
      total: lineTotal,
      hsnCode: taxInfo.hsnCode,
      hsnStatus: taxInfo.hsnStatus,
      hsnVerificationNote: taxInfo.hsnVerificationNote,
      taxRate: taxInfo.taxRate,
      taxAmount: itemTax.totalTax
    });
  }

  let deliveryCharge = 0;
  if (subtotal > 0) {
    deliveryCharge = (freeThreshold > 0 && subtotal >= freeThreshold) ? 0 : stdDelivery;
  }

  const breakdown = calculateTaxBreakdown(subtotal, dominantRate, supplyInfo.isIntraState, isTaxInclusive, supplyInfo);
  breakdown.totalTax = totalTax;
  if (supplyInfo.placeOfSupplyDetermined) {
    if (supplyInfo.isIntraState) {
      breakdown.cgstAmount = Math.round(totalTax / 2);
      breakdown.sgstAmount = totalTax - breakdown.cgstAmount;
    } else {
      breakdown.igstAmount = totalTax;
    }
  }
  breakdown.supplierGstin = settings.supplierGstin || settings.gst || '29ABCDE1234F1ZH';
  breakdown.customerGstin = customerGstin || '';
  breakdown.placeOfSupply = supplyInfo.placeOfSupply;
  breakdown.placeOfSupplyDetermined = supplyInfo.placeOfSupplyDetermined;
  if (!supplyInfo.placeOfSupplyDetermined) {
    breakdown.warning = supplyInfo.warning;
  }

  const grandTotal = isTaxInclusive ? (subtotal + deliveryCharge) : (subtotal + totalTax + deliveryCharge);

  return {
    items: processedItems,
    subtotal,
    deliveryCharge,
    taxRate: dominantRate,
    taxes: totalTax,
    grandTotal,
    taxBreakdown: breakdown
  };
}

module.exports = {
  isValidGstin,
  resolveStateCode,
  determineSupplyType,
  resolveEffectiveTax,
  calculateTaxBreakdown,
  calculateCartTax,
  generateQuotationTaxSnapshot
};
