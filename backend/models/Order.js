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
  { stageIndex: 1, stageName: 'Order Confirmed', status: 'Completed', responsiblePerson: 'Sales Team' },
  { stageIndex: 2, stageName: 'Measurement Collection', status: 'In Progress', responsiblePerson: 'Sizing Spec' },
  { stageIndex: 3, stageName: 'Fabric Procurement', status: 'Not Started', responsiblePerson: 'Procurement' },
  { stageIndex: 4, stageName: 'Sampling', status: 'Not Started', responsiblePerson: 'Sample Room' },
  { stageIndex: 5, stageName: 'Sample Approval', status: 'Not Started', responsiblePerson: 'Client & QA' },
  { stageIndex: 6, stageName: 'Cutting', status: 'Not Started', responsiblePerson: 'Cutting Master' },
  { stageIndex: 7, stageName: 'Stitching', status: 'Not Started', responsiblePerson: 'Production Floor' },
  { stageIndex: 8, stageName: 'Branding', status: 'Not Started', responsiblePerson: 'Embroidery Desk' },
  { stageIndex: 9, stageName: 'Quality Check', status: 'Not Started', responsiblePerson: 'QA Inspector' },
  { stageIndex: 10, stageName: 'Packing', status: 'Not Started', responsiblePerson: 'Dispatch Team' },
  { stageIndex: 11, stageName: 'Ready for Dispatch', status: 'Not Started', responsiblePerson: 'Logistics' },
  { stageIndex: 12, stageName: 'Dispatched', status: 'Not Started', responsiblePerson: 'Courier Partner' },
  { stageIndex: 13, stageName: 'Delivered', status: 'Not Started', responsiblePerson: 'Logistics' },
  { stageIndex: 14, stageName: 'Completed', status: 'Not Started', responsiblePerson: 'Account Manager' }
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
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
