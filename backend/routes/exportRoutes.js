const express = require('express');
const router = express.Router();
const { exportData } = require('../controllers/exportController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/:module', protect, adminOnly, exportData);

module.exports = router;
