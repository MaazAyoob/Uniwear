const mongoose = require('mongoose');

const customerProductSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.Mixed
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  visible: {
    type: Boolean,
    default: true
  },
  customPrice: {
    type: Number,
    default: null
  },
  customMOQ: {
    type: Number,
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  availableSizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL', '2XL']
  },
  approvedVariants: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Archived', 'Inactive'],
    default: 'Active'
  },
  taxPercent: {
    type: Number,
    default: 5
  },
  hsnCode: {
    type: String,
    default: '6109'
  },
  deliveryLeadDays: {
    type: String,
    default: '10–15 working days'
  },
  paymentTerms: {
    type: String,
    default: 'Full payment online'
  },
  effectiveDateStart: {
    type: Date,
    default: null
  },
  effectiveDateEnd: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure unique customer-product pair
customerProductSchema.index({ customerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('CustomerProduct', customerProductSchema);
