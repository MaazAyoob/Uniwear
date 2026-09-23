const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  format: { type: String, default: 'PDF Brochure' },
  pages: { type: Number, default: 32 },
  size: { type: String, default: '5.0 MB' },
  img: { type: String, default: '' }, // Cover image path / base64
  images: [{ type: String }],
  bannerImage: { type: String, default: '' },
  bannerTitle: { type: String, default: '' },
  bannerDescription: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  visibility: { type: Boolean, default: true },
  status: { type: String, enum: ['Publish', 'Draft'], default: 'Publish' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  metaImage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Catalog', catalogSchema);
