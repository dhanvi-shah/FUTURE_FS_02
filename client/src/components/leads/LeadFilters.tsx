import { useState, useMemo } from 'react';
import { Search, Plus, Download, Filter } from 'lucide-react';
import { LEAD_STATUSES, LEAD_SOURCES, LEAD_PRIORITIES, DATE_FILTERS, SORT_OPTIONS } from '../../constants';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { debounce } from '../../utils';
import type { LeadFilters } from '../../types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onCreateClick: () => void;
  onExport: () => void;
  isExporting?: boolean;
}

export const LeadFiltersBar = ({
  filters,
  onFilterChange,
  onCreateClick,
  onExport,
  isExporting,
}: LeadFiltersBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  const debouncedSearch = useMemo(
    () => debounce((value: string) => onFilterChange({ search: value }), 300),
    [onFilterChange]
  );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="search"
            placeholder="Search by name, email, or company..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus-ring focus:border-accent-purple/50"
            aria-label="Search leads"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md" onClick={() => setShowFilters(!showFilters)} leftIcon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
          <Button variant="outline" size="md" onClick={onExport} isLoading={isExporting} leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button size="md" onClick={onCreateClick} leftIcon={<Plus className="w-4 h-4" />}>
            New Lead
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-surface border border-border rounded-2xl">
          <Select
            label="Status"
            options={[{ label: 'All Statuses', value: '' }, ...LEAD_STATUSES.map((s) => ({ label: s, value: s }))]}
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value as LeadFilters['status'] })}
          />
          <Select
            label="Source"
            options={[{ label: 'All Sources', value: '' }, ...LEAD_SOURCES.map((s) => ({ label: s, value: s }))]}
            value={filters.source || ''}
            onChange={(e) => onFilterChange({ source: e.target.value as LeadFilters['source'] })}
          />
          <Select
            label="Priority"
            options={[{ label: 'All Priorities', value: '' }, ...LEAD_PRIORITIES.map((p) => ({ label: p, value: p }))]}
            value={filters.priority || ''}
            onChange={(e) => onFilterChange({ priority: e.target.value as LeadFilters['priority'] })}
          />
          <Select
            label="Date"
            options={DATE_FILTERS.map((d) => ({ label: d.label, value: d.value }))}
            value={filters.date || ''}
            onChange={(e) => onFilterChange({ date: e.target.value as LeadFilters['date'] })}
          />
          <Select
            label="Sort"
            options={SORT_OPTIONS.map((s) => ({ label: s.label, value: s.value }))}
            value={filters.sort || 'newest'}
            onChange={(e) => onFilterChange({ sort: e.target.value as LeadFilters['sort'] })}
          />
        </div>
      )}
    </div>
  );
};
