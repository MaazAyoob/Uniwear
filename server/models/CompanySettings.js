const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'UNIWEAR' },
  supportEmail: { type: String, default: 'connect@uniwear.co' },
  salesEmail: { type: String, default: 'sales@uniwear.co' },
  notificationEmail: { type: String, default: 'connect@uniwear.co' },
  ccEmail: { type: String, default: '' },
  phone: { type: String, default: '91087 65831, 98459 32201' },
  address: { type: String, default: 'No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070' },
  logoUrl: { type: String, default: '' },
  faviconUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CompanySettings', companySettingsSchema);
