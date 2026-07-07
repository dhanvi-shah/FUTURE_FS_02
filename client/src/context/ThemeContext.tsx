import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('crm_theme') as Theme | null;
    return stored || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('crm_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.style.setProperty('--color-background', '#f8f9fc');
      document.documentElement.style.setProperty('--color-surface', '#ffffff');
      document.documentElement.style.setProperty('--color-text-primary', '#18181b');
      document.documentElement.style.setProperty('--color-text-secondary', '#52525b');
    } else {
      document.documentElement.style.removeProperty('--color-background');
      document.documentElement.style.removeProperty('--color-surface');
      document.documentElement.style.removeProperty('--color-text-primary');
      document.documentElement.style.removeProperty('--color-text-secondary');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
