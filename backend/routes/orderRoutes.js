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
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, adminOnly, createOrder);
router.patch('/:id', protect, adminOnly, updateOrder);
router.patch('/:id/mark-test', protect, adminOnly, markOrderTest);
router.patch('/:id/archive', protect, adminOnly, archiveOrder);
router.delete('/:id', protect, adminOnly, deleteOrder);

module.exports = router;
