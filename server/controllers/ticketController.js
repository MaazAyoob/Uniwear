const Ticket = require('../models/Ticket');

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
    const { clientEmail, subject, category, message } = req.body;
    const ticketId = `UW-TCK-${Math.floor(900 + Math.random() * 99)}`;
    const ticket = await Ticket.create({
      id: ticketId,
      clientEmail: clientEmail.toLowerCase(),
      subject,
      category: category || 'General',
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      messages: message ? [{ sender: 'client', text: message }] : []
    });
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

    // Append a new message if provided
    if (message && sender) {
      ticket.messages.push({ sender, text: message });
    }
    Object.assign(ticket, rest);
    await ticket.save();

    res.json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTickets, createTicket, updateTicket };
