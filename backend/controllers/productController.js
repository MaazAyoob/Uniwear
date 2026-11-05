const Product = require('../models/Product');
const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const CustomerProduct = require('../models/CustomerProduct');
const Notification = require('../models/Notification');

const logActivity = async (action, details) => {
  try {
    await Notification.create({ recipient: 'admin', title: action, text: details || action, time: 'Just now' });
  } catch (err) {}
};

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { page, limit, search, category, status, featured, isPublic, location, sort = 'sortOrder', order = 'asc', archived } = req.query;

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status;
    } else if (archived === 'true') {
      filter.$or = [{ status: 'Archived' }, { isArchived: true }];
    } else if (archived !== 'all') {
      filter.status = { $ne: 'Archived' };
      filter.isArchived = { $ne: true };
    }
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }
    if (location) {
      filter.displayLocations = { $in: [location] };
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
    const { name, category, desc, description, sku, img, image, isPublic, displayLocations } = req.body;

    if (!name || !category || (!desc && !description)) {
      return res.status(400).json({ success: false, message: 'Name, Category, and Description are required fields.' });
    }

    const targetImage = img || image;
    if (targetImage && targetImage.startsWith('data:image/')) {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      const mime = targetImage.substring(5, targetImage.indexOf(';'));
      if (!allowedMimes.includes(mime)) {
        return res.status(400).json({ success: false, message: 'Invalid image type. JPEG, PNG, WEBP, and SVG are supported.' });
      }
    }

    if (sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({ success: false, message: `Product with SKU ${sku} already exists.` });
      }
    }

    const { saveBase64Image } = require('../middleware/upload');

    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1;

    let targetImg = img || image || 'assets/images/products/corporate-blazer-detail.png';
    if (req.file) {
      targetImg = `/storage/products/${req.file.filename}`;
    } else if (targetImg && targetImg.startsWith('data:image/')) {
      targetImg = saveBase64Image(targetImg, 'products', `prod-${nextId}`);
    }

    let processedImages = [];
    if (Array.isArray(req.body.images)) {
      processedImages = req.body.images.map((im, idx) => {
        if (typeof im === 'string' && im.startsWith('data:image/')) {
          return saveBase64Image(im, 'products', `prod-${nextId}-gallery-${idx}`);
        }
        return im;
      });
    }

    // Validate and normalize pricePerPiece
    let parsedPricePerPiece = null;
    if (req.body.pricePerPiece !== undefined && req.body.pricePerPiece !== '' && req.body.pricePerPiece !== null) {
      parsedPricePerPiece = Number(req.body.pricePerPiece);
      if (isNaN(parsedPricePerPiece) || parsedPricePerPiece < 0) {
        return res.status(400).json({ success: false, message: 'Price per piece must be a valid non-negative number.' });
      }
    } else if (req.body.price !== undefined && req.body.price !== '' && req.body.price !== null) {
      const p = Number(req.body.price);
      if (!isNaN(p) && p >= 0) {
        parsedPricePerPiece = p;
      }
    }

    const payload = {
      ...req.body,
      id: nextId,
      pricePerPiece: parsedPricePerPiece,
      price: parsedPricePerPiece !== null ? parsedPricePerPiece : 0,
      desc: desc || description,
      description: description || desc,
      isPublic: isPublic !== undefined ? isPublic : false,
      displayLocations: Array.isArray(displayLocations) ? displayLocations : ['uniforms', 'gifting', 'featured'],
      img: targetImg,
      image: targetImg,
      images: processedImages.length > 0 ? processedImages : (req.body.images || [])
    };

    const product = await Product.create(payload);
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

    const { sku } = req.body;

    if (sku && sku !== product.sku) {
      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({ success: false, message: `Product with SKU ${sku} already exists.` });
      }
    }

    const updates = { ...req.body };
    const { saveBase64Image } = require('../middleware/upload');
    const prodId = product.id || product._id;

    if (req.file) {
      updates.img = `/storage/products/${req.file.filename}`;
      updates.image = updates.img;
    } else {
      if (updates.img && updates.img.startsWith('data:image/')) {
        updates.img = saveBase64Image(updates.img, 'products', `prod-${prodId}`);
        updates.image = updates.img;
      }
      if (updates.image && updates.image.startsWith('data:image/')) {
        updates.image = saveBase64Image(updates.image, 'products', `prod-${prodId}`);
        if (!updates.img) updates.img = updates.image;
      }
    }

    if (Array.isArray(updates.images)) {
      updates.images = updates.images.map((im, idx) => {
        if (typeof im === 'string' && im.startsWith('data:image/')) {
          return saveBase64Image(im, 'products', `prod-${prodId}-gallery-${idx}`);
        }
        return im;
      });
    }

    if (updates.desc && !updates.description) updates.description = updates.desc;
    if (updates.description && !updates.desc) updates.desc = updates.description;

    // Validate and synchronize pricePerPiece in updates
    if (updates.pricePerPiece !== undefined) {
      if (updates.pricePerPiece === '' || updates.pricePerPiece === null) {
        updates.pricePerPiece = null;
        updates.price = 0;
      } else {
        const num = Number(updates.pricePerPiece);
        if (isNaN(num) || num < 0) {
          return res.status(400).json({ success: false, message: 'Price per piece must be a valid non-negative number.' });
        }
        updates.pricePerPiece = num;
        updates.price = num;
      }
    } else if (updates.price !== undefined) {
      const num = Number(updates.price);
      if (!isNaN(num) && num >= 0) {
        updates.price = num;
        if (num > 0) updates.pricePerPiece = num;
      }
    }

    Object.assign(product, updates);
    await product.save();

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/archive
const archiveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isArchived = req.body.isArchived !== undefined ? Boolean(req.body.isArchived) : true;
    const query = /^\d+$/.test(id) ? { id: parseInt(id) } : { _id: id };

    const product = await Product.findOneAndUpdate(
      query,
      {
        isArchived,
        status: isArchived ? 'Archived' : 'Active',
        archivedAt: isArchived ? new Date() : null,
        archivedBy: isArchived ? (req.user ? req.user.email : 'Admin') : ''
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await logActivity(
      isArchived ? 'Product Archived' : 'Product Restored',
      `Product "${product.name}" (${product.sku || product.id}) ${isArchived ? 'archived' : 'restored'} by ${req.user ? req.user.email : 'Admin'}`
    );

    res.json({
      success: true,
      data: product,
      message: isArchived ? `Product "${product.name}" archived.` : `Product "${product.name}" restored.`
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = /^\d+$/.test(id) ? { id: parseInt(id) } : { _id: id };
    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // CRITICAL SAFETY CHECK:
    // Check references in Orders, Quotations, and CustomerProduct assignments
    const pId = product.id;
    const pObjId = product._id;
    const pIdStr = String(product._id);

    const [orderRef, quoteRef, assignRef] = await Promise.all([
      Order.findOne({
        $or: [
          { 'items.productId': pId },
          { 'items.productId': pObjId },
          { 'items.productId': pIdStr },
          { productName: product.name }
        ]
      }),
      Quotation.findOne({
        $or: [
          { 'items.productId': pId },
          { 'items.productId': pObjId },
          { 'items.productId': pIdStr }
        ]
      }),
      CustomerProduct.findOne({
        $or: [
          { productId: pId },
          { productId: pObjId },
          { productId: pIdStr }
        ]
      })
    ]);

    if (orderRef || quoteRef || assignRef) {
      const reasons = [];
      if (orderRef) reasons.push(`Order ${orderRef.id}`);
      if (quoteRef) reasons.push(`Quotation ${quoteRef.id}`);
      if (assignRef) reasons.push('Customer Catalog Assignment');
      return res.status(400).json({
        success: false,
        dependencyBlocked: true,
        message: `Deletion Blocked: Product "${product.name}" cannot be deleted because it is referenced in: ${reasons.join(', ')}. Please archive or deactivate the product instead to preserve historical records.`
      });
    }

    await Product.findOneAndDelete(query);

    await logActivity(
      'Product Deleted',
      `Product "${product.name}" (${product.sku || product.id}) permanently deleted by ${req.user ? req.user.email : 'Admin'}`
    );

    res.json({ success: true, message: `Product "${product.name}" deleted successfully.` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  archiveProduct,
  deleteProduct
};
