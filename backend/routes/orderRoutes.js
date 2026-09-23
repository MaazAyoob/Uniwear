const express = require('express');
const router = express.Router();
const { getOrders, createOrder, updateOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getOrders);
router.post('/', protect, createOrder);
router.patch('/:id', protect, updateOrder);

module.exports = router;
