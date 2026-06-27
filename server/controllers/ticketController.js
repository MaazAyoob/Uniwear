const Ticket = require('../models/Ticket');
const CompanySettings = require('../models/CompanySettings');
const { sendMail, emailTemplates } = require('../config/mailer');

// GET /api/tickets
const getTickets = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.clientEmail) filter.clientEmail = req.query.clientEmail.toLowerCase();
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: tickets });
  } catch (err) {
    next(err);
  }
};

// POST /api/tickets
const createTicket = async (req, res, next) => {
  try {
    const { clientEmail, subject, category, message, priority } = req.body;
    const ticketId = `UW-TCK-${Math.floor(900 + Math.random() * 99)}`;
    const ticket = await Ticket.create({
      id: ticketId,
      clientEmail: clientEmail.toLowerCase(),
      subject,
      category: category || 'General',
      priority: priority || 'Medium',
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      messages: message ? [{ sender: 'client', text: message }] : []
    });

    // Send support ticket created email to admin (non-blocking & safe try-catch wrapper)
    try {
      const settings = await CompanySettings.findOne().lean() || {};
      sendMail(emailTemplates.supportTicketCreated(ticket, settings))
        .catch(err => console.error('[Mailer Trigger Error] supportTicketCreated failed:', err.message));
    } catch (mailErr) {
      console.error('[Mailer Trigger Error] supportTicketCreated generation failed:', mailErr.message);
    }

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tickets/:id
const updateTicket = async (req, res, next) => {
  try {
    const { message, sender, ...rest } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });

    const oldStatus = ticket.status;

    // Append a new message if provided
    if (message && sender) {
      ticket.messages.push({ sender, text: message });
    }
    Object.assign(ticket, rest);
    await ticket.save();

    // Email Triggers post-DB write wrapped in safe try-catch
    try {
      const settings = await CompanySettings.findOne().lean() || {};

      // 1. Reply Notifications
      if (message && sender) {
        if (sender === 'client') {
          try {
            sendMail(emailTemplates.customerReplyNotification(ticket, message, settings))
              .catch(err => console.error('[Mailer Trigger Error] customerReplyNotification failed:', err.message));
          } catch (mailErr) {
            console.error('[Mailer Trigger Error] customerReplyNotification generation failed:', mailErr.message);
          }
        } else if (sender === 'admin') {
          try {
            sendMail(emailTemplates.adminReplyNotification(ticket, message, settings))
              .catch(err => console.error('[Mailer Trigger Error] adminReplyNotification failed:', err.message));
          } catch (mailErr) {
            console.error('[Mailer Trigger Error] adminReplyNotification generation failed:', mailErr.message);
          }
        }
      }

      // 2. Ticket Closed Notification
      if (rest.status === 'Closed' && oldStatus !== 'Closed') {
        try {
          sendMail(emailTemplates.ticketClosed(ticket, settings))
            .catch(err => console.error('[Mailer Trigger Error] ticketClosed failed:', err.message));
        } catch (mailErr) {
          console.error('[Mailer Trigger Error] ticketClosed generation failed:', mailErr.message);
        }
      }
    } catch (settingsErr) {
      console.error('[Mailer Trigger Error] Settings lookup failed during ticket update:', settingsErr.message);
    }

    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTickets, createTicket, updateTicket };
