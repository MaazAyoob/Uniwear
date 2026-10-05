const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendMail, emailTemplates } = require('../config/mailer');
const CompanySettings = require('../models/CompanySettings');

// Activity logger helper
const logActivity = async (action, details, user = 'Admin') => {
  try {
    await Notification.create({ recipient: 'admin', title: action, text: details || action, time: 'Just now' });
  } catch (err) {
    console.error('[logActivity Error]', err.message);
  }
};

// GET /api/quotations
const getQuotations = async (req, res, next) => {
  try {
    const { search, status, salesperson, dateFrom, dateTo, minAmount, maxAmount } = req.query;
    const filter = {};

    // SECURITY: Customers can only view their own quotations.
    // Ignore any clientEmail query param from the browser for Customer role.
    if (req.user && req.user.role === 'Customer') {
      filter.clientEmail = req.user.email.toLowerCase();
    } else if (req.query.clientEmail) {
      filter.clientEmail = req.query.clientEmail.toLowerCase();
    }
    if (status && status !== 'All') filter.status = status;
    if (salesperson) filter.assignedSalesperson = salesperson;
    
    if (search) {
      filter.$or = [
        { id: { $regex: search, $options: 'i' } },
        { quotationNumber: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { clientCompany: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { productClass: { $regex: search, $options: 'i' } }
      ];
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const quotations = await Quotation.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: quotations });
  } catch (err) {
    next(err);
  }
};

// POST /api/quotations
const createQuotation = async (req, res, next) => {
  try {
    const quotationData = { ...req.body };
    if (!quotationData.id) {
      quotationData.id = `UW-QT-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    if (!quotationData.quotationNumber) {
      quotationData.quotationNumber = quotationData.id;
    }
    if (quotationData.volume !== undefined) {
      quotationData.volume = parseInt(String(quotationData.volume).replace(/[^0-9]/g, '')) || 0;
    }
    if (!quotationData.amount && quotationData.value) {
      quotationData.amount = parseInt(String(quotationData.value).replace(/[^0-9]/g, '')) || 0;
    }
    if (quotationData.amount && !quotationData.value) {
      quotationData.value = '₹' + Number(quotationData.amount).toLocaleString('en-IN');
    }

    const quotation = await Quotation.create(quotationData);
    await logActivity('Quotation Created', `Quotation ${quotation.id} created for ${quotation.clientEmail}`);

    try {
      const settings = await CompanySettings.findOne().lean() || {};
      if (req.user && req.user.role === 'Customer') {
        sendMail(emailTemplates.quotationRequestedAdmin(quotation, settings)).catch(e => {});
      } else {
        sendMail(emailTemplates.quotationCreated(quotation, settings)).catch(e => {});
      }
    } catch (e) {}

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

    const updates = { ...req.body };
    if (updates.volume !== undefined) {
      updates.volume = parseInt(String(updates.volume).replace(/[^0-9]/g, '')) || 0;
    }
    if (!updates.amount && updates.value) {
      updates.amount = parseInt(String(updates.value).replace(/[^0-9]/g, '')) || 0;
    }
    if (updates.amount && !updates.value) {
      updates.value = '₹' + Number(updates.amount).toLocaleString('en-IN');
    }

    const quotation = await Quotation.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    await logActivity('Quotation Updated', `Quotation ${quotation.id} status set to ${quotation.status}`);

    const settings = await CompanySettings.findOne().lean() || {};

    if (req.body.status === 'Revised' && oldQuotation.status !== 'Revised') {
      try { sendMail(emailTemplates.quotationRevised(quotation, settings)).catch(e => {}); } catch (e) {}
    }

    // Convert to order when status becomes Approved or Converted to Order
    if ((req.body.status === 'Approved' || req.body.status === 'Converted to Order') && oldQuotation.status !== 'Approved' && oldQuotation.status !== 'Converted to Order') {
      const orderId = `UW-ORD-${Math.floor(800 + Math.random() * 199)}`;
      const cleanVolume = parseInt(String(quotation.volume).replace(/[^0-9]/g, '')) || 0;
      const order = await Order.create({
        id: orderId,
        clientEmail: quotation.clientEmail,
        clientCompany: quotation.clientCompany || '',
        contactPerson: quotation.contactPerson || '',
        contactNumber: quotation.contactNumber || '',
        productName: quotation.productClass,
        volume: cleanVolume,
        value: quotation.value || `₹${(quotation.grandTotal || quotation.amount || 0).toLocaleString('en-IN')}`,
        deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        statusStep: 1,
        statusText: '01. Quotation & Contract Finalized',
        currentStageIndex: 1,
        currentStageName: '01. Quotation & Contract Finalized'
      });

      await Notification.create({
        recipient: quotation.clientEmail,
        title: 'Order Process Initiated',
        text: `Contract ${orderId} successfully generated from your approved quotation.`,
        time: 'Just now'
      });

      const user = await User.findOne({ email: quotation.clientEmail }).lean();
      try {
        sendMail(emailTemplates.quotationApproved(quotation, user, settings)).catch(e => {});
        sendMail(emailTemplates.orderCreatedCustomer(order, settings)).catch(e => {});
        sendMail(emailTemplates.orderCreatedAdmin(order, settings)).catch(e => {});
      } catch (e) {}
    }

    res.json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuotations, createQuotation, updateQuotation };
