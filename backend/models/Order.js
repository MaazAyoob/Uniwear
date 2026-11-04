const mongoose = require('mongoose');

const orderStageSchema = new mongoose.Schema({
  stageIndex: { type: Number, required: true },
  stageName: { type: String, required: true },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Delayed'], default: 'Not Started' },
  responsiblePerson: { type: String, default: 'Production Team' },
  plannedDate: { type: String, default: '' },
  actualDate: { type: String, default: '' },
  delayIndicator: { type: Boolean, default: false },
  remarks: { type: String, default: '' },
  attachments: [{ type: String }]
}, { _id: false });

const DEFAULT_STAGES = [
  { stageIndex: 1, stageName: '01. Quotation & Contract Finalized', status: 'Completed', responsiblePerson: 'Sales Team' },
  { stageIndex: 2, stageName: '02. Fabric Sourcing & Mill Reservation', status: 'In Progress', responsiblePerson: 'Procurement Team' },
  { stageIndex: 3, stageName: '03. Lab Dip & Color Dye Approval', status: 'Not Started', responsiblePerson: 'Dyeing Lab' },
  { stageIndex: 4, stageName: '04. Pre-Production Sample Sign-Off', status: 'Not Started', responsiblePerson: 'Sample Room & Client' },
  { stageIndex: 5, stageName: '05. Precision CNC Fabric Cutting', status: 'Not Started', responsiblePerson: 'CNC Cutting Master' },
  { stageIndex: 6, stageName: '06. Logo Embroidery & Screen Printing', status: 'Not Started', responsiblePerson: 'Branding Desk' },
  { stageIndex: 7, stageName: '07. Component Bundling & Panel Prep', status: 'Not Started', responsiblePerson: 'Bundling Unit' },
  { stageIndex: 8, stageName: '08. Sewing & Stitch Assembly', status: 'Not Started', responsiblePerson: 'Sewing Floor' },
  { stageIndex: 9, stageName: '09. Quality Control & Inline Inspection', status: 'Not Started', responsiblePerson: 'QA Inspection' },
  { stageIndex: 10, stageName: '10. Thread Trimming & Steam Pressing', status: 'Not Started', responsiblePerson: 'Finishing Team' },
  { stageIndex: 11, stageName: '11. Poly-Bags & Barcode Labeling', status: 'Not Started', responsiblePerson: 'Packaging Desk' },
  { stageIndex: 12, stageName: '12. Final Quality Audit & Metal Detect', status: 'Not Started', responsiblePerson: 'Audit QA' },
  { stageIndex: 13, stageName: '13. Carton Packing & Palletization', status: 'Not Started', responsiblePerson: 'Warehouse Team' },
  { stageIndex: 14, stageName: '14. Dispatch & Logistics Tracking', status: 'Not Started', responsiblePerson: 'Logistics Partner' }
];

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientEmail: { type: String, required: true, lowercase: true },
  clientCompany: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  productName: { type: String, default: '' },
  volume: { type: Number, default: 0 },
  value: { type: String, default: '' },
  deliveryDate: { type: String, default: '' },
  statusStep: { type: Number, min: 1, max: 14, default: 1 },
  statusText: { type: String, default: 'Order Confirmed' },
  currentStageIndex: { type: Number, min: 1, max: 14, default: 1 },
  currentStageName: { type: String, default: 'Order Confirmed' },
  stages: {
    type: [orderStageSchema],
    default: () => DEFAULT_STAGES
  },
  onSchedule: { type: Boolean, default: true },
  awaitingApproval: { type: Boolean, default: false },
  readyForDispatch: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  orderType: {
    type: String,
    enum: ['FactoryOrder', 'PortalDirectOrder', 'QuotationOrder'],
    default: 'FactoryOrder'
  },
  items: [{
    productId: { type: mongoose.Schema.Types.Mixed },
    productName: { type: String, default: '' },
    sku: { type: String, default: '' },
    hsnCode: { type: String, default: '6109' },
    fabric: { type: String, default: '' },
    gsm: { type: String, default: '' },
    unitPrice: { type: Number, default: 0 },
    taxRate: { type: Number, default: 5 },
    taxAmount: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    sizeBreakdown: { type: mongoose.Schema.Types.Mixed, default: {} },
    lineTotal: { type: Number, default: 0 }
  }],
  quotationId: { type: String, default: '' },
  subtotal: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 5 },
  taxBreakdown: {
    taxType: { type: String, enum: ['intra_state', 'inter_state', 'undetermined'], default: 'undetermined' },
    taxRate: { type: Number, default: 5 },
    taxableAmount: { type: Number, default: 0 },
    cgstRate: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstRate: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    igstRate: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    undeterminedTaxAmount: { type: Number, default: 0 },
    isProvisional: { type: Boolean, default: false },
    placeOfSupplyDetermined: { type: Boolean, default: false },
    supplierGstin: { type: String, default: '' },
    customerGstin: { type: String, default: '' },
    placeOfSupply: { type: String, default: '' },
    warning: { type: String, default: '' },
    isTaxInclusive: { type: Boolean, default: false }
  },
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  billingAddress: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    gstin: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    poReference: { type: String, default: '' }
  },
  shippingAddress: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },
  payment: {
    gateway: { type: String, default: 'Cashfree' },
    gatewayEnvironment: {
      type: String,
      enum: ['SANDBOX', 'PRODUCTION'],
      default: () => ((process.env.CASHFREE_ENV || 'sandbox').toUpperCase() === 'PRODUCTION' ? 'PRODUCTION' : 'SANDBOX')
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'],
      default: 'PENDING'
    },
    cfOrderId: { type: String, default: '' },
    paymentSessionId: { type: String, default: '' },
    cfPaymentId: { type: String, default: '' },
    paymentMethod: { type: String, default: '' },
    paymentTime: { type: Date },
    failureReason: { type: String, default: '' },
    attempts: [{
      attemptId: { type: String },
      cfPaymentId: { type: String },
      status: { type: String },
      paymentMethod: { type: String },
      amount: { type: Number },
      time: { type: Date, default: Date.now },
      rawResponse: { type: mongoose.Schema.Types.Mixed }
    }]
  },
  isTestData: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date, default: null },
  archivedBy: { type: String, default: '' },
  notes: { type: String, default: '' },
  specialInstructions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
