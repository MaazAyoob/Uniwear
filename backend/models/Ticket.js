const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['client', 'admin'], required: true },
  text: { type: String, required: true },
  time: { type: String, default: () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
}, { _id: false });

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientEmail: { type: String, required: true, lowercase: true },
  subject: { type: String, required: true },
  category: { type: String, default: 'General' },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Pending'],
    default: 'Open'
  },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  messages: { type: [messageSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
