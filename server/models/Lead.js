import mongoose from 'mongoose';

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal Sent',
  'Converted',
  'Lost',
];

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Instagram',
  'Email Campaign',
];

export const LEAD_PRIORITIES = ['High', 'Medium', 'Low'];

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'Admin',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['status_change', 'note_added', 'follow_up_set', 'lead_created', 'lead_updated'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      default: 'Admin',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: 'Website',
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: 'New',
    },
    priority: {
      type: String,
      enum: LEAD_PRIORITIES,
      default: 'Medium',
    },
    notes: {
      type: [noteSchema],
      default: [],
    },
    activities: {
      type: [activitySchema],
      default: [],
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

leadSchema.index({ name: 'text', email: 'text', company: 'text' });
leadSchema.index({ status: 1, source: 1, priority: 1, createdAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);
