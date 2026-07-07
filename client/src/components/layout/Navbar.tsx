import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Sun, Moon, LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils';

interface NavbarProps {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}

export const Navbar = ({ onMenuClick, title, subtitle }: NavbarProps) => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 glass border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 focus-ring"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-semibold text-text-primary"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <p className="text-xs text-text-muted hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/leads')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border text-text-muted text-sm hover:border-border-strong transition-colors focus-ring"
            aria-label="Search leads"
          >
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-xs">⌘K</kbd>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors focus-ring relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-purple rounded-full" />
            </button>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-2xl shadow-2xl p-4"
              >
                <h3 className="text-sm font-semibold mb-3">Notifications</h3>
                <p className="text-xs text-text-muted">You&apos;re all caught up.</p>
              </motion.div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors focus-ring"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-xs font-semibold text-white">
              {getInitials(admin?.name || 'A')}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{admin?.name}</p>
              <p className="text-xs text-text-muted">{admin?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
