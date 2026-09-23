const User = require('../models/User');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const { sendMail, emailTemplates } = require('../config/mailer');
const CompanySettings = require('../models/CompanySettings');

// GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status && status !== 'All') filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { representative: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(filter, '-password').lean();
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

    const oldUser = await User.findById(id);
    if (!oldUser) return res.status(404).json({ success: false, message: 'User not found.' });

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password');

    // Email Triggers post-DB write wrapped in safe try-catch
    const settings = await CompanySettings.findOne().lean() || {};

    // 1. Account Approval
    if (updates.status === 'Active' && oldUser.status !== 'Active') {
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

      try {
        sendMail(emailTemplates.userApproved(user, settings))
          .catch(err => console.error('[Mailer Trigger Error] userApproved failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] userApproved generation failed:', mailErr.message);
      }
    }

    // 2. Account Rejection (Keep record scenario)
    if (updates.status === 'Rejected' && oldUser.status !== 'Rejected') {
      try {
        sendMail(emailTemplates.userRejected(user, settings))
          .catch(err => console.error('[Mailer Trigger Error] userRejected failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] userRejected generation failed:', mailErr.message);
      }
    }

    // 3. Password Reset
    if (updates.password) {
      try {
        sendMail(emailTemplates.passwordReset(user, settings))
          .catch(err => console.error('[Mailer Trigger Error] passwordReset failed:', err.message));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] passwordReset generation failed:', mailErr.message);
      }
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // 4. Account Rejection (Delete scenario for pending users)
    if (user.role === 'Customer' && user.status === 'Pending') {
      try {
        const settings = await CompanySettings.findOne().lean() || {};
        await sendMail(emailTemplates.userRejected(user, settings));
      } catch (mailErr) {
        console.error('[Mailer Trigger Error] Rejection email on delete failed:', mailErr.message);
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, updateUser, deleteUser };
