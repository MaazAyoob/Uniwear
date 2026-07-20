const Product = require('../models/Product');
const ActivityLog = require('../models/ActivityLog');

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { page, limit, search, category, status, featured, sort = 'id', order = 'asc' } = req.query;

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sort] = sortOrder;

    // Pagination
    let productsQuery = Product.find(filter).sort(sortOptions);

    if (page && limit) {
      const skipIndex = (parseInt(page) - 1) * parseInt(limit);
      const total = await Product.countDocuments(filter);
      const products = await productsQuery.skip(skipIndex).limit(parseInt(limit)).lean();

      return res.json({
        success: true,
        data: products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } else {
      const products = await productsQuery.lean();
      return res.json({ success: true, data: products });
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if id is numeric or ObjectId
    if (/^\d+$/.test(id)) {
      product = await Product.findOne({ id: parseInt(id) }).lean();
    } else {
      product = await Product.findById(id).lean();
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, category, desc, description, sku, img, image } = req.body;

    // Validation
    if (!name || !category || (!desc && !description)) {
      return res.status(400).json({ success: false, message: 'Name, Category, and Description are required fields.' });
    }

    // Validate base64 image if provided
    const targetImage = img || image;
    if (targetImage && targetImage.startsWith('data:image/')) {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      const mime = targetImage.substring(5, targetImage.indexOf(';'));
      if (!allowedMimes.includes(mime)) {
        return res.status(400).json({ success: false, message: 'Invalid image type. JPEG, PNG, WEBP, and SVG are supported.' });
      }
    }

    // SKU uniqueness
    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({ success: false, message: `Product with SKU ${sku} already exists.` });
      }
    }

    // Generate numerical ID
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1;

    const payload = {
      ...req.body,
      id: nextId,
      desc: desc || description,
      description: description || desc,
      img: img || image || 'corporate_blazer_detail.png',
      image: image || img || 'corporate_blazer_detail.png'
    };

    const product = await Product.create(payload);

    // Track activity log
    await ActivityLog.create({
      action: 'Product Created',
      details: `Product "${product.name}" created under category "${product.category}".`,
      user: req.user ? req.user.email : 'Admin'
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// PUT/PATCH /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (/^\d+$/.test(id)) {
      product = await Product.findOne({ id: parseInt(id) });
    } else {
      product = await Product.findById(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const { sku, status, featured } = req.body;

    // SKU check
    if (sku && sku !== product.sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({ success: false, message: `Product with SKU ${sku} already exists.` });
      }
    }

    // Determine log actions
    let actionDetails = [];
    if (status !== undefined && status !== product.status) actionDetails.push(`status to ${status}`);
    if (featured !== undefined && featured !== product.featured) actionDetails.push(`featured state to ${featured}`);

    const updates = { ...req.body };
    if (updates.desc && !updates.description) updates.description = updates.desc;
    if (updates.description && !updates.desc) updates.desc = updates.description;

    Object.assign(product, updates);
    await product.save();

    // Track activity log
    await ActivityLog.create({
      action: actionDetails.length > 0 ? 'Status Changed' : 'Product Edited',
      details: `Product "${product.name}" updated.${actionDetails.length > 0 ? ' Adjusted: ' + actionDetails.join(', ') : ''}`,
      user: req.user ? req.user.email : 'Admin'
    });

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (/^\d+$/.test(id)) {
      product = await Product.findOneAndDelete({ id: parseInt(id) });
    } else {
      product = await Product.findByIdAndDelete(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Track activity log
    await ActivityLog.create({
      action: 'Product Deleted',
      details: `Product "${product.name}" (SKU: ${product.sku || 'N/A'}) deleted.`,
      user: req.user ? req.user.email : 'Admin'
    });

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
