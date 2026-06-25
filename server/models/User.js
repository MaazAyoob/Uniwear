const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Customer', 'Admin', 'Super Admin', 'Sales Executive', 'Production Manager'],
    default: 'Customer'
  },
  companyName: { type: String, default: '' },
  representative: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Disabled', 'Info Requested'],
    default: 'Pending'
  },
  regDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
