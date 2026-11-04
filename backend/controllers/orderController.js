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
    const { search, stage, onSchedule, delayed, paymentStatus, archived, testData } = req.query;
    const filter = {};

    // SECURITY: Customers can only view their own orders.
    // Ignore any clientEmail query param from the browser for Customer role.
    if (req.user && req.user.role === 'Customer') {
      filter.clientEmail = req.user.email.toLowerCase();
    } else if (req.query.clientEmail) {
      filter.clientEmail = req.query.clientEmail.toLowerCase();
    }

    // Archive filtering: default to active (non-archived) orders
    if (archived === 'true') {
      filter.isArchived = true;
    } else if (archived === 'all') {
      // Do not filter out archived
    } else {
      filter.isArchived = { $ne: true };
    }

    // Test data filtering
    if (testData === 'true') {
      filter.isTestData = true;
    } else if (testData === 'false') {
      filter.isTestData = { $ne: true };
    }

    // Payment Status Filter (PAID, UNPAID, or ALL)
    if (paymentStatus && paymentStatus !== 'ALL') {
      if (paymentStatus === 'PAID') {
        filter['payment.paymentStatus'] = 'PAID';
      } else if (paymentStatus === 'UNPAID') {
        filter['$or'] = [
          { 'payment.paymentStatus': { $ne: 'PAID' } },
          { payment: { $exists: false } }
        ];
      }
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
    if (!payload.id) {
      payload.id = 'UW-ORD-' + Math.floor(1000 + Math.random() * 9000);
    }
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

      // Unpaid Order Fulfilment Protection:
      // Prevent unpaid/pending Portal Direct Orders from advancing into manufacturing (Stage 2+)
      // without explicit admin authorization (allowUnpaidAdvance: true).
      // Offline factory orders and quotation orders remain unrestricted.
      if (oldOrder.orderType === 'PortalDirectOrder' && idx > 1) {
        const isPaid = oldOrder.payment && oldOrder.payment.paymentStatus === 'PAID';
        if (!isPaid && !req.body.allowUnpaidAdvance) {
          return res.status(400).json({
            success: false,
            unpaidBlocked: true,
            message: `Unpaid Order Protection: Order ${oldOrder.id} is a Portal Direct Order with payment status '${(oldOrder.payment && oldOrder.payment.paymentStatus) || 'PENDING'}'. Cannot advance into manufacturing (Stage ${idx}) without confirmed payment or explicit admin override.`
          });
        }
      }

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

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const targetQuery = getOrderQuery(req.params.id);
    const order = await Order.findOne(targetQuery).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found.' });
    }
    // Security: Customer can only view their own order
    if (req.user && req.user.role === 'Customer' && order.clientEmail !== req.user.email.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied: Customer cannot access foreign orders.' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/mark-test
const markOrderTest = async (req, res, next) => {
  try {
    const targetQuery = getOrderQuery(req.params.id);
    const order = await Order.findOne(targetQuery);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const isTest = req.body.isTestData !== undefined ? Boolean(req.body.isTestData) : true;

    if (isTest) {
      // FINANCIAL INTEGRITY & SECURITY GUARD:
      // A genuine paid Production order or live non-sandbox transaction CANNOT be marked as test data.
      const isPaid = order.payment && order.payment.paymentStatus === 'PAID';
      const isProductionGateway = (order.payment && order.payment.gatewayEnvironment === 'PRODUCTION') ||
                                  (order.gatewayEnvironment === 'PRODUCTION');
      const isNonSandboxPaid = isPaid && (order.payment?.gatewayEnvironment !== 'SANDBOX');
      const isLiveFactoryOrder = order.orderType === 'FactoryOrder' && order.currentStageIndex > 1;

      if (isProductionGateway || isNonSandboxPaid || (isPaid && isProductionGateway)) {
        return res.status(400).json({
          success: false,
          securityBlock: true,
          message: `Security & Financial Integrity Block: Order ${order.id} is a genuine paid production record (Environment: ${order.payment?.gatewayEnvironment || 'PRODUCTION'}, Status: ${order.payment?.paymentStatus || 'PAID'}). Production financial records cannot be flagged as test data.`
        });
      }

      if (isLiveFactoryOrder) {
        return res.status(400).json({
          success: false,
          securityBlock: true,
          message: `Security Block: Order ${order.id} is an active factory manufacturing order currently in Stage ${order.currentStageIndex}. Live production manufacturing orders cannot be flagged as test data.`
        });
      }
    }

    order.isTestData = isTest;
    await order.save();

    await logActivity(
      isTest ? 'Order Flagged as Test Data' : 'Order Unflagged as Test Data',
      `Order ${order.id} marked as ${isTest ? 'Synthetic Test Order' : 'Production Live Order'} by ${req.user ? req.user.email : 'Admin'}`
    );

    res.json({
      success: true,
      data: order,
      message: isTest ? `Order ${order.id} marked as test data.` : `Order ${order.id} marked as live order.`
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/orders/:id/archive
const archiveOrder = async (req, res, next) => {
  try {
    const targetQuery = getOrderQuery(req.params.id);
    const isArchived = req.body.isArchived !== undefined ? Boolean(req.body.isArchived) : true;
    const order = await Order.findOneAndUpdate(
      targetQuery,
      {
        isArchived,
        archivedAt: isArchived ? new Date() : null,
        archivedBy: isArchived ? (req.user ? req.user.email : 'Admin') : ''
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    await logActivity(
      isArchived ? 'Order Archived' : 'Order Restored',
      `Order ${order.id} ${isArchived ? 'archived' : 'restored from archive'} by ${req.user ? req.user.email : 'Admin'}`
    );

    res.json({
      success: true,
      data: order,
      message: isArchived ? `Order ${order.id} archived successfully.` : `Order ${order.id} restored successfully.`
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const targetQuery = getOrderQuery(req.params.id);
    const order = await Order.findOne(targetQuery);
    if (!order) return res.status(404).json({ success: false, message: 'Order record not found.' });

    // CRITICAL PRODUCTION SAFETY & FINANCIAL INTEGRITY DEFENSE:
    // Defense Layer 1: Must be explicitly flagged as test data
    if (!order.isTestData) {
      return res.status(400).json({
        success: false,
        permanentDeletionBlocked: true,
        securityBlock: true,
        message: `Deletion Blocked: Order ${order.id} is a live production record. Only orders explicitly marked as synthetic test data (isTestData) can be permanently deleted. You may archive this order instead.`
      });
    }

    // Defense Layer 2: Reliable test-data provenance and non-production payment-environment checks
    // Even if an administrator toggled isTestData, an order with Production gateway provenance or genuine paid status can NEVER be deleted!
    const isProductionGateway = (order.payment && order.payment.gatewayEnvironment === 'PRODUCTION') ||
                                (order.gatewayEnvironment === 'PRODUCTION');
    const isNonSandboxPaid = (order.payment && order.payment.paymentStatus === 'PAID') &&
                             (order.payment?.gatewayEnvironment !== 'SANDBOX');

    if (isProductionGateway || isNonSandboxPaid) {
      return res.status(403).json({
        success: false,
        permanentDeletionBlocked: true,
        securityBlock: true,
        message: `Financial Integrity Violation: Permanent deletion blocked for order ${order.id}. This order has Production gateway provenance (${order.payment?.gatewayEnvironment || 'PRODUCTION'}) or non-sandbox paid settlement. Production financial and audit records cannot be permanently deleted under any circumstances; archive the record instead.`
      });
    }

    // Defense Layer 3: Completed offline/factory orders check
    if (order.orderType === 'FactoryOrder' && order.currentStageIndex > 1) {
      return res.status(403).json({
        success: false,
        permanentDeletionBlocked: true,
        securityBlock: true,
        message: `Manufacturing Integrity Block: Permanent deletion blocked for factory order ${order.id} in Stage ${order.currentStageIndex}. Orders in manufacturing workflow cannot be permanently deleted.`
      });
    }

    // Passed all guards: Legitimate Sandbox test order or synthetic local test data cleanup
    await Order.findOneAndDelete(targetQuery);

    await logActivity(
      'Test Order Deleted',
      `Synthetic test order ${order.id} (${order.productName || 'Order'}, ₹${order.grandTotal || 0}) permanently deleted by ${req.user ? req.user.email : 'Admin'}`
    );

    res.json({ success: true, message: `Synthetic test order ${order.id} has been permanently removed.` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  markOrderTest,
  archiveOrder,
  deleteOrder
};
