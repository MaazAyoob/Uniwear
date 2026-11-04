const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getTaxSettings,
  updateTaxSettings,
  getProductTaxes,
  updateProductTax,
  getCustomerProductTaxes,
  updateCustomerProductTax,
  getTaxAuditLogs,
  verifyHsn
} = require('../controllers/taxController');

router.get('/settings', protect, adminOnly, getTaxSettings);
router.put('/settings', protect, adminOnly, updateTaxSettings);

router.get('/products', protect, adminOnly, getProductTaxes);
router.put('/products/:id', protect, adminOnly, updateProductTax);

router.get('/customer-products', protect, adminOnly, getCustomerProductTaxes);
router.put('/customer-products/:id', protect, adminOnly, updateCustomerProductTax);

router.get('/audit-logs', protect, adminOnly, getTaxAuditLogs);
router.put('/verify-hsn', protect, adminOnly, verifyHsn);

module.exports = router;

