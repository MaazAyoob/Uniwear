const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  defaultUsers,
  defaultLeads,
  defaultQuotations,
  defaultOrders,
  defaultTickets,
  defaultNotifications,
  defaultCompanySettings,
  defaultProducts,
  defaultBlogs,
  defaultCatalogs
} = require('./seeds');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uniwear';
    const conn = await mongoose.connect(uri);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (err) {
    console.error(`[DB] Connection Warning: ${err.message}`);
  }
};

const seedDatabase = async () => {
  const User = require('../models/User');
  const Lead = require('../models/Lead');
  const Quotation = require('../models/Quotation');
  const Order = require('../models/Order');
  const Ticket = require('../models/Ticket');
  const Notification = require('../models/Notification');
  const CompanySettings = require('../models/CompanySettings');
  const Product = require('../models/Product');
  const Blog = require('../models/Blog');
  const Catalog = require('../models/Catalog');

  // Seed Users - only if collection is empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const hashed = await Promise.all(
      defaultUsers.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10)
      }))
    );
    await User.insertMany(hashed);
    console.log(`[Seed] Inserted ${hashed.length} users`);
  }

  // Seed Leads
  if ((await Lead.countDocuments()) === 0) {
    await Lead.insertMany(defaultLeads);
    console.log(`[Seed] Inserted ${defaultLeads.length} leads`);
  }

  // Seed Quotations
  if ((await Quotation.countDocuments()) === 0) {
    await Quotation.insertMany(defaultQuotations);
    console.log(`[Seed] Inserted ${defaultQuotations.length} quotations`);
  }

  // Seed Orders
  if ((await Order.countDocuments()) === 0) {
    await Order.insertMany(defaultOrders);
    console.log(`[Seed] Inserted ${defaultOrders.length} orders`);
  }

  // Seed Tickets
  if ((await Ticket.countDocuments()) === 0) {
    await Ticket.insertMany(defaultTickets);
    console.log(`[Seed] Inserted ${defaultTickets.length} tickets`);
  }

  // Seed Notifications
  if ((await Notification.countDocuments()) === 0) {
    await Notification.insertMany(defaultNotifications);
    console.log(`[Seed] Inserted ${defaultNotifications.length} notifications`);
  }

  // Seed Company Settings (singleton)
  if ((await CompanySettings.countDocuments()) === 0) {
    await CompanySettings.create(defaultCompanySettings);
    console.log('[Seed] Company settings initialized');
  }

  // Seed Products
  if ((await Product.countDocuments()) === 0) {
    await Product.insertMany(defaultProducts);
    console.log(`[Seed] Inserted ${defaultProducts.length} products`);
  }

  // Seed Blogs
  if ((await Blog.countDocuments()) === 0) {
    await Blog.insertMany(defaultBlogs);
    console.log(`[Seed] Inserted ${defaultBlogs.length} blogs`);
  }

  // Seed Catalogs
  if ((await Catalog.countDocuments()) === 0) {
    // Seed catalogs and map their product references if products are seeded
    const products = await Product.find().lean();
    const catalogsToInsert = defaultCatalogs.map(cat => {
      // Find matching products by name and assign them
      const categoryProds = products.filter(p => p.category.toLowerCase().includes(cat.category.toLowerCase().split(' ')[0]));
      return {
        ...cat,
        products: categoryProds.map(p => p._id)
      };
    });
    await Catalog.insertMany(catalogsToInsert);
    console.log(`[Seed] Inserted ${catalogsToInsert.length} catalogs`);
  }
};

module.exports = connectDB;
