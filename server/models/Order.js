const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientEmail: { type: String, required: true, lowercase: true },
  productName: { type: String, default: '' },
  volume: { type: Number, default: 0 },
  value: { type: String, default: '' },
  deliveryDate: { type: String, default: '' },
  statusStep: { type: Number, min: 1, max: 5, default: 1 },
  statusText: { type: String, default: 'Order logged' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
