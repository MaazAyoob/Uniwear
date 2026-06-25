const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const { sendMail, emailTemplates } = require('../config/mailer');
const CompanySettings = require('../models/CompanySettings');

// GET /api/leads
const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
};

// POST /api/leads
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);

    // Admin notification
    await Notification.create({
      recipient: 'admin',
      title: 'New Lead Captured',
      text: `${lead.name} from ${lead.company} requested a consultation for ${lead.category}.`,
      time: 'Just now'
    });

    // Send email notification (non-blocking)
    const settings = await CompanySettings.findOne().lean() || {};
    const template = req.body.source === 'Design Studio'
      ? emailTemplates.designStudio(lead, settings)
      : req.body.source === 'Chatbot'
        ? emailTemplates.chatbotHandoff(lead, settings)
        : emailTemplates.newLead(lead, settings);

    sendMail(template);

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/leads/:id
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found.' });
    res.json({ success: true, message: 'Lead deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLeads, createLead, updateLead, deleteLead };
