import { Lead } from '../models/Lead.js';
import { AppError } from '../utils/AppError.js';

const buildSort = (sort) => {
  switch (sort) {
    case 'oldest':
      return { createdAt: 1 };
    case 'alphabetical':
      return { name: 1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
};

const buildDateFilter = (dateFilter) => {
  if (!dateFilter) return {};

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (dateFilter) {
    case 'today':
      return { createdAt: { $gte: startOfDay } };
    case 'week': {
      const weekAgo = new Date(startOfDay);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { createdAt: { $gte: weekAgo } };
    }
    case 'month': {
      const monthAgo = new Date(startOfDay);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { createdAt: { $gte: monthAgo } };
    }
    default:
      return {};
  }
};

export const getLeads = async (query = {}) => {
  const {
    search = '',
    status,
    source,
    priority,
    date,
    sort = 'newest',
    page = 1,
    limit = 10,
  } = query;

  const filter = { ...buildDateFilter(date) };

  if (status) filter.status = status;
  if (source) filter.source = source;
  if (priority) filter.priority = priority;

  if (search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { company: regex }];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(buildSort(sort)).skip(skip).limit(limitNum).lean(),
    Lead.countDocuments(filter),
  ]);

  return {
    leads,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getLeadById = async (id) => {
  const lead = await Lead.findById(id).lean();
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

export const createLead = async (data, createdBy = 'Admin') => {
  const lead = await Lead.create({
    ...data,
    activities: [
      {
        type: 'lead_created',
        description: `Lead created for ${data.name}`,
        createdBy,
      },
    ],
  });
  return lead;
};

export const updateLead = async (id, data, updatedBy = 'Admin') => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);

  Object.assign(lead, data);
  lead.activities.push({
    type: 'lead_updated',
    description: `Lead profile updated`,
    createdBy: updatedBy,
  });

  await lead.save();
  return lead;
};

export const deleteLead = async (id) => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

export const updateLeadStatus = async (id, status, updatedBy = 'Admin') => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);

  const previousStatus = lead.status;
  lead.status = status;
  lead.activities.push({
    type: 'status_change',
    description: `Status changed from ${previousStatus} to ${status}`,
    createdBy: updatedBy,
  });

  await lead.save();
  return lead;
};

export const addNoteToLead = async (id, text, createdBy = 'Admin') => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);

  const note = { text, createdBy, createdAt: new Date() };
  lead.notes.unshift(note);
  lead.activities.push({
    type: 'note_added',
    description: 'A new note was added',
    createdBy,
  });

  await lead.save();
  return lead;
};

export const updateFollowUpDate = async (id, followUpDate, updatedBy = 'Admin') => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);

  lead.followUpDate = followUpDate;
  lead.activities.push({
    type: 'follow_up_set',
    description: `Follow-up scheduled for ${new Date(followUpDate).toLocaleDateString()}`,
    createdBy: updatedBy,
  });

  await lead.save();
  return lead;
};

export const getAllLeadsForExport = async (query = {}) => {
  const { search = '', status, source, priority, date, sort = 'newest' } = query;
  const filter = { ...buildDateFilter(date) };
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (priority) filter.priority = priority;
  if (search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { company: regex }];
  }
  return Lead.find(filter).sort(buildSort(sort)).lean();
};

export const getRecentActivity = async (limit = 10) => {
  const leads = await Lead.find({ 'activities.0': { $exists: true } })
    .sort({ updatedAt: -1 })
    .limit(20)
    .select('name activities updatedAt')
    .lean();

  const activities = [];
  for (const lead of leads) {
    for (const activity of lead.activities.slice(-3)) {
      activities.push({
        leadId: lead._id,
        leadName: lead.name,
        ...activity,
      });
    }
  }

  return activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};
