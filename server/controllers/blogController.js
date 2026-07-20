const Blog = require('../models/Blog');
const ActivityLog = require('../models/ActivityLog');

// GET /api/blogs
const getBlogs = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: blogs });
  } catch (err) {
    next(err);
  }
};

// GET /api/blogs/:id
const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let blog;

    if (/^\d+$/.test(id)) {
      blog = await Blog.findOne({ id: parseInt(id) }).lean();
    } else {
      blog = await Blog.findOne({ $or: [{ _id: id }, { slug: id }] }).lean();
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found.' });
    }

    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// POST /api/blogs
const createBlog = async (req, res, next) => {
  try {
    const { title, category, author, content } = req.body;
    let { slug } = req.body;

    if (!title || !category || !author || !content) {
      return res.status(400).json({ success: false, message: 'Title, category, author, and content are required.' });
    }

    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Check slug uniqueness
    const existingSlug = await Blog.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ success: false, message: 'Blog article with this URL slug already exists.' });
    }

    const lastBlog = await Blog.findOne().sort({ id: -1 });
    const nextId = lastBlog && lastBlog.id ? lastBlog.id + 1 : 1;

    const payload = {
      ...req.body,
      id: nextId,
      slug
    };

    const blog = await Blog.create(payload);

    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// PUT/PATCH /api/blogs/:id
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    let blog;

    if (/^\d+$/.test(id)) {
      blog = await Blog.findOne({ id: parseInt(id) });
    } else {
      blog = await Blog.findOne({ $or: [{ _id: id }, { slug: id }] });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found.' });
    }

    const { slug } = req.body;
    if (slug && slug !== blog.slug) {
      const existingSlug = await Blog.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({ success: false, message: 'Blog article with this URL slug already exists.' });
      }
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/blogs/:id
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    let blog;

    if (/^\d+$/.test(id)) {
      blog = await Blog.findOneAndDelete({ id: parseInt(id) });
    } else {
      blog = await Blog.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found.' });
    }

    res.json({ success: true, message: 'Blog article deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
