const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  defaultUsers,
  defaultLeads,
  defaultQuotations,
  defaultOrders,
  defaultTickets,
  defaultNotifications,
  defaultCompanySettings
} = require('./seeds');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (err) {
    console.error(`[DB] Connection Error: ${err.message}`);
    process.exit(1);
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
};

module.exports = connectDB;
