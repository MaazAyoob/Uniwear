const CompanySettings = require('../models/CompanySettings');
const { sendMail, emailTemplates } = require('../config/mailer');
const Notification = require('../models/Notification');

const mongoose = require('mongoose');

const logActivity = async (action, details, user = 'Admin') => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Notification.create({ recipient: 'admin', title: action, text: details || action, time: 'Just now' });
    }
  } catch (err) {
    console.error('[logActivity Error]', err.message);
  }
};

const DEFAULT_VIDEO_REVIEWS = [
  {
    customerName: 'Anjali',
    projectLocation: 'Wipro · Corporate Procurement (Bengaluru)',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'assets/images/industries/corporate-uniforms.png',
    testimonialSummary: 'UNIWEAR has been an exceptional manufacturing partner. Their attention to fabric durability and tailoring precision is outstanding across all corporate and gifting orders.',
    visible: true,
    order: 1
  },
  {
    customerName: 'Bhavya',
    projectLocation: 'OTIS · Operations Manager (Bengaluru)',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'assets/images/industries/industrial-workwear.png',
    testimonialSummary: "UNIWEAR's uniforms speak volumes about quality. With their durable workwear, technical shirts, and safety apparel, our team across nationwide locations is always ready.",
    visible: true,
    order: 2
  },
  {
    customerName: 'Sonia Murdeshwar',
    projectLocation: 'Schneider Electric · Procurement Director (Bengaluru)',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'assets/images/industries/hospitality-attire.png',
    testimonialSummary: 'What sets UNIWEAR apart is their reliability. They consistently meet tight enterprise deadlines with zero compromise on quality standards and post-delivery support.',
    visible: true,
    order: 3
  }
];

// GET /api/company-settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
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
        ],
        videoReviews: DEFAULT_VIDEO_REVIEWS,
        videoDisplayLimit: 3
      });
    } else if (!settings.videoReviews || settings.videoReviews.length === 0) {
      settings.videoReviews = DEFAULT_VIDEO_REVIEWS;
      if (settings.videoDisplayLimit === undefined) settings.videoDisplayLimit = 3;
      await settings.save();
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

// PATCH /api/company-settings/section/:sectionKey OR PUT /api/company-settings/section/:sectionKey
const updateSection = async (req, res, next) => {
  try {
    const sectionKey = req.params.sectionKey || req.body.sectionKey || req.body.section;

    if (!sectionKey) {
      return res.status(400).json({ success: false, message: 'No section key specified.' });
    }

    // Determine the section data from various possible payload formats
    let sectionData = req.body.sectionData !== undefined 
      ? req.body.sectionData 
      : (req.body.data !== undefined ? req.body.data : req.body);

    // If sectionData was sent as a JSON string (e.g. via multipart form)
    if (typeof sectionData === 'string') {
      try {
        sectionData = JSON.parse(sectionData);
      } catch (_) {}
    }

    // Unwrap if nested under the sectionKey itself
    if (sectionData && typeof sectionData === 'object' && sectionData[sectionKey] !== undefined) {
      sectionData = sectionData[sectionKey];
    }

    // Remove wrapper keys if raw body was used
    if (sectionData && typeof sectionData === 'object' && !Array.isArray(sectionData)) {
      const cleanData = { ...sectionData };
      delete cleanData.sectionKey;
      delete cleanData.section;
      sectionData = cleanData;
    }

    // Validation: Check for valid non-empty section data
    const isValid = sectionData !== undefined && sectionData !== null && 
      (typeof sectionData === 'object' ? Object.keys(sectionData).length > 0 : String(sectionData).trim().length > 0);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'No valid section data provided to update'
      });
    }

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }

    // Assign and save to MongoDB
    if (Array.isArray(sectionData)) {
      settings[sectionKey] = sectionData;
    } else if (typeof sectionData === 'object' && typeof settings[sectionKey] === 'object' && !Array.isArray(settings[sectionKey])) {
      settings[sectionKey] = Object.assign(settings[sectionKey] || {}, sectionData);
    } else {
      settings[sectionKey] = sectionData;
    }

    settings.markModified(sectionKey);
    await settings.save();

    await logActivity('Homepage Section Updated', `Section "${sectionKey}" was updated in CMS settings.`);

    res.json({
      success: true,
      message: `Section "${sectionKey}" updated successfully.`,
      data: settings
    });
  } catch (err) {
    next(err);
  }
};

// ─── Video Reviews Handlers ───────────────────────────────────────────────────

