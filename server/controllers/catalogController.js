const Catalog = require('../models/Catalog');

// GET /api/catalog
const getCatalogs = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const filter = {};

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
    const catalog = await Catalog.findOne({ $or: [{ _id: id }, { slug: id }] })
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

    const catalog = await Catalog.create({
      ...req.body,
      slug
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
    const catalog = await Catalog.findOne({ $or: [{ _id: id }, { slug: id }] });

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

    Object.assign(catalog, req.body);
    await catalog.save();

    res.json({ success: true, data: catalog });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/catalog/:id
const deleteCatalog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const catalog = await Catalog.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });

    if (!catalog) {
      return res.status(404).json({ success: false, message: 'Catalog not found.' });
    }

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
  deleteCatalog
};
