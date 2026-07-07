import { api } from './api';
import type { ApiResponse, AuthResponse } from '../types';
import type { LoginFormData } from '../schemas';

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email: data.email,
      password: data.password,
    });
    return response.data.data;
  },
};
