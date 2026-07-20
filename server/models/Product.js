const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Backwards compatibility for frontend numeric IDs
  name: { type: String, required: true },
  category: { type: String, required: true },
  fabric: { type: String, default: '' },
  gsm: { type: String, default: '' },
  moq: { type: Number, default: 50 },
  desc: { type: String, required: true }, // Map to description
  description: { type: String }, // Backwards compatible duplicate
  shortDescription: { type: String, default: '' },
  sku: { type: String, unique: true, sparse: true },
  price: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Draft', 'Disabled'], default: 'Active' },
  img: { type: String, default: 'corporate_blazer_detail.png' }, // Primary Image for legacy compatibility
  image: { type: String, default: 'corporate_blazer_detail.png' }, // Primary Image for legacy compatibility
  images: [{ type: String }],
  galleryImages: [{ type: String }],
  specifications: { type: String, default: '' },
  tags: [{ type: String }],
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to keep image and desc in sync
productSchema.pre('save', function (next) {
  if (this.img && !this.image) this.image = this.img;
  if (this.image && !this.img) this.img = this.image;
  if (this.desc && !this.description) this.description = this.desc;
  if (this.description && !this.desc) this.desc = this.description;
  next();
});

module.exports = mongoose.model('Product', productSchema);
