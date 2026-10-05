const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateSection,
  getVideoReviews,
  addVideoReview,
  updateVideoReview,
  deleteVideoReview,
  updateVideoDisplayLimit,
  reorderVideoReviews
} = require('../controllers/settingsController');
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

// Section CMS Endpoints (Admin Only)
router.patch('/sections/:sectionKey', protect, adminOnly, updateSection);
router.put('/sections/:sectionKey', protect, adminOnly, updateSection);
router.patch('/section/:sectionKey', protect, adminOnly, updateSection);
router.put('/section/:sectionKey', protect, adminOnly, updateSection);
router.patch('/section', protect, adminOnly, updateSection);
router.put('/section', protect, adminOnly, updateSection);

// Video Reviews Endpoints
router.get('/video-reviews', getVideoReviews); // Public access
router.post('/video-reviews', protect, adminOnly, addVideoReview);
router.put('/video-reviews-limit', protect, adminOnly, updateVideoDisplayLimit);
router.put('/video-reviews-reorder', protect, adminOnly, reorderVideoReviews);
router.put('/video-reviews/:id', protect, adminOnly, updateVideoReview);
router.delete('/video-reviews/:id', protect, adminOnly, deleteVideoReview);

module.exports = router;
