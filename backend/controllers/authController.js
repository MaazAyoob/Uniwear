const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendMail, emailTemplates } = require('../config/mailer');
const CompanySettings = require('../models/CompanySettings');

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    if (user.status === 'Disabled')
      return res.status(403).json({ success: false, message: 'Your account is disabled. Contact support.' });
    if (user.status === 'Pending')
      return res.status(403).json({ success: false, message: 'Your registration is pending admin approval.' });
    if (user.status === 'Info Requested')
      return res.status(403).json({ success: false, message: 'Admin has requested more details. Check your inbox.' });

    const token = generateToken(user);
    const authRole = user.role === 'Customer' ? 'client' : 'admin';

    res.json({
      success: true,
      token,
      authRole,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        representative: user.representative,
        phone: user.phone,
        address: user.address,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/register
const register = async (req, res, next) => {
  try {
    const { companyName, representative, email, phone, password } = req.body;
    if (!companyName || !representative || !email || !phone || !password)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password: hashed,
      role: 'Customer',
      companyName,
      representative,
      phone,
      status: 'Pending',
      regDate: new Date().toISOString().split('T')[0]
    });

    // Admin notification
    await Notification.create({
      recipient: 'admin',
      title: 'New Registration',
      text: `Application received from ${companyName} (Contact: ${representative}). Review pending.`,
      time: 'Just now'
    });

    // Send emails (non-blocking & safe try-catch wrappers)
    try {
      const settings = await CompanySettings.findOne().lean() || {};
      
      try {
        sendMail(emailTemplates.registrationAdmin(newUser, settings))
          .catch(err => console.error('[Mailer Trigger Error] registrationAdmin failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] registrationAdmin generation failed:', mailErr.message);
      }

      try {
        sendMail(emailTemplates.registrationCustomer(newUser, settings))
          .catch(err => console.error('[Mailer Trigger Error] registrationCustomer failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] registrationCustomer generation failed:', mailErr.message);
      }
    } catch (err) {
      console.error('[Mailer Trigger Error] Registration settings lookup failed:', err.message);
    }

    res.status(201).json({ success: true, message: 'Registration submitted. Pending admin approval.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Current password, new password, and confirmation password are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'New password and confirmation password do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from current password.' });
    }

    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully. Please log in with your new password.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register, changePassword };
