import { motion } from 'framer-motion';
import { Eye, Pencil, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lead } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { formatDate, getInitials } from '../../utils';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable = ({ leads, onEdit, onDelete }: LeadTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-border">
            {['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Created', 'Actions'].map(
              (header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <motion.tr
              key={lead._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-border/50 hover:bg-white/[0.02] transition-colors group"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple/30 to-accent-cyan/30 flex items-center justify-center text-xs font-semibold">
                    {getInitials(lead.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{lead.name}</p>
                    <PriorityBadge priority={lead.priority} />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-text-secondary">{lead.email}</td>
              <td className="px-4 py-4 text-sm text-text-secondary">{lead.phone}</td>
              <td className="px-4 py-4 text-sm text-text-secondary">{lead.company}</td>
              <td className="px-4 py-4 text-sm text-text-secondary">{lead.source}</td>
              <td className="px-4 py-4">
                <StatusBadge status={lead.status} size="sm" />
              </td>
              <td className="px-4 py-4 text-sm text-text-muted">{formatDate(lead.createdAt)}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 transition-colors focus-ring"
                    aria-label={`View ${lead.name}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent-blue hover:bg-accent-blue/10 transition-colors focus-ring"
                    aria-label={`Edit ${lead.name}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lead)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring"
                    aria-label={`Delete ${lead.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const LeadCardList = ({ leads, onEdit, onDelete }: LeadTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden space-y-3">
      {leads.map((lead, index) => (
        <motion.div
          key={lead._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-surface border border-border rounded-2xl p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple/30 to-accent-cyan/30 flex items-center justify-center text-sm font-semibold">
                {getInitials(lead.name)}
              </div>
              <div>
                <p className="font-medium text-text-primary">{lead.name}</p>
                <p className="text-xs text-text-muted">{lead.company}</p>
              </div>
            </div>
            <StatusBadge status={lead.status} size="sm" />
          </div>
          <div className="space-y-1.5 mb-4 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              {lead.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              {lead.phone}
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              {lead.source} · {formatDate(lead.createdAt)}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="flex-1 py-2 text-xs font-medium rounded-xl bg-accent-purple/10 text-accent-purple"
            >
              View
            </button>
            <button
              onClick={() => onEdit(lead)}
              className="flex-1 py-2 text-xs font-medium rounded-xl bg-white/5 text-text-secondary"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(lead)}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-red-500/10 text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
