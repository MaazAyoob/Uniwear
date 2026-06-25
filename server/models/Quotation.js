const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientEmail: { type: String, required: true, lowercase: true },
  productClass: { type: String, default: '' },
  volume: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  value: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Awaiting Admin Review', 'Approved', 'Revised', 'Rejected', 'Closed'],
    default: 'Awaiting Admin Review'
  },
  specs: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
