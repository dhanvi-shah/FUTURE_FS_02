import { api } from './api';
import type {
  ApiResponse,
  Lead,
  LeadsResponse,
  LeadFilters,
  AnalyticsData,
  ActivityItem,
} from '../types';
import type { LeadFormData } from '../schemas';

export const leadService = {
  getLeads: async (filters: LeadFilters = {}) => {
    const response = await api.get<ApiResponse<LeadsResponse>>('/leads', { params: filters });
    return response.data.data;
  },

  getLead: async (id: string) => {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data.data;
  },

  createLead: async (data: LeadFormData) => {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    return response.data.data;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>) => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data.data;
  },

  deleteLead: async (id: string) => {
    await api.delete(`/leads/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}/status`, { status });
    return response.data.data;
  },

  addNote: async (id: string, text: string) => {
    const response = await api.post<ApiResponse<Lead>>(`/leads/${id}/note`, { text });
    return response.data.data;
  },

  updateFollowUp: async (id: string, followUpDate: string | null) => {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}/follow-up`, { followUpDate });
    return response.data.data;
  },

  getAnalytics: async () => {
    const response = await api.get<ApiResponse<AnalyticsData>>('/leads/analytics');
    return response.data.data;
  },

  getActivity: async (limit = 10) => {
    const response = await api.get<ApiResponse<ActivityItem[]>>('/leads/activity', {
      params: { limit },
    });
    return response.data.data;
  },

  exportCSV: async (filters: LeadFilters = {}) => {
    const response = await api.get('/leads/export', {
      params: filters,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
