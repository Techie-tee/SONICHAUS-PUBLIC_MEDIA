import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: (event?: React.MouseEvent | MouseEvent | TouchEvent) => void;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
  isDaylight: boolean;
}

const THEME_STORAGE_KEY = 'sonicvault_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Trigger a floating atmospheric wave across the viewport
function spawnMagicalThemeWave(x: number, y: number, isGoingLight: boolean) {
  if (typeof document === 'undefined') return;

  const ripple = document.createElement('div');
  ripple.className = 'magical-theme-wave-portal';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.background = isGoingLight
    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.96) 0%, rgba(245, 244, 240, 0.92) 50%, rgba(78, 133, 191, 0.3) 80%, transparent 100%)'
    : 'radial-gradient(circle, rgba(6, 10, 18, 0.96) 0%, rgba(4, 6, 9, 0.94) 50%, rgba(34, 211, 238, 0.25) 80%, transparent 100%)';

  document.body.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 950);
}

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
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
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

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | MouseEvent | TouchEvent) => {
      const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';

      // 1. Calculate origin coordinates for the magical circular reveal
      let originX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
      let originY = typeof window !== 'undefined' ? 40 : 0;

      if (event && 'clientX' in event && event.clientX) {
        originX = event.clientX;
        originY = event.clientY;
      } else if (typeof document !== 'undefined') {
        const toggleEl = document.querySelector('.theme-sliding-toggle');
        if (toggleEl) {
          const rect = toggleEl.getBoundingClientRect();
          originX = rect.left + rect.width / 2;
          originY = rect.top + rect.height / 2;
        }
      }

      // Max radius to the furthest corner of viewport
      const endRadius = typeof window !== 'undefined'
        ? Math.hypot(
            Math.max(originX, window.innerWidth - originX),
            Math.max(originY, window.innerHeight - originY)
          )
        : 1000;

      // Set CSS custom properties on documentElement
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--toggle-x', `${originX}px`);
        document.documentElement.style.setProperty('--toggle-y', `${originY}px`);
        document.documentElement.style.setProperty('--toggle-r', `${endRadius}px`);
      }

      // 2. Beautiful circular ripple bloom
      spawnMagicalThemeWave(originX, originY, nextTheme === 'light');

      // 3. View Transitions API with custom keyframe circular reveal
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        const transition = (document as any).startViewTransition(() => {
          setTheme(nextTheme);
        });

        transition.ready?.then(() => {
          document.documentElement.animate(
            [
              {
                clipPath: `circle(0px at ${originX}px ${originY}px)`,
                filter: nextTheme === 'light' ? 'brightness(1.15) contrast(1.05)' : 'brightness(0.9) contrast(1.1)',
              },
              {
                clipPath: `circle(${endRadius}px at ${originX}px ${originY}px)`,
                filter: 'brightness(1) contrast(1)',
              },
            ],
            {
              duration: 750,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        }).catch(() => {
          // Fallback if animation promise cancels
        });
      } else {
        setTheme(nextTheme);
      }
    },
    [theme, setTheme]
  );

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
