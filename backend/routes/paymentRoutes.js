const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createCheckoutOrder,
  verifyPayment,
  handleWebhook,
  getPaymentStatus
} = require('../controllers/paymentController');

// Authenticated client checkout & payment routes
router.post('/checkout', protect, createCheckoutOrder);
router.post('/verify', protect, verifyPayment);
router.get('/status/:orderId', protect, getPaymentStatus);

// Signed Webhook route from Cashfree
router.post('/webhook', handleWebhook);

module.exports = router;

