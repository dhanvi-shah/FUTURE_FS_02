export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Converted'
  | 'Lost';

export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'LinkedIn'
  | 'Instagram'
  | 'Email Campaign';

export type LeadPriority = 'High' | 'Medium' | 'Low';

export interface Note {
  _id: string;
  text: string;
  createdBy: string;
  createdAt: string;
}

export interface Activity {
  _id: string;
  type: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  notes: Note[];
  activities: Activity[];
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: Pagination;
}

export interface AnalyticsStats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  monthlyGrowth: number;
  thisMonthCount: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface MonthlyTrendPoint {
  month: string;
  leads: number;
  converted: number;
}

export interface AnalyticsData {
  stats: AnalyticsStats;
  statusBreakdown: ChartDataPoint[];
  sourceBreakdown: ChartDataPoint[];
  monthlyTrend: MonthlyTrendPoint[];
  upcomingFollowUps: Lead[];
  recentLeads: Lead[];
}

export interface ActivityItem {
  leadId: string;
  leadName: string;
  type: string;
  description: string;
  createdBy: string;
  createdAt: string;
  _id: string;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  priority?: LeadPriority | '';
  date?: 'today' | 'week' | 'month' | '';
  sort?: 'newest' | 'oldest' | 'alphabetical';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
