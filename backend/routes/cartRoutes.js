const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  transferQuoteToCart
} = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/items', protect, addItem);
router.put('/items/:productId', protect, updateItem);
router.delete('/items/:productId', protect, removeItem);
router.delete('/', protect, clearCart);
router.post('/transfer-quote', protect, transferQuoteToCart);

module.exports = router;

