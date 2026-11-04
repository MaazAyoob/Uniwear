const mongoose = require('mongoose');
const Catalog = require('../models/Catalog');
const Notification = require('../models/Notification');

const logActivity = async (action, details) => {
  try {
    await Notification.create({ recipient: 'admin', title: action, text: details || action, time: 'Just now' });
  } catch (err) {}
};

const getCatalogQuery = (id) => (mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { slug: id }] } : { slug: id });

// GET /api/catalog
const getCatalogs = async (req, res, next) => {
  try {
    const { search, category, status, archived } = req.query;
    const filter = {};

    if (archived === 'true') {
      filter.isArchived = true;
    } else if (archived === 'all') {
      // all
    } else {
      filter.isArchived = { $ne: true };
    }

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const catalogs = await Catalog.find(filter)
      .populate({ path: 'products', options: { strictPopulate: false } })
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    // Filter out null product refs (orphaned ObjectIds from deleted products)
    const sanitized = catalogs.map(cat => ({
      ...cat,
      products: (cat.products || []).filter(Boolean)
    }));

    res.json({ success: true, data: sanitized });
  } catch (err) {
    next(err);
  }
};

// GET /api/catalog/:id
const getCatalogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const catalog = await Catalog.findOne(getCatalogQuery(id))
      .populate('products')
      .lean();

    if (!catalog) {
      return res.status(404).json({ success: false, message: 'Catalog not found.' });
    }

    res.json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
};

// POST /api/catalog
const createCatalog = async (req, res, next) => {
  try {
    const { title, category } = req.body;
    let { slug } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and Category are required.' });
    }

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Slug uniqueness
    const existingSlug = await Catalog.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ success: false, message: 'Catalog with this URL slug already exists.' });
    }

    const { saveBase64Image } = require('../middleware/upload');
    let targetImg = req.body.img || '';
    if (req.file) {
      targetImg = `/storage/catalogs/${req.file.filename}`;
    } else if (targetImg && targetImg.startsWith('data:image/')) {
      targetImg = saveBase64Image(targetImg, 'catalogs', `cat-${slug}`);
    }

    const catalog = await Catalog.create({
      ...req.body,
      slug,
      img: targetImg
    });

    res.status(201).json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
};

// PUT/PATCH /api/catalog/:id
const updateCatalog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const catalog = await Catalog.findOne(getCatalogQuery(id));

    if (!catalog) {
      return res.status(404).json({ success: false, message: 'Catalog not found.' });
    }

    const { slug } = req.body;
    if (slug && slug !== catalog.slug) {
      const existingSlug = await Catalog.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'Catalog with this URL slug already exists.' });
      }
    }

    const updates = { ...req.body };
    const { saveBase64Image } = require('../middleware/upload');
    const catSlug = catalog.slug || 'catalog';

    if (req.file) {
      updates.img = `/storage/catalogs/${req.file.filename}`;
    } else if (updates.img && updates.img.startsWith('data:image/')) {
      updates.img = saveBase64Image(updates.img, 'catalogs', `cat-${catSlug}`);
    }

    Object.assign(catalog, updates);
    await catalog.save();

    res.json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/catalog/:id/archive
const archiveCatalog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isArchived = req.body.isArchived !== undefined ? Boolean(req.body.isArchived) : true;
    const catalog = await Catalog.findOneAndUpdate(
      getCatalogQuery(id),
      {
        isArchived,
        archivedAt: isArchived ? new Date() : null,
        archivedBy: isArchived ? (req.user ? req.user.email : 'Admin') : ''
      },
      { new: true }
    );

    if (!catalog) {
      return res.status(404).json({ success: false, message: 'Catalog not found.' });
    }

    await logActivity(
      isArchived ? 'Catalog Archived' : 'Catalog Restored',
      `Catalog "${catalog.title}" (${catalog.slug}) ${isArchived ? 'archived' : 'restored'} by ${req.user ? req.user.email : 'Admin'}`
    );

    res.json({
      success: true,
      data: catalog,
      message: isArchived ? `Catalog "${catalog.title}" archived.` : `Catalog "${catalog.title}" restored.`
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/catalog/:id
const deleteCatalog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const catalog = await Catalog.findOneAndDelete(getCatalogQuery(id));

    if (!catalog) {
      return res.status(404).json({ success: false, message: 'Catalog not found.' });
    }

    await logActivity(
      'Catalog Deleted',
      `Catalog "${catalog.title}" (${catalog.slug}) deleted by ${req.user ? req.user.email : 'Admin'}`
    );

    res.json({ success: true, message: 'Catalog deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCatalogs,
  getCatalogById,
  createCatalog,
  updateCatalog,
  archiveCatalog,
  deleteCatalog
};
