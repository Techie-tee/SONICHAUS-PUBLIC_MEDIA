import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
  isDaylight: boolean;
}

const THEME_STORAGE_KEY = 'sonicvault_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
        if (saved === 'dark' || saved === 'light') {
          return saved;
        }
        // If no saved preference, respect OS preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          return 'light';
        }
      } catch {
        // LocalStorage fallback
      }
    }
    return 'dark'; // SonicVault Studios defaults to dark cinematic studio atmosphere
  });

  // Apply theme classes to documentElement
  const applyThemeToDOM = useCallback((currentTheme: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (currentTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  }, []);

  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // Storage access safety
      }
      applyThemeToDOM(newTheme);
    },
    [applyThemeToDOM]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  }, [theme, setTheme]);

  // Synchronize on mount and listen to system preference changes if user hasn't explicitly set one
  useEffect(() => {
    applyThemeToDOM(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const hasSaved = localStorage.getItem(THEME_STORAGE_KEY);
      if (!hasSaved) {
        const systemTheme: ThemeMode = e.matches ? 'light' : 'dark';
        setThemeState(systemTheme);
        applyThemeToDOM(systemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme, applyThemeToDOM]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        isDaylight: theme === 'light',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
