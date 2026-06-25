const Order = require('../models/Order');

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.clientEmail) filter.clientEmail = req.query.clientEmail.toLowerCase();
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, createOrder, updateOrder };
