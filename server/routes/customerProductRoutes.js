const express = require('express');
const router = express.Router();
const {
  getCustomerProducts,
  assignCustomerProducts,
  updateCustomerProductAssignment,
  removeCustomerProductAssignment
} = require('../controllers/customerProductController');
const { protect, adminOnly } = require('../middleware/auth');

// Customer view access
router.get('/customer/:id/products', protect, getCustomerProducts);

// Admin / Sales route assignments
router.post('/customer-products', protect, adminOnly, assignCustomerProducts);
router.put('/customer-products/:id', protect, adminOnly, updateCustomerProductAssignment);
router.delete('/customer-products/:id', protect, adminOnly, removeCustomerProductAssignment);

module.exports = router;
