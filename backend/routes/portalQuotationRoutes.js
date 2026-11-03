const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  previewQuotation,
  saveQuotation,
  getQuotationDoc
} = require('../controllers/portalQuotationController');

router.post('/preview', protect, previewQuotation);
router.post('/save', protect, saveQuotation);
router.get('/:id', protect, getQuotationDoc);

module.exports = router;

