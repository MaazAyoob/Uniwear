const express = require('express');
const router = express.Router();
const { getQuotations, createQuotation, updateQuotation } = require('../controllers/quotationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getQuotations);
router.post('/', protect, createQuotation);
router.patch('/:id', protect, updateQuotation);

module.exports = router;
