import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export const Card = ({ children, className, hover = false, delay = 0 }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' } : undefined}
    className={cn(
      'bg-surface border border-border rounded-[18px] p-6',
      hover && 'transition-shadow cursor-pointer',
      className
    )}
  >
    {children}
  </motion.div>
);

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('skeleton rounded-lg', className)} />
);

export const CardSkeleton = () => (
  <div className="bg-surface border border-border rounded-[18px] p-6 space-y-4">
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-8 w-1/2" />
    <Skeleton className="h-3 w-2/3" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr>
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);
