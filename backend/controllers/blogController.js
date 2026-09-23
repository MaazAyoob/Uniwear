const Blog = require('../models/Blog');

// GET /api/blogs
const getBlogs = async (req, res, next) => {
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

    const { saveBase64Image } = require('../middleware/upload');
    const lastBlog = await Blog.findOne().sort({ id: -1 });
    const nextId = lastBlog && lastBlog.id ? lastBlog.id + 1 : 1;

    let targetImg = req.body.img || req.body.featuredImage || '';
    if (req.file) {
      targetImg = `/storage/blogs/${req.file.filename}`;
    } else if (targetImg && targetImg.startsWith('data:image/')) {
      targetImg = saveBase64Image(targetImg, 'blogs', `blog-${nextId}`);
    }

    const payload = {
      ...req.body,
      id: nextId,
      slug,
      img: targetImg,
      featuredImage: targetImg
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

    const updates = { ...req.body };
    const { saveBase64Image } = require('../middleware/upload');
    const blogId = blog.id || blog._id;

    if (req.file) {
      updates.img = `/storage/blogs/${req.file.filename}`;
      updates.featuredImage = updates.img;
    } else {
      if (updates.img && updates.img.startsWith('data:image/')) {
        updates.img = saveBase64Image(updates.img, 'blogs', `blog-${blogId}`);
        updates.featuredImage = updates.img;
      }
      if (updates.featuredImage && updates.featuredImage.startsWith('data:image/')) {
        updates.featuredImage = saveBase64Image(updates.featuredImage, 'blogs', `blog-${blogId}`);
        if (!updates.img) updates.img = updates.featuredImage;
      }
    }

    // Remove undefined fields and empty category to preserve existing values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined || (key === 'category' && (!updates[key] || updates[key].trim() === ''))) {
        delete updates[key];
      }
    });

    Object.assign(blog, updates);
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
