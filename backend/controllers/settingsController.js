const CompanySettings = require('../models/CompanySettings');
const { sendMail, emailTemplates } = require('../config/mailer');

const logActivity = async (action, details, user = 'Admin') => {};

// GET /api/company-settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne().lean();
    if (!settings) {
      settings = await CompanySettings.create({
        companyName: 'UNIWEAR',
        foundingYear: '1998',
        managingPartner: 'Suresh H. A.',
        supportEmail: 'connect@uniwear.co',
        salesEmail: 'sales@uniwear.co',
        phone: '+91 80 2658 0000, +91 91087 65831',
        address: 'No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070',
        homepageHero: {
          title: 'Uniforms That Represent Your Brand',
          subtitle: 'Industrial, corporate, hospitality, healthcare and institutional uniforms—along with premium corporate gifting—designed and manufactured in Bengaluru.',
          bannerUrl: "assets/images/hero/hero-banner.png",
          primaryCtaText: 'Request a Quote',
          primaryCtaLink: 'contact.html',
          secondaryCtaText: 'Explore Our Solutions',
          secondaryCtaLink: 'uniforms.html'
        },
        homepageStats: [
          { key: 'founding', label: 'Since 1998', value: '1998', numberValue: 1998 },
          { key: 'clients', label: '3,000+ Clients Served', value: '3,000+', numberValue: 3000 },
          { key: 'pincodes', label: 'Pan-India Coverage', value: 'Pan-India', numberValue: 100 },
          { key: 'delivery', label: 'Pan-India Delivery', value: 'Pan-India', numberValue: 100 }
        ],
        whyChooseUs: [
          { title: 'On-Time Delivery', subtitle: 'Optimized production scheduling ensuring deadlines are met consistently across bulk shipments.', icon: 'ri-time-line' },
          { title: 'Best-in-Class', subtitle: 'Rigorous 14-point fabric and stitch testing standards for structural longevity and comfort.', icon: 'ri-award-line' },
          { title: 'Enhanced Customer Experience', subtitle: 'Dedicated account management, custom fitting sampling, and real-time order tracking.', icon: 'ri-user-heart-line' }
        ]
      });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/company-settings
const updateSettings = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    const { saveBase64Image } = require('../middleware/upload');

    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        updates.logoUrl = `/storage/logos/${req.files.logo[0].filename}`;
      }
      if (req.files.favicon && req.files.favicon[0]) {
        updates.faviconUrl = `/storage/logos/${req.files.favicon[0].filename}`;
      }
    }

    if (updates.logoUrl && updates.logoUrl.startsWith('data:image/')) {
      updates.logoUrl = saveBase64Image(updates.logoUrl, 'logos', 'logo');
    }
    if (updates.faviconUrl && updates.faviconUrl.startsWith('data:image/')) {
      updates.faviconUrl = saveBase64Image(updates.faviconUrl, 'logos', 'favicon');
    }

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    await logActivity('Company Settings Updated', 'Global Company Settings and CMS attributes were updated.');

    try {
      sendMail(emailTemplates.settingsUpdated(settings)).catch(e => {});
    } catch (e) {}

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
