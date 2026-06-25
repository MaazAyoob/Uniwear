const User = require('../models/User');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const { sendMail, emailTemplates } = require('../config/mailer');
const CompanySettings = require('../models/CompanySettings');

// GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password').lean();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // If status was just changed to Active, notify the user and send approval email
    if (updates.status === 'Active' && user.status === 'Active') {
      await Notification.create({
        recipient: user.email,
        title: 'Account Approved',
        text: 'Your UNIWEAR account has been approved. You can now access the customer portal.',
        time: 'Just now'
      });
      await Notification.create({
        recipient: 'admin',
        title: 'Account Approved',
        text: `Account for ${user.companyName} (${user.email}) approved.`,
        time: 'Just now'
      });

      const settings = await CompanySettings.findOne().lean() || {};
      sendMail(emailTemplates.userApproved(user, settings));
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUser, deleteUser };
