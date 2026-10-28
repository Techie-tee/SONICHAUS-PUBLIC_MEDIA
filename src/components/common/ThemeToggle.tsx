import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleProps {
  variant?: 'navbar' | 'drawer' | 'floating';
  className?: string;
}

export default function ThemeToggle({ variant = 'navbar', className = '' }: ThemeToggleProps) {
  const { toggleTheme, isDark } = useTheme();

  if (variant === 'drawer') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors duration-300 cursor-pointer ${
          isDark
            ? 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
            : 'bg-black/5 hover:bg-black/10 text-slate-800 border border-black/10'
        } ${className}`}
        aria-label={isDark ? 'Switch to Daylight Atmosphere' : 'Switch to Dark Vault Atmosphere'}
      >
        <span className="flex items-center gap-2.5 text-xs font-mono tracking-wider uppercase">
          {isDark ? (
            <>
              <Moon className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>ATMOSPHERE: DARK VAULT</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <span>ATMOSPHERE: DAYLIGHT</span>
            </>
          )}
        </span>
        <div className="relative w-12 h-6 rounded-full p-0.5 bg-black/40 border border-white/20 flex items-center">
          <div
            className="w-5 h-5 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              transform: isDark ? 'translateX(24px)' : 'translateX(0px)',
              backgroundColor: isDark ? '#22d3ee' : '#f59e0b',
            }}
          >
            {isDark ? <Moon className="w-2.5 h-2.5 text-slate-950" /> : <Sun className="w-2.5 h-2.5 text-slate-950" />}
          </div>
        </div>
      </button>
    );
  }

  // Navbar variant: Seamless Architectural Luxury Sliding Switch
  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <button
        onClick={toggleTheme}
        type="button"
        role="switch"
        aria-checked={isDark}
        className={`theme-sliding-toggle group relative w-[58px] h-[30px] rounded-full p-1 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4E85BF] shrink-0 transition-colors duration-300 ${
          isDark
            ? 'bg-[#060a12] border border-cyan-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] hover:border-cyan-400/60'
            : 'bg-[#ECEBE6] border border-[#D9D9D3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] hover:border-[#4E85BF]'
        }`}
        title={isDark ? 'Atmosphere: Dark Vault · Click for Daylight' : 'Atmosphere: Daylight · Click for Dark Vault'}
        aria-label={isDark ? 'Switch to Daylight Atmosphere' : 'Switch to Dark Vault Atmosphere'}
      >
        {/* Ambient track indicators */}
        <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
          {/* Subtle amber sun indicator for light mode */}
          <span
            className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
              isDark ? 'opacity-20 bg-amber-400' : 'opacity-0'
            }`}
          />
          {/* Subtle cyan moon indicator for dark mode */}
          <span
            className={`w-2 h-2 rounded-full transition-opacity duration-300 ${
              isDark ? 'opacity-0' : 'opacity-25 bg-cyan-400'
            }`}
          />
        </div>

        {/* Tactile Sliding Luxury Thumb Knob with Smooth Icon Morph */}
        <div
          className={`relative w-[22px] h-[22px] rounded-full flex items-center justify-center shadow-md pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] ${
            isDark
              ? 'bg-gradient-to-br from-[#131d2e] to-[#09111e] text-cyan-300 border border-cyan-400/60 shadow-[0_2px_8px_rgba(0,0,0,0.8),0_0_10px_rgba(34,211,238,0.4)]'
              : 'bg-white text-amber-500 border border-amber-300/90 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_8px_rgba(245,158,11,0.3)]'
          }`}
          style={{
            transform: isDark ? 'translateX(28px)' : 'translateX(0px)',
          }}
        >
          {/* Sun icon with smooth rotation and fade */}
          <Sun
            className={`absolute w-3.5 h-3.5 text-amber-500 transition-all duration-300 ease-out ${
              isDark
                ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
                : 'opacity-100 rotate-0 scale-100'
            }`}
          />

          {/* Moon icon with smooth rotation and fade */}
          <Moon
            className={`absolute w-3.5 h-3.5 text-cyan-300 transition-all duration-300 ease-out ${
              isDark
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
            }`}
          />
        </div>
      </button>
    </div>
  );
}
