import { useState, useEffect, useCallback } from 'react';
import type { LeadFilters, LeadsResponse } from '../types';
import { leadService } from '../services/leadService';
import { getErrorMessage } from '../services/api';

export const useLeads = (initialFilters: LeadFilters = {}) => {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, limit: 10, ...initialFilters });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await leadService.getLeads(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  }, []);

  return { data, filters, updateFilters, isLoading, error, refetch: fetchLeads };
};
