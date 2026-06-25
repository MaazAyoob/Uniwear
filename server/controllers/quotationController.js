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
    res.status(201).json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/quotations/:id
const updateQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found.' });

    // If customer approved the quotation, auto-create an order and send email
    if (req.body.status === 'Approved') {
      const orderId = `UW-ORD-${Math.floor(800 + Math.random() * 199)}`;
      await Order.create({
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

      const settings = await CompanySettings.findOne().lean() || {};
      const user = await User.findOne({ email: quotation.clientEmail }).lean();
      sendMail(emailTemplates.quotationApproved(quotation, user, settings));
    }

    res.json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuotations, createQuotation, updateQuotation };
