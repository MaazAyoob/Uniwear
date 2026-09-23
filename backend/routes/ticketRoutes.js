const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket } = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTickets);
router.post('/', protect, createTicket);
router.patch('/:id', protect, updateTicket);

module.exports = router;
