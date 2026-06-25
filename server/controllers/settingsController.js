const CompanySettings = require('../models/CompanySettings');

// GET /api/company-settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne().lean();
    if (!settings) {
      // Safety: create defaults if somehow missing
      settings = await CompanySettings.create({});
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

    // Handle logo/favicon base64 from multer memory upload if provided
    if (req.files) {
      if (req.files.logo) {
        const buf = req.files.logo[0].buffer;
        const mime = req.files.logo[0].mimetype;
        updates.logoUrl = `data:${mime};base64,${buf.toString('base64')}`;
      }
      if (req.files.favicon) {
        const buf = req.files.favicon[0].buffer;
        const mime = req.files.favicon[0].mimetype;
        updates.faviconUrl = `data:${mime};base64,${buf.toString('base64')}`;
      }
    }

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
