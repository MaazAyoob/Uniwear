const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  id: { type: Number },
  recipient: { type: String, required: true }, // 'admin' or email address
  title: { type: String, required: true },
  text: { type: String, default: '' },
  time: { type: String, default: 'Just now' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
