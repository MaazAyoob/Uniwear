const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendMessage, getChatbotInfo } = require('../controllers/chatbotController');

// Chatbot specific rate limiting: max 60 messages per 15 minutes per IP
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    reply: "You've sent quite a few messages recently. To continue, please contact our team directly at sales@uniwear.co or +91 91087 65831."
  }
});

// Public endpoints
router.post('/message', chatLimiter, sendMessage);
router.get('/info', getChatbotInfo);

module.exports = router;
