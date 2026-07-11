import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const normalizeApiUrl = (value: string) => {
  const trimmed = value.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
);

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: import.meta.env.PROD ? 60000 : 15000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('crm_token') || sessionStorage.getItem('crm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    const status = error.response?.status;

    if (status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_admin');
      sessionStorage.removeItem('crm_token');
      sessionStorage.removeItem('crm_admin');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    } else if (!error.config?.url?.includes('/auth/login')) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return `Cannot reach the server at ${API_URL}. Check that the backend is running and CORS is configured.`;
    }
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};
