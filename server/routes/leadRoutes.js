const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { protect, adminOnly } = require('../middleware/auth');

// POST is public (contact form, design studio, chatbot – no auth)
router.post('/', createLead);

// GET, PATCH and DELETE are admin-only
router.get('/', protect, adminOnly, getLeads);
router.patch('/:id', protect, adminOnly, updateLead);
router.delete('/:id', protect, adminOnly, deleteLead);

module.exports = router;
