import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleProps {
  variant?: 'navbar' | 'drawer' | 'floating';
  className?: string;
}

export default function ThemeToggle({ variant = 'navbar', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'drawer') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between transition-all duration-300 cursor-pointer ${
          isDark
            ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
            : 'bg-black/5 hover:bg-black/10 text-slate-800 border border-black/10'
        } ${className}`}
        aria-label={isDark ? 'Switch to Daylight Mode' : 'Switch to Dark Mode'}
      >
        <span className="flex items-center gap-2.5 text-xs font-mono tracking-wider uppercase">
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
              <span>THEME: DAYLIGHT</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#4E85BF] shrink-0" />
              <span>THEME: DARK MODE</span>
            </>
          )}
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#4E85BF]/20 text-[#89AACC]">
          {isDark ? 'DARK ACTIVE' : 'DAYLIGHT ACTIVE'}
        </span>
      </button>
    );
  }

  // Navbar variant: Perfectly mirrors the Live Audio Toggle button style
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono border transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4E85BF] ${
        isDark
          ? 'border-white/15 text-slate-300 hover:text-white hover:border-white/30 bg-black/50 hover:bg-white/5'
          : 'border-slate-300/80 text-slate-700 hover:text-slate-950 hover:border-slate-400 bg-white/80 hover:bg-white shadow-xs'
      } ${className}`}
      title={isDark ? 'Switch to Daylight Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Daylight Mode' : 'Switch to Dark Mode'}
    >
      <span className="relative flex items-center gap-1.5">
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-300 hover:rotate-45 shrink-0" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-[#3b82f6] transition-transform duration-300 hover:-rotate-12 shrink-0" />
        )}
        <span className="hidden xl:inline tracking-wider uppercase">
          {isDark ? 'DAYLIGHT' : 'DARK'}
        </span>
      </span>
    </button>
  );
}
