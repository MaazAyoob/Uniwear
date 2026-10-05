const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Lead = require('../models/Lead');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const User = require('../models/User');

const Notification = require('../models/Notification');

// GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      productsCount,
      blogsCount,
      leadsCount,
      quotesCount,
      ordersCount,
      users,
      categories,
      notifications
    ] = await Promise.all([
      Product.countDocuments(),
      Blog.countDocuments({ status: 'Published' }),
      Lead.countDocuments(),
      Quotation.countDocuments(),
      Order.countDocuments(),
      User.find({}, 'role status').lean(),
      Product.distinct('category'),
      Notification.find({ recipient: 'admin' }).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const activeCustomers = users.filter(u => u.role === 'Customer' && u.status === 'Active').length;
    const pendingCustomers = users.filter(u => u.role === 'Customer' && u.status === 'Pending').length;

    const recentActivity = notifications.map(n => ({
      action: n.title,
      details: n.text || n.title,
      user: 'System',
      timestamp: n.createdAt || new Date()
    }));

    res.json({
      success: true,
      data: {
        products: productsCount,
        blogs: blogsCount,
        leads: leadsCount,
        quotes: quotesCount,
        orders: ordersCount,
        activeCustomers,
        pendingCustomers,
        categoriesCount: categories.length,
        recentActivity
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats
};
