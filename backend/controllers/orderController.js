const mongoose = require('mongoose');
const Order = require('../models/Order');
const CompanySettings = require('../models/CompanySettings');
const { sendMail, emailTemplates } = require('../config/mailer');

const getOrderQuery = (id) => (mongoose.isValidObjectId(id) ? { _id: id } : { id: id });

const FACTORY_STAGE_NAMES = [
  '01. Quotation & Contract Finalized',
  '02. Fabric Sourcing & Mill Reservation',
  '03. Lab Dip & Color Dye Approval',
  '04. Pre-Production Sample Sign-Off',
  '05. Precision CNC Fabric Cutting',
  '06. Logo Embroidery & Screen Printing',
  '07. Component Bundling & Panel Prep',
  '08. Sewing & Stitch Assembly',
  '09. Quality Control & Inline Inspection',
  '10. Thread Trimming & Steam Pressing',
  '11. Poly-Bags & Barcode Labeling',
  '12. Final Quality Audit & Metal Detect',
  '13. Carton Packing & Palletization',
  '14. Dispatch & Logistics Tracking'
];

// Helper to log admin actions
const Notification = require('../models/Notification');
const logActivity = async (action, details, user = 'Admin') => {
  try {
    await Notification.create({ recipient: 'admin', title: action, text: details || action, time: 'Just now' });
  } catch (err) {
    console.error('[logActivity Error]', err.message);
  }
};

// GET /api/orders
const getOrders = async (req, res, next) => {
  try {
    const { search, stage, onSchedule, delayed } = req.query;
    const filter = {};

    // SECURITY: Customers can only view their own orders.
    // Ignore any clientEmail query param from the browser for Customer role.
    if (req.user && req.user.role === 'Customer') {
      filter.clientEmail = req.user.email.toLowerCase();
    } else if (req.query.clientEmail) {
      filter.clientEmail = req.query.clientEmail.toLowerCase();
    }
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
    const payload = { ...req.body };
    if (payload.volume !== undefined) {
      payload.volume = parseInt(String(payload.volume).replace(/[^0-9]/g, '')) || 0;
    }
    const order = await Order.create(payload);
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
    const targetQuery = getOrderQuery(req.params.id);
    const oldOrder = await Order.findOne(targetQuery);
    if (!oldOrder) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Handle stage updates
    const updates = { ...req.body };
    if (updates.volume !== undefined) {
      updates.volume = parseInt(String(updates.volume).replace(/[^0-9]/g, '')) || 0;
    }
    if (updates.currentStageIndex) {
      const idx = Number(updates.currentStageIndex);
      updates.statusStep = idx;
      updates.currentStageName = FACTORY_STAGE_NAMES[idx - 1] || `Stage ${idx}`;
      updates.statusText = updates.currentStageName;
      if (idx === 14) updates.isCompleted = true;
      if (idx === 11) updates.readyForDispatch = true;
      if (idx === 4 || idx === 5) updates.awaitingApproval = true;
    }

    const order = await Order.findOneAndUpdate(targetQuery, updates, { new: true, runValidators: true });
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
