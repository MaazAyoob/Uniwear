require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Lead = require('./models/Lead');
const Quotation = require('./models/Quotation');
const Order = require('./models/Order');
const Ticket = require('./models/Ticket');
const Notification = require('./models/Notification');
const CompanySettings = require('./models/CompanySettings');
const Product = require('./models/Product');
const Blog = require('./models/Blog');
const Catalog = require('./models/Catalog');

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
} = require('./config/seeds');

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB Atlas:', uri);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas!');

    // Users
    if ((await User.countDocuments()) < 2) {
      const hashed = await Promise.all(
        defaultUsers.map(async (u) => ({
          ...u,
          password: await bcrypt.hash(u.password, 10)
        }))
      );
      for (const u of hashed) {
        await User.updateOne({ email: u.email }, { $setOnInsert: u }, { upsert: true });
      }
      console.log(`[Seed] Seeded users`);
    }

    // Leads
    if ((await Lead.countDocuments()) === 0) {
      await Lead.insertMany(defaultLeads);
      console.log(`[Seed] Inserted ${defaultLeads.length} leads`);
    }

    // Quotations
    if ((await Quotation.countDocuments()) === 0) {
      await Quotation.insertMany(defaultQuotations);
      console.log(`[Seed] Inserted ${defaultQuotations.length} quotations`);
    }

    // Orders
    if ((await Order.countDocuments()) === 0) {
      await Order.insertMany(defaultOrders);
      console.log(`[Seed] Inserted ${defaultOrders.length} orders`);
    }

    // Tickets
    if ((await Ticket.countDocuments()) === 0) {
      await Ticket.insertMany(defaultTickets);
      console.log(`[Seed] Inserted ${defaultTickets.length} tickets`);
    }

    // Notifications
    if ((await Notification.countDocuments()) === 0) {
      await Notification.insertMany(defaultNotifications);
      console.log(`[Seed] Inserted ${defaultNotifications.length} notifications`);
    }

    // Company Settings
    if ((await CompanySettings.countDocuments()) === 0) {
      await CompanySettings.create(defaultCompanySettings);
      console.log('[Seed] Company settings initialized');
    }

    // Products
    if ((await Product.countDocuments()) === 0) {
      await Product.insertMany(defaultProducts);
      console.log(`[Seed] Inserted ${defaultProducts.length} products`);
    }

    // Blogs
    if ((await Blog.countDocuments()) === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log(`[Seed] Inserted ${defaultBlogs.length} blogs`);
    }

    // Catalogs
    if ((await Catalog.countDocuments()) === 0) {
      const products = await Product.find().lean();
      const catalogsToInsert = defaultCatalogs.map(cat => {
        const categoryProds = products.filter(p => p.category.toLowerCase().includes(cat.category.toLowerCase().split(' ')[0]));
        return {
          ...cat,
          products: categoryProds.map(p => p._id)
        };
      });
      await Catalog.insertMany(catalogsToInsert);
      console.log(`[Seed] Inserted ${catalogsToInsert.length} catalogs`);
    }

    console.log("SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
