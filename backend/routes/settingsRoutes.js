const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET is public so front-end can load branding without auth
router.get('/', getSettings);

// PATCH is admin-only; optional multipart upload for logo/favicon
router.patch(
  '/',
  protect,
  adminOnly,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]),
  updateSettings
);

module.exports = router;
