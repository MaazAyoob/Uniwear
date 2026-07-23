const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'UNIWEAR' },
  tagline: { type: String, default: 'Redefining Workwear Standards' },
  foundingYear: { type: String, default: '1998' },
  managingPartner: { type: String, default: 'Suresh H. A.' },
  supportEmail: { type: String, default: 'connect@uniwear.co' },
  salesEmail: { type: String, default: 'sales@uniwear.co' },
  notificationEmail: { type: String, default: 'connect@uniwear.co' },
  ccEmail: { type: String, default: '' },
  phone: { type: String, default: '+91 80 2658 0000, +91 91087 65831' },
  whatsappNumber: { type: String, default: '919108765831' },
  address: { type: String, default: 'No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070' },
  gst: { type: String, default: '29ABCDE1234F1ZH' },
  website: { type: String, default: 'https://uniwear.co' },
  logoUrl: { type: String, default: 'logo-full.png' },
  faviconUrl: { type: String, default: 'favicon.png' },
  companyProfilePdfUrl: { type: String, default: 'downloads/UNIWEAR_Company_Profile.pdf' },
  productCatalogPdfUrl: { type: String, default: 'downloads/UNIWEAR_Product_Catalog.pdf' },
  moqText: { type: String, default: 'Depends on product, fabric, customization and quantity.' },
  deliveryText: { type: String, default: 'Depends on quantity, fabric availability, customization and sample approval.' },
  socialLinks: {
    linkedin: { type: String, default: 'https://linkedin.com/company/uniwear-india' },
    instagram: { type: String, default: 'https://instagram.com/uniwear.co' },
    facebook: { type: String, default: 'https://facebook.com/uniwear.co' },
    whatsapp: { type: String, default: 'https://wa.me/919108765831' }
  },
  seoDefaults: {
    metaTitle: { type: String, default: 'UNIWEAR | Premium Workwear & Corporate Gifting Partner' },
    metaDescription: { type: String, default: 'UNIWEAR is Bengaluru’s premier uniform manufacturing partner, delivering corporate, industrial, hospitality, healthcare, educational workwear & corporate gifting since 1998.' },
    ogImage: { type: String, default: 'images/Industries We Serve/Corporate Uniforms.png' }
  },
  homepageHero: {
    title: { type: String, default: 'Uniforms That Represent Your Brand' },
    subtitle: { type: String, default: 'Industrial, corporate, hospitality, healthcare and institutional uniforms—along with premium corporate gifting—designed and manufactured in Bengaluru.' },
    bannerUrl: { type: String, default: "images/Banner image home page/Banner image'.png" },
    primaryCtaText: { type: String, default: 'Request a Quote' },
    primaryCtaLink: { type: String, default: 'contact.html' },
    secondaryCtaText: { type: String, default: 'Explore Our Solutions' },
    secondaryCtaLink: { type: String, default: 'uniforms.html' }
  },
  homepageStats: [
    { key: { type: String }, label: { type: String }, value: { type: String }, numberValue: { type: Number } }
  ],
  whyChooseUs: [
    { title: { type: String }, subtitle: { type: String }, icon: { type: String } }
  ],
  homepageSectionsOrder: [
    { type: String }
  ]
}, { timestamps: true });

module.exports = mongoose.model('CompanySettings', companySettingsSchema);
