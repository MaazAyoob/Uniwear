const express = require('express');
const router = express.Router();
const { login, register, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/change-password', protect, changePassword);

module.exports = router;
