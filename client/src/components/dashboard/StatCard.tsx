import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { cn } from '../../utils';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  decimals?: number;
  change?: number;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  suffix = '',
  decimals = 0,
  change,
  icon: Icon,
  gradient,
  delay = 0,
}: StatCardProps) => (
  <Card delay={delay} hover className="relative overflow-hidden">
    <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20', gradient)} />
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', gradient)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              change >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
            )}
          >
            {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-sm text-text-secondary mb-1">{title}</p>
      <p className="text-3xl font-bold text-text-primary">
        <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
      </p>
    </div>
  </Card>
);

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const StaggerContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div variants={itemVariants} className={className}>
    {children}
  </motion.div>
);
