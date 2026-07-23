const express = require('express');
const router = express.Router();
const { exportData } = require('../controllers/exportController');

router.get('/:module', exportData);

module.exports = router;
