import type { LeadStatus, LeadPriority } from '../types';

export const LEAD_STATUSES: LeadStatus[] = [
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
] as const;

export const LEAD_PRIORITIES: LeadPriority[] = ['High', 'Medium', 'Low'];

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  New: { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
  Contacted: { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400' },
  Qualified: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  'Proposal Sent': { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
  Converted: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Lost: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
};

export const PRIORITY_COLORS: Record<LeadPriority, { bg: string; text: string }> = {
  High: { bg: 'bg-red-500/15', text: 'text-red-400' },
  Medium: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  Low: { bg: 'bg-zinc-500/15', text: 'text-zinc-400' },
};

export const CHART_COLORS = ['#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Leads', path: '/leads', icon: 'Users' },
] as const;

export const DATE_FILTERS = [
  { label: 'All Time', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
] as const;

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Alphabetical', value: 'alphabetical' },
] as const;
