const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  company: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  category: { type: String, default: 'General' },
  volume: { type: Number, default: 0 },
  details: { type: String, default: '' },
  stage: {
    type: String,
    enum: ['New Lead', 'Contacted', 'Quotation Sent', 'Negotiation', 'Closed Won', 'Closed Lost', 'Human Handoff'],
    default: 'New Lead'
  },
  source: { type: String, default: 'Contact Form' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