// GET /api/company-settings/video-reviews
const getVideoReviews = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings || !settings.videoReviews || settings.videoReviews.length === 0) {
      if (settings) {
        settings.videoReviews = DEFAULT_VIDEO_REVIEWS;
        settings.videoDisplayLimit = 3;
        await settings.save();
      }
    }

    const reviews = (settings && settings.videoReviews) ? settings.videoReviews : DEFAULT_VIDEO_REVIEWS;
    const limit = (settings && settings.videoDisplayLimit !== undefined) ? settings.videoDisplayLimit : 3;

    const isAdmin = req.user && (req.user.role === 'Admin' || req.user.role === 'Super Admin');
    let results = [...reviews];

    if (!isAdmin) {
      results = results.filter(r => r.visible !== false);
    }

    results.sort((a, b) => (a.order || 0) - (b.order || 0));

    if (!isAdmin && limit > 0) {
      results = results.slice(0, limit);
    }

    res.json({
      success: true,
      displayLimit: limit,
      totalCount: reviews.length,
      videoReviews: results,
      videoDisplayLimit: limit,
      data: {
        videoReviews: results,
        videoDisplayLimit: limit
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/company-settings/video-reviews
const addVideoReview = async (req, res, next) => {
  try {
    const { customerName, projectLocation, youtubeUrl, thumbnailUrl, testimonialSummary, visible, order } = req.body;

    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!youtubeUrl || !youtubeUrl.trim()) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required.' });
    }

    let settings = await CompanySettings.findOne();
    if (!settings) settings = await CompanySettings.create({});
    if (!settings.videoReviews) settings.videoReviews = [];

    const newOrder = order !== undefined && order !== '' ? Number(order) : (settings.videoReviews.length + 1);

    const newReview = {
      _id: new mongoose.Types.ObjectId(),
      customerName: customerName.trim(),
      projectLocation: projectLocation ? projectLocation.trim() : '',
      youtubeUrl: youtubeUrl.trim(),
      thumbnailUrl: thumbnailUrl ? thumbnailUrl.trim() : 'assets/images/industries/corporate-uniforms.png',
      testimonialSummary: testimonialSummary ? testimonialSummary.trim() : '',
      visible: visible !== undefined ? Boolean(visible) : true,
      order: newOrder
    };

    settings.videoReviews.push(newReview);
    settings.markModified('videoReviews');
    await settings.save();

    await logActivity('Video Review Added', `New video review for "${customerName}" added.`);

    const created = settings.videoReviews[settings.videoReviews.length - 1];
    res.status(201).json({
      success: true,
      message: 'Video review added successfully.',
      data: created,
      allReviews: settings.videoReviews
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/company-settings/video-reviews/:id
const updateVideoReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const { customerName, projectLocation, youtubeUrl, thumbnailUrl, testimonialSummary, visible, order } = req.body;

    let settings = await CompanySettings.findOne();
    if (!settings || !settings.videoReviews) {
      return res.status(404).json({ success: false, message: 'Video reviews not found.' });
    }

    const review = settings.videoReviews.id(reviewId) || settings.videoReviews.find(r => String(r._id) === String(reviewId));
    if (!review) {
      return res.status(404).json({ success: false, message: 'Video review not found.' });
    }

    if (customerName !== undefined) review.customerName = customerName.trim();
    if (projectLocation !== undefined) review.projectLocation = projectLocation.trim();
    if (youtubeUrl !== undefined) review.youtubeUrl = youtubeUrl.trim();
    if (thumbnailUrl !== undefined) review.thumbnailUrl = thumbnailUrl.trim();
    if (testimonialSummary !== undefined) review.testimonialSummary = testimonialSummary.trim();
    if (visible !== undefined) review.visible = Boolean(visible);
    if (order !== undefined && order !== '') review.order = Number(order);

    settings.markModified('videoReviews');
    await settings.save();

    await logActivity('Video Review Updated', `Video review for "${review.customerName}" updated.`);

    res.json({
      success: true,
      message: 'Video review updated successfully.',
      data: review,
      allReviews: settings.videoReviews
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/company-settings/video-reviews/:id
const deleteVideoReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    let settings = await CompanySettings.findOne();
    if (!settings || !settings.videoReviews) {
      return res.status(404).json({ success: false, message: 'Video reviews not found.' });
    }

    const initialLength = settings.videoReviews.length;
    settings.videoReviews = settings.videoReviews.filter(r => String(r._id) !== String(reviewId));

    if (settings.videoReviews.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Video review not found.' });
    }

    settings.markModified('videoReviews');
    await settings.save();

    await logActivity('Video Review Deleted', `Video review ${reviewId} deleted.`);

    res.json({
      success: true,
      message: 'Video review deleted successfully.',
      allReviews: settings.videoReviews
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/company-settings/video-reviews-limit
const updateVideoDisplayLimit = async (req, res, next) => {
  try {
    const { limit } = req.body;
    const numLimit = parseInt(limit, 10);

    if (isNaN(numLimit) || numLimit < 1) {
      return res.status(400).json({ success: false, message: 'Display limit must be a positive integer.' });
    }

    let settings = await CompanySettings.findOne();
    if (!settings) settings = await CompanySettings.create({});

    settings.videoDisplayLimit = numLimit;
    settings.markModified('videoDisplayLimit');
    await settings.save();

    await logActivity('Video Display Limit Updated', `Display limit set to ${numLimit}.`);

    res.json({
      success: true,
      message: `Video display limit updated to ${numLimit}.`,
      videoDisplayLimit: numLimit,
      data: {
        videoDisplayLimit: numLimit
      }
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/company-settings/video-reviews-reorder
const reorderVideoReviews = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({ success: false, message: 'orderedIds array is required.' });
    }

    let settings = await CompanySettings.findOne();
    if (!settings || !settings.videoReviews) {
      return res.status(404).json({ success: false, message: 'Video reviews not found.' });
    }

    orderedIds.forEach((id, index) => {
      const review = settings.videoReviews.id(id) || settings.videoReviews.find(r => String(r._id) === String(id));
      if (review) {
        review.order = index + 1;
      }
    });

    settings.videoReviews.sort((a, b) => (a.order || 0) - (b.order || 0));
    settings.markModified('videoReviews');
    await settings.save();

    res.json({
      success: true,
      message: 'Video reviews reordered successfully.',
      allReviews: settings.videoReviews
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  updateSection,
  getVideoReviews,
  addVideoReview,
  updateVideoReview,
  deleteVideoReview,
  updateVideoDisplayLimit,
  reorderVideoReviews
};
