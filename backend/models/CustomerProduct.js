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
