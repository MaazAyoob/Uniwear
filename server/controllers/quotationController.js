const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendMail, emailTemplates } = require('../config/mailer');
const CompanySettings = require('../models/CompanySettings');

// GET /api/quotations
const getQuotations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.clientEmail) filter.clientEmail = req.query.clientEmail.toLowerCase();
    const quotations = await Quotation.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: quotations });
  } catch (err) {
    next(err);
  }
};

// POST /api/quotations
const createQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.create(req.body);

    // Send quotation created email to customer (non-blocking & safe try-catch wrapper)
    try {
      const settings = await CompanySettings.findOne().lean() || {};
      sendMail(emailTemplates.quotationCreated(quotation, settings))
        .catch(err => console.error('[Mailer Trigger Error] quotationCreated failed:', err.message));
    } catch (mailErr) {
      console.error('[Mailer Trigger Error] quotationCreated generation failed:', mailErr.message);
    }

    res.status(201).json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/quotations/:id
const updateQuotation = async (req, res, next) => {
  try {
    const oldQuotation = await Quotation.findById(req.params.id);
    if (!oldQuotation) return res.status(404).json({ success: false, message: 'Quotation not found.' });

    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // Email Triggers post-DB write wrapped in safe try-catch
    const settings = await CompanySettings.findOne().lean() || {};

    // 1. Quotation Revision
    if (req.body.status === 'Revised' && oldQuotation.status !== 'Revised') {
      try {
        sendMail(emailTemplates.quotationRevised(quotation, settings))
          .catch(err => console.error('[Mailer Trigger Error] quotationRevised failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] quotationRevised generation failed:', mailErr.message);
      }
    }

    // 2. Quotation Approval & Order Conversion
    if (req.body.status === 'Approved' && oldQuotation.status !== 'Approved') {
      const orderId = `UW-ORD-${Math.floor(800 + Math.random() * 199)}`;
      const order = await Order.create({
        id: orderId,
        clientEmail: quotation.clientEmail,
        productName: quotation.productClass,
        volume: quotation.volume,
        value: quotation.value,
        deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        statusStep: 1,
        statusText: 'Order logged, procurement initiated.'
      });

      // Notifications
      await Notification.create({
        recipient: quotation.clientEmail,
        title: 'Order Process Initiated',
        text: `Contract ${orderId} successfully generated from your approved quotation.`,
        time: 'Just now'
      });
      await Notification.create({
        recipient: 'admin',
        title: 'Quotation Approved by Customer',
        text: `${quotation.clientEmail} approved quote ${quotation.id}. Order ${orderId} created.`,
        time: 'Just now'
      });

      const user = await User.findOne({ email: quotation.clientEmail }).lean();

      // Quotation Approved (Admin Alert)
      try {
        sendMail(emailTemplates.quotationApproved(quotation, user, settings))
          .catch(err => console.error('[Mailer Trigger Error] quotationApproved failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] quotationApproved generation failed:', mailErr.message);
      }

      // Order Created (Customer Copy)
      try {
        sendMail(emailTemplates.orderCreatedCustomer(order, settings))
          .catch(err => console.error('[Mailer Trigger Error] orderCreatedCustomer failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] orderCreatedCustomer generation failed:', mailErr.message);
      }

      // Order Created (Admin Copy)
      try {
        sendMail(emailTemplates.orderCreatedAdmin(order, settings))
          .catch(err => console.error('[Mailer Trigger Error] orderCreatedAdmin failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] orderCreatedAdmin generation failed:', mailErr.message);
      }
    }

    res.json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuotations, createQuotation, updateQuotation };
