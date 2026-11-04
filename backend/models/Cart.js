const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  sku: {
    type: String,
    default: ''
  },
  hsnCode: {
    type: String,
    default: '6109'
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  fabric: {
    type: String,
    default: ''
  },
  gsm: {
    type: String,
    default: ''
  },
  unitRate: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    default: 5
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  sizeBreakdown: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  moq: {
    type: Number,
    default: 100
  },
  lineTotal: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    index: true
  },
  clientEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 5
  },
  taxBreakdown: {
    taxType: { type: String, enum: ['intra_state', 'inter_state', 'undetermined'], default: 'intra_state' },
    taxRate: { type: Number, default: 5 },
    cgstRate: { type: Number, default: 2.5 },
    cgstAmount: { type: Number, default: 0 },
    sgstRate: { type: Number, default: 2.5 },
    sgstAmount: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    supplierGstin: { type: String, default: '' },
    customerGstin: { type: String, default: '' },
    placeOfSupply: { type: String, default: '' },
    isTaxInclusive: { type: Boolean, default: false }
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure one active cart per customer
cartSchema.index({ clientEmail: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
