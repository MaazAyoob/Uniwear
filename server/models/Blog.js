const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Backwards compatibility for numeric IDs
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['Published', 'Draft', 'Scheduled'], default: 'Published' },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  readingTime: { type: String, default: '' },
  date: { type: String }, // formatted date string
  img: { type: String, default: '' },
  featuredImage: { type: String, default: '' },
  images: [{ type: String }],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// Sync featuredImage and img
blogSchema.pre('save', function (next) {
  if (this.img && !this.featuredImage) this.featuredImage = this.img;
  if (this.featuredImage && !this.img) this.img = this.featuredImage;
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
