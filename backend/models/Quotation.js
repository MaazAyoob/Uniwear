const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 }
}, { _id: false });

const quotationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  quotationNumber: { type: String, default: '' },
  clientEmail: { type: String, required: true, lowercase: true },
  clientCompany: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  productClass: { type: String, default: '' },
  volume: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  value: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Draft', 'Under Review', 'Sent to Client', 'Follow-up Required', 'Negotiation', 'Approved', 'Rejected', 'Converted to Order', 'Awaiting Admin Review', 'Revised', 'Closed'],
    default: 'Under Review'
  },
  assignedSalesperson: { type: String, default: 'Unassigned' },
  followUpDate: { type: String, default: '' },
  internalNotes: { type: String, default: '' },
  items: [quotationItemSchema],
  taxes: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  paymentTerms: { type: String, default: '50% advance upon PO, 50% against dispatch.' },
  deliveryTerms: { type: String, default: 'Ex-factory Bengaluru. Transport charges as applicable.' },
  validity: { type: String, default: '30 Days from Date of Quotation' },
  termsConditions: { type: String, default: 'Standard Uniwear Terms: Custom embroidered/branded goods cannot be returned once sample is approved.' },
  specs: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
