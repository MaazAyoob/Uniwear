const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number }, // Backwards compatibility for frontend numeric IDs
  name: { type: String, required: true },
  category: { type: String, required: true },
  fabric: { type: String, default: '' },
  gsm: { type: String, default: '' },
  moq: { type: Number, default: 50 },
  desc: { type: String, required: true }, // Map to description
  description: { type: String }, // Backwards compatible duplicate
  shortDescription: { type: String, default: '' },
  sku: { type: String, unique: true, sparse: true },
  pricePerPiece: {
    type: Number,
    min: [0, 'Price per piece cannot be negative'],
    default: null
  },
  price: { type: Number, default: 0 },
  hsnCode: { type: String, default: '6109' },
  hsnStatus: {
    type: String,
    enum: ['Pending Accountant Verification', 'Verified by Accountant'],
    default: 'Pending Accountant Verification'
  },
  hsnVerificationNote: {
    type: String,
    default: 'Format checked; pending final review by corporate Chartered Accountant / Tax Auditor.'
  },
  hsnVerifiedBy: { type: String, default: '' },
  hsnVerifiedAt: { type: Date, default: null },
  taxPercent: { type: Number, default: null }, // Null implies inheriting company default GST rate
  taxConfigStatus: { type: String, enum: ['Configured', 'Default'], default: 'Default' },
  lastTaxUpdated: { type: Date },
  lastTaxUpdatedBy: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Draft', 'Archived', 'Inactive'], default: 'Active' },
  isPublic: { type: Boolean, default: false }, // CMS Public Visibility Toggle
  displayLocations: [{ type: String }], // Locations: 'uniforms', 'gifting', 'featured', 'new_arrivals', 'best_sellers'
  sortOrder: { type: Number, default: 0 },
  img: { type: String, default: 'assets/images/products/corporate-blazer-detail.png' },
  image: { type: String, default: 'assets/images/products/corporate-blazer-detail.png' },
  images: [{ type: String }],
  galleryImages: [{ type: String }],
  specifications: { type: String, default: '' },
  sizes: { type: [String], default: ['S', 'M', 'L', 'XL', '2XL'] },
  tags: [{ type: String }],
  displayOrder: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date, default: null },
  archivedBy: { type: String, default: '' }
}, { timestamps: true });

// Pre-save hook to keep image, desc, price sync, and defaults
productSchema.pre('save', function (next) {
  if (this.img && !this.image) this.image = this.img;
  if (this.image && !this.img) this.img = this.image;
  if (this.desc && !this.description) this.description = this.desc;
  if (this.description && !this.desc) this.desc = this.description;
  if (this.sortOrder === undefined && this.displayOrder !== undefined) this.sortOrder = this.displayOrder;
  if (this.pricePerPiece !== undefined && this.pricePerPiece !== null && !isNaN(this.pricePerPiece)) {
    this.price = this.pricePerPiece;
  } else if (this.price !== undefined && this.price !== null && !isNaN(this.price) && this.price > 0 && (this.pricePerPiece === undefined || this.pricePerPiece === null)) {
    this.pricePerPiece = this.price;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
