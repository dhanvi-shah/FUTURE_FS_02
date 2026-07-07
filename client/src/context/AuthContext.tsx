import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Admin } from '../types';
import { authService } from '../services/authService';
import type { LoginFormData } from '../schemas';
import { getErrorMessage } from '../services/api';

interface AuthContextValue {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const loadStoredAdmin = (): Admin | null => {
  const stored =
    localStorage.getItem('crm_admin') || sessionStorage.getItem('crm_admin');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as Admin;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAdmin(loadStoredAdmin());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    const result = await authService.login(data);
    const storage = data.remember ? localStorage : sessionStorage;
    storage.setItem('crm_token', result.token);
    storage.setItem('crm_admin', JSON.stringify(result.admin));
    setAdmin(result.admin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_admin');
    sessionStorage.removeItem('crm_token');
    sessionStorage.removeItem('crm_admin');
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      isLoading,
      login,
      logout,
    }),
    [admin, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const useAuthError = () => getErrorMessage;
