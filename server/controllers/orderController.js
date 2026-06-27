const Order = require('../models/Order');
const CompanySettings = require('../models/CompanySettings');
const { sendMail, emailTemplates } = require('../config/mailer');

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

    // Send order creation emails (non-blocking & safe try-catch wrapper)
    try {
      const settings = await CompanySettings.findOne().lean() || {};
      
      try {
        sendMail(emailTemplates.orderCreatedCustomer(order, settings))
          .catch(err => console.error('[Mailer Trigger Error] orderCreatedCustomer failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] orderCreatedCustomer generation failed:', mailErr.message);
      }

      try {
        sendMail(emailTemplates.orderCreatedAdmin(order, settings))
          .catch(err => console.error('[Mailer Trigger Error] orderCreatedAdmin failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] orderCreatedAdmin generation failed:', mailErr.message);
      }
    } catch (settingsErr) {
      console.error('[Mailer Trigger Error] Settings lookup failed during order creation:', settingsErr.message);
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id
const updateOrder = async (req, res, next) => {
  try {
    const oldOrder = await Order.findById(req.params.id);
    if (!oldOrder) return res.status(404).json({ success: false, message: 'Order not found.' });

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // Email Trigger post-DB write wrapped in safe try-catch
    const statusStepChanged = req.body.statusStep !== undefined && oldOrder.statusStep !== req.body.statusStep;
    const statusTextChanged = req.body.statusText !== undefined && oldOrder.statusText !== req.body.statusText;

    if (statusStepChanged || statusTextChanged) {
      try {
        const settings = await CompanySettings.findOne().lean() || {};
        sendMail(emailTemplates.orderStatusUpdate(order, settings))
          .catch(err => console.error('[Mailer Trigger Error] orderStatusUpdate failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] orderStatusUpdate generation failed:', mailErr.message);
      }
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, createOrder, updateOrder };
