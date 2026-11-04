const mongoose = require('mongoose');

const taxAuditLogSchema = new mongoose.Schema({
  targetType: {
    type: String,
    enum: ['global', 'product', 'customer_product'],
    required: true
  },
  targetId: {
    type: String,
    default: ''
  },
  targetName: {
    type: String,
    default: ''
  },
  sku: {
    type: String,
    default: ''
  },
  customerEmail: {
    type: String,
    default: ''
  },
  customerId: {
    type: String,
    default: ''
  },
  previousRate: {
    type: Number,
    default: null
  },
  newRate: {
    type: Number,
    default: null
  },
  previousHsn: {
    type: String,
    default: ''
  },
  newHsn: {
    type: String,
    default: ''
  },
  adminId: {
    type: String,
    default: ''
  },
  adminEmail: {
    type: String,
    default: ''
  },
  changeReason: {
    type: String,
    default: 'Administrator tax update'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TaxAuditLog', taxAuditLogSchema);

