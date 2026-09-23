const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const { sendMail, emailTemplates } = require('../config/mailer');
const CompanySettings = require('../models/CompanySettings');

// GET /api/leads
const getLeads = async (req, res, next) => {
  try {
    const { search, source, stage } = req.query;
    const filter = {};
    if (source && source !== 'All') {
      if (source === 'Chatbot') {
        filter.$or = [{ source: 'Chatbot' }, { source: 'AI Assistant' }];
      } else {
        filter.source = source;
      }
    }
    if (stage) filter.stage = stage;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();
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

    // Send email notification (non-blocking & safe try-catch wrapper)
    try {
      const settings = await CompanySettings.findOne().lean() || {};
      let template;
      if (req.body.source === 'Design Studio') {
        template = emailTemplates.designStudio(lead, req.body.customizations || {}, settings);
      } else if (req.body.source === 'Chatbot') {
        template = emailTemplates.chatbotHandoff(lead, settings);
      } else if (req.body.source === 'Sample Request') {
        template = emailTemplates.sampleRequest(lead, settings);
      } else {
        template = emailTemplates.newLead(lead, settings);
      }
      
      // Ensure sendMail is called safely and asynchronous failures don't crash the server
      sendMail(template).catch(err => console.error('[Mailer Trigger Error] Async sendMail failed:', err.message));
    } catch (mailErr) {
      console.error('[Mailer Trigger Error] Failed to generate email template for lead:', mailErr.message);
    }

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
