import { motion } from 'framer-motion';
import { LayoutDashboard, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants';
import { cn } from '../../utils';

const iconMap = {
  LayoutDashboard,
  Users,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const content = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-text-primary">Mini CRM</h1>
            <p className="text-xs text-text-muted">Lead Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item, index) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-accent-purple/20 to-accent-blue/10 text-text-primary border border-accent-purple/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/10">
          <p className="text-xs text-text-muted mb-1">Pro Tip</p>
          <p className="text-xs text-text-secondary">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-text-primary">N</kbd> to create a new lead
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-surface border-r border-border z-30">
        {content}
      </aside>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed inset-y-0 left-0 w-64 bg-surface border-r border-border z-50"
      >
        {content}
      </motion.aside>
    </>
  );
};
