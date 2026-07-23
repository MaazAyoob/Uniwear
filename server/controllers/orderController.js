const Order = require('../models/Order');
const CompanySettings = require('../models/CompanySettings');
const { sendMail, emailTemplates } = require('../config/mailer');

// Helper to log admin actions
const logActivity = async (action, details, user = 'Admin') => {};

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const { clientEmail, search, stage, onSchedule, delayed } = req.query;
    const filter = {};
    if (clientEmail) filter.clientEmail = clientEmail.toLowerCase();
    if (search) {
      filter.$or = [
        { id: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { clientCompany: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { statusText: { $regex: search, $options: 'i' } }
      ];
    }
    if (stage) filter.currentStageIndex = Number(stage);
    if (onSchedule === 'true') filter.onSchedule = true;
    if (delayed === 'true') filter.onSchedule = false;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    // Calculate metrics
    const allOrders = await Order.find().lean();
    const metrics = {
      total: allOrders.length,
      ordersOnSchedule: allOrders.filter(o => o.onSchedule && !o.isCompleted).length,
      delayedOrders: allOrders.filter(o => !o.onSchedule && !o.isCompleted).length,
      ordersAwaitingApproval: allOrders.filter(o => o.awaitingApproval && !o.isCompleted).length,
      readyForDispatch: allOrders.filter(o => o.readyForDispatch && !o.isCompleted).length,
      completedOrders: allOrders.filter(o => o.isCompleted || o.currentStageIndex === 14).length
    };

    res.json({ success: true, data: orders, metrics });
  } catch (err) {
    next(err);
  }
};

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    await logActivity('Order Created', `Order ${order.id} logged for ${order.clientEmail}`);

    try {
      const settings = await CompanySettings.findOne().lean() || {};
      sendMail(emailTemplates.orderCreatedCustomer(order, settings)).catch(e => {});
      sendMail(emailTemplates.orderCreatedAdmin(order, settings)).catch(e => {});
    } catch (e) {}

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

    // Handle stage updates
    const updates = { ...req.body };
    if (updates.currentStageIndex) {
      const stageNames = [
        'Order Confirmed', 'Measurement Collection', 'Fabric Procurement', 'Sampling', 'Sample Approval',
        'Cutting', 'Stitching', 'Branding', 'Quality Check', 'Packing',
        'Ready for Dispatch', 'Dispatched', 'Delivered', 'Completed'
      ];
      updates.statusStep = updates.currentStageIndex;
      updates.currentStageName = stageNames[updates.currentStageIndex - 1] || 'Order Confirmed';
      updates.statusText = updates.currentStageName;
      if (updates.currentStageIndex === 14) updates.isCompleted = true;
      if (updates.currentStageIndex === 11) updates.readyForDispatch = true;
      if (updates.currentStageIndex === 5) updates.awaitingApproval = true;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    await logActivity('Order Updated', `Order ${order.id} stage updated to ${order.currentStageName}`);

    try {
      const settings = await CompanySettings.findOne().lean() || {};
      sendMail(emailTemplates.orderStatusUpdate(order, settings)).catch(e => {});
    } catch (e) {}

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, createOrder, updateOrder };
