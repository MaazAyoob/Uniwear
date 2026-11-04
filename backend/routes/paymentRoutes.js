const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createCheckoutOrder,
  verifyPayment,
  retryPayment,
  handleWebhook,
  getPaymentStatus,
  getPaymentConfig
} = require('../controllers/paymentController');

// Gateway runtime configuration route (exposes only trusted SDK mode & currency, zero secrets)
router.get('/config', getPaymentConfig);

// Authenticated client checkout & payment routes
router.post('/checkout', protect, createCheckoutOrder);
router.post('/verify', protect, verifyPayment);
router.post('/retry', protect, retryPayment);
router.get('/status/:orderId', protect, getPaymentStatus);

// Signed Webhook route from Cashfree
router.post('/webhook', handleWebhook);

module.exports = router;

