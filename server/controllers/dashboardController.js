const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Lead = require('../models/Lead');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

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
      recentActivity
    ] = await Promise.all([
      Product.countDocuments(),
      Blog.countDocuments({ status: 'Published' }),
      Lead.countDocuments(),
      Quotation.countDocuments(),
      Order.countDocuments(),
      User.find({}, 'role status').lean(),
      Product.distinct('category'),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const activeCustomers = users.filter(u => u.role === 'Customer' && u.status === 'Active').length;
    const pendingCustomers = users.filter(u => u.role === 'Customer' && u.status === 'Pending').length;

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
