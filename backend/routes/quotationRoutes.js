const express = require('express');
const router = express.Router();
const {
  getQuotations,
  createQuotation,
  updateQuotation,
  archiveQuotation,
  deleteQuotation
} = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getQuotations);
router.post('/', protect, createQuotation);
router.patch('/:id', protect, updateQuotation);
router.patch('/:id/archive', protect, archiveQuotation);
router.delete('/:id', protect, deleteQuotation);

module.exports = router;
