import type { LeadStatus, LeadPriority } from '../../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';
import { cn } from '../../utils';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {status}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: LeadPriority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const colors = PRIORITY_COLORS[priority];
  return (
    <span className={cn('inline-flex px-2 py-0.5 text-xs font-medium rounded-full', colors.bg, colors.text)}>
      {priority}
    </span>
  );
};
