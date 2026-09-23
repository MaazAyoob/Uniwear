const Product = require('../models/Product');
const Lead = require('../models/Lead');
const User = require('../models/User');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Blog = require('../models/Blog');
const Catalog = require('../models/Catalog');

// Convert JSON array to CSV string
const jsonToCsv = (items) => {
  if (!items || !items.length) return '';
  const headers = Object.keys(items[0]);
  const csvRows = [headers.join(',')];
  for (const item of items) {
    const values = headers.map(header => {
      const val = item[header] !== undefined && item[header] !== null ? item[header] : '';
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

// GET /api/export/:module
const exportData = async (req, res, next) => {
  try {
    const moduleName = req.params.module.toLowerCase();
    let data = [];
    let filename = `${moduleName}_export.csv`;

    if (moduleName === 'products') {
      data = await Product.find().lean();
    } else if (moduleName === 'leads') {
      data = await Lead.find().lean();
    } else if (moduleName === 'customers' || moduleName === 'users') {
      data = await User.find().select('-password').lean();
    } else if (moduleName === 'quotations') {
      data = await Quotation.find().lean();
    } else if (moduleName === 'orders') {
      data = await Order.find().lean();
    } else if (moduleName === 'blogs') {
      data = await Blog.find().lean();
    } else if (moduleName === 'catalog') {
      data = await Catalog.find().lean();
    } else {
      return res.status(400).json({ success: false, message: 'Invalid export module' });
    }

    // Clean MongoDB internal objects before CSV stringifying
    const cleaned = data.map(item => {
      const clone = { ...item };
      delete clone.__v;
      if (clone._id) clone._id = clone._id.toString();
      if (typeof clone.items === 'object') clone.items = JSON.stringify(clone.items);
      if (typeof clone.stages === 'object') clone.stages = JSON.stringify(clone.stages);
      return clone;
    });

    const csvContent = jsonToCsv(cleaned);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};

module.exports = { exportData };
