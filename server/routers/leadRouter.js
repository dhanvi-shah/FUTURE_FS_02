import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { protect } from '../middleware/auth.js';
import { getAnalytics } from '../services/analyticsService.js';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  addNoteToLead,
  updateFollowUpDate,
  getAllLeadsForExport,
  getRecentActivity,
} from '../services/leadService.js';

const router = Router();

router.use(protect);

router.get(
  '/analytics',
  asyncHandler(async (req, res) => {
    const data = await getAnalytics();
    res.json({ success: true, data });
  })
);

router.get(
  '/activity',
  asyncHandler(async (req, res) => {
    const data = await getRecentActivity(parseInt(req.query.limit, 10) || 10);
    res.json({ success: true, data });
  })
);

router.get(
  '/export',
  asyncHandler(async (req, res) => {
    const leads = await getAllLeadsForExport(req.query);
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Priority', 'Follow Up', 'Created At'];
    const rows = leads.map((l) =>
      [
        l.name,
        l.email,
        l.phone,
        l.company,
        l.source,
        l.status,
        l.priority,
        l.followUpDate ? new Date(l.followUpDate).toISOString().split('T')[0] : '',
        new Date(l.createdAt).toISOString(),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.send(csv);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const data = await getLeads(req.query);
    res.json({ success: true, data });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const lead = await getLeadById(req.params.id);
    res.json({ success: true, data: lead });
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const lead = await createLead(req.body, req.admin?.name);
    res.status(201).json({ success: true, data: lead });
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const lead = await updateLead(req.params.id, req.body, req.admin?.name);
    res.json({ success: true, data: lead });
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    await deleteLead(req.params.id);
    res.json({ success: true, message: 'Lead deleted successfully' });
  })
);

router.post(
  '/:id/note',
  asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Note text is required' });
    }
    const lead = await addNoteToLead(req.params.id, text.trim(), req.admin?.name);
    res.json({ success: true, data: lead });
  })
);

router.put(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const lead = await updateLeadStatus(req.params.id, status, req.admin?.name);
    res.json({ success: true, data: lead });
  })
);

router.put(
  '/:id/follow-up',
  asyncHandler(async (req, res) => {
    const { followUpDate } = req.body;
    const lead = await updateFollowUpDate(req.params.id, followUpDate, req.admin?.name);
    res.json({ success: true, data: lead });
  })
);

export default router;
