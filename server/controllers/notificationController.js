const Notification = require('../models/Notification');

// GET /api/notifications
const getNotifications = async (req, res, next) => {
  try {
    const { recipient } = req.query;
    const filter = {};
    if (recipient) filter.recipient = recipient;
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications
const createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, createNotification };
