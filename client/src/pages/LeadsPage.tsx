import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { leadService } from '../services/leadService';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { LeadTable, LeadCardList } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { TableRowSkeleton } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Lead } from '../types';
import type { LeadFormData } from '../schemas';
import { getErrorMessage } from '../services/api';

export const LeadsPage = () => {
  const { data, filters, updateFilters, isLoading, refetch } = useLeads();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const openCreate = useCallback(() => {
    setEditingLead(null);
    setModalOpen(true);
  }, []);

  useKeyboardShortcut('n', openCreate);

  const handleSubmit = async (formData: LeadFormData) => {
    setIsSubmitting(true);
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead._id, formData);
        toast.success('Lead updated successfully');
      } else {
        await leadService.createLead(formData);
        toast.success('Lead created successfully');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await leadService.deleteLead(deleteTarget._id);
      toast.success('Lead deleted successfully');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadService.exportCSV(filters);
      toast.success('Export downloaded');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  const leads = data?.leads || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <LeadFiltersBar
        filters={filters}
        onFilterChange={updateFilters}
        onCreateClick={openCreate}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <Card className="!p-0 overflow-hidden">
        {isLoading ? (
          <table className="w-full hidden md:table">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters or create your first lead to get started."
            actionLabel="Create Lead"
            onAction={openCreate}
          />
        ) : (
          <>
            <LeadTable
              leads={leads}
              onEdit={(lead) => {
                setEditingLead(lead);
                setModalOpen(true);
              }}
              onDelete={setDeleteTarget}
            />
            <div className="p-4 md:hidden">
              <LeadCardList
                leads={leads}
                onEdit={(lead) => {
                  setEditingLead(lead);
                  setModalOpen(true);
                }}
                onDelete={setDeleteTarget}
              />
            </div>
          </>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-text-muted">
              Showing {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => updateFilters({ page: pagination.page - 1 })}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateFilters({ page: pagination.page + 1 })}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingLead ? 'Edit Lead' : 'Create New Lead'}
        description={editingLead ? 'Update lead information' : 'Add a new lead to your pipeline'}
        size="lg"
      >
        <LeadForm
          initialData={editingLead || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
};
