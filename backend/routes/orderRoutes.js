const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  markOrderTest,
  archiveOrder,
  deleteOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.patch('/:id', protect, updateOrder);
router.patch('/:id/mark-test', protect, markOrderTest);
router.patch('/:id/archive', protect, archiveOrder);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
