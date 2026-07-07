import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  Send,
} from 'lucide-react';
import { leadService } from '../services/leadService';
import { noteSchema, type NoteFormData } from '../schemas';
import { LEAD_STATUSES } from '../constants';
import type { Lead } from '../types';
import { getErrorMessage } from '../services/api';
import { Card } from '../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { CardSkeleton } from '../components/ui/Card';
import { formatDate, formatDateTime, formatRelativeTime, getInitials } from '../utils';

export const LeadDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const fetchLead = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await leadService.getLead(id);
      setLead(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
      navigate('/leads');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: { text: '' },
  });

  const handleStatusChange = async (status: string) => {
    if (!id) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await leadService.updateStatus(id, status);
      setLead(updated);
      toast.success('Status updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (data: NoteFormData) => {
    if (!id) return;
    setIsAddingNote(true);
    try {
      const updated = await leadService.addNote(id, data.text);
      setLead(updated);
      reset();
      toast.success('Note added');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleFollowUpChange = async (date: string) => {
    if (!id) return;
    try {
      const updated = await leadService.updateFollowUp(id, date || null);
      setLead(updated);
      toast.success('Follow-up date updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading || !lead) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const sortedActivities = [...(lead.activities || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/leads')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-xl font-bold text-white">
                {getInitials(lead.name)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{lead.name}</h2>
                <p className="text-text-secondary">{lead.company}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <StatusBadge status={lead.status} />
                  <PriorityBadge priority={lead.priority} />
                  <span className="text-xs text-text-muted px-2 py-1 rounded-full bg-white/5">
                    {lead.source}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <Select
                label="Update Status"
                options={LEAD_STATUSES.map((s) => ({ label: s, value: s }))}
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={isUpdatingStatus}
              />
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleFollowUpChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus-ring"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Email</p>
                <a href={`mailto:${lead.email}`} className="text-sm text-accent-purple hover:underline">
                  {lead.email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Phone</p>
                <p className="text-sm">{lead.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Company</p>
                <p className="text-sm">{lead.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">Created</p>
                <p className="text-sm">{formatDate(lead.createdAt)}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card delay={0.1}>
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-4 h-4 text-accent-purple" />
              <h3 className="font-semibold">Notes</h3>
              <span className="text-xs text-text-muted">({lead.notes?.length || 0})</span>
            </div>

            <form onSubmit={handleSubmit(handleAddNote)} className="mb-6">
              <textarea
                {...register('text')}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm resize-none focus-ring focus:border-accent-purple/50"
              />
              {errors.text && (
                <p className="text-xs text-red-400 mt-1">{errors.text.message}</p>
              )}
              <div className="flex justify-end mt-2">
                <Button type="submit" size="sm" isLoading={isAddingNote} leftIcon={<Send className="w-3.5 h-3.5" />}>
                  Add Note
                </Button>
              </div>
            </form>

            {lead.notes?.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-6">No notes yet. Add your first note above.</p>
            ) : (
              <div className="space-y-4">
                {lead.notes.map((note, index) => (
                  <motion.div
                    key={note._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-background border border-border/50"
                  >
                    <p className="text-sm text-text-primary">{note.text}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                      <span>{note.createdBy}</span>
                      <span>·</span>
                      <span>{formatDateTime(note.createdAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card delay={0.2}>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-accent-cyan" />
            <h3 className="font-semibold">Activity Timeline</h3>
          </div>
          {sortedActivities.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">No activity yet.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-6">
                {sortedActivities.map((activity, index) => (
                  <motion.div
                    key={activity._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-6"
                  >
                    <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-surface border-2 border-accent-purple" />
                    <p className="text-sm text-text-primary">{activity.description}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {activity.createdBy} · {formatRelativeTime(activity.createdAt)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
