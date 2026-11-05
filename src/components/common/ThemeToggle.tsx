import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleProps {
  variant?: 'navbar' | 'drawer' | 'floating';
  className?: string;
}

/**
 * Bespoke Architectural Studio Atmosphere Dial for SONICVAULT STUDIOS
 * 
 * Inspired by high-end analog mastering console rotary step dials (Rupert Neve, Tube-Tech)
 * and luxury Swiss vault horology:
 * - Machined aeronautical alloy bezel with precision micro-chamfer
 * - Luminous acoustic calibration track with active LED filament indicators
 * - Tactile 3D rotary jewel knob featuring:
 *   • Daylight Mode: 18k Champagne Gold Solar Crown with 8-ray diamond sunburst
 *   • Dark Vault Mode: Deep Sapphire Obsidian Jewel with Celestial Neon Cyan Crescent & Orbital Stars
 * - Kinetic 180° rotary spin upon toggling with weighted magnetic snap
 */
export default function ThemeToggle({ variant = 'navbar', className = '' }: ThemeToggleProps) {
  const { toggleTheme, isDark } = useTheme();

  // 1. Mobile Navigation Drawer Variant (Expanded Studio Control Strip)
  if (variant === 'drawer') {
    return (
      <button
        onClick={(e) => toggleTheme(e)}
        type="button"
        role="switch"
        aria-checked={isDark}
        className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer select-none group border shadow-lg ${
          isDark
            ? 'bg-gradient-to-r from-[#070D1A] via-[#091322] to-[#040810] border-cyan-500/30 text-slate-200 hover:border-cyan-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-gradient-to-r from-[#F8F7F4] via-[#FFFFFF] to-[#F1EFEA] border-[#D9D9D3] text-[#17191D] hover:border-[#F59E0B]/60 shadow-[0_4px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]'
        } ${className}`}
        aria-label={isDark ? 'Switch to Daylight Atmosphere' : 'Switch to Dark Vault Atmosphere'}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
              isDark
                ? 'bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'bg-amber-100/80 border border-amber-300 text-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
            }`}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-12">
                <path
                  d="M14.8 7.2C13.2 7.8 12 9.5 12 11.5C12 14 14 16 16.5 16C17.3 16 18 15.7 18.6 15.3C18 17.8 15.8 19.5 13 19.5C9.4 19.5 6.5 16.6 6.5 13C6.5 9.7 9 7.1 12.2 6.6C13.1 6.5 14 6.7 14.8 7.2Z"
                  fill="#00F0FF"
                  stroke="#38BDF8"
                  strokeWidth="0.8"
                />
                <circle cx="17.5" cy="7.5" r="1.2" fill="#FFFFFF" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:rotate-45">
                <circle cx="12" cy="12" r="4.2" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
                <path d="M12 2.5V4.5M12 19.5V21.5M2.5 12H4.5M19.5 12H21.5M5.3 5.3L6.7 6.7M17.3 17.3L18.7 18.7M5.3 18.7L6.7 17.3M17.3 6.7L18.7 5.3" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div className="flex flex-col text-left">
            <span className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>ATMOSPHERE</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                isDark ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30' : 'bg-amber-500/15 text-amber-700 border border-amber-400/30'
              }`}>
                {isDark ? 'DARK VAULT' : 'DAYLIGHT'}
              </span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wide mt-0.5">
              {isDark ? 'Acoustic Sanctuary & Laser Resonance' : 'Architectural Natural Warm Light'}
            </span>
          </div>
        </div>

        {/* Stepped Switch Indicator */}
        <div
          className={`relative w-12 h-6 rounded-full p-0.5 flex items-center transition-colors duration-300 ${
            isDark ? 'bg-[#030710] border border-cyan-500/40 shadow-inner' : 'bg-[#E5E3DC] border border-[#D0CDC4] shadow-inner'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.35,0.64,1)] ${
              isDark
                ? 'translate-x-6 bg-gradient-to-br from-cyan-400 to-sky-600 text-slate-950 shadow-[0_0_10px_#00F0FF]'
                : 'translate-x-0 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-[0_0_10px_#F59E0B]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      </button>
    );
  }

  // 2. Navbar Variant: Precision-Engineered Haute Studio Rotary Switch
  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <button
        onClick={(e) => toggleTheme(e)}
        type="button"
        role="switch"
        aria-checked={isDark}
        className={`theme-sliding-toggle group relative w-[48px] min-[360px]:w-[54px] sm:w-[62px] h-[26px] min-[360px]:h-[28px] sm:h-[32px] rounded-full p-[2.5px] min-[360px]:p-[3px] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4E85BF] shrink-0 transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#091222] to-[#03060C] border border-cyan-400/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_0_12px_rgba(0,240,255,0.18)] hover:border-cyan-300 hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_0_18px_rgba(0,240,255,0.45)]'
            : 'bg-gradient-to-b from-[#FAF9F5] via-[#F2EFE8] to-[#E8E4DA] border border-[#D4CEBF] shadow-[inset_0_2px_5px_rgba(23,25,29,0.08),0_1px_3px_rgba(255,255,255,0.9),0_0_10px_rgba(245,158,11,0.15)] hover:border-amber-400/80 hover:shadow-[inset_0_2px_5px_rgba(23,25,29,0.08),0_0_16px_rgba(245,158,11,0.35)]'
        }`}
        title={isDark ? 'Studio Atmosphere: Dark Vault · Click for Daylight' : 'Studio Atmosphere: Daylight · Click for Dark Vault'}
        aria-label={isDark ? 'Switch to Daylight Atmosphere' : 'Switch to Dark Vault Atmosphere'}
      >
        {/* Subtle Machined Metallic Edge Chamfer */}
        <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-white/10" />

        {/* Ambient Calibrated Audio Track (Micro Pips & Middle Stepped Ticks) */}
        <div className="absolute inset-0 flex items-center justify-between px-2 min-[360px]:px-2.5 sm:px-3 pointer-events-none select-none">
          {/* Left Solar Pip (Daylight Position Indicator) */}
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              isDark
                ? 'bg-amber-400/25 scale-75'
                : 'bg-amber-500 scale-110 shadow-[0_0_8px_#F59E0B]'
            }`}
          />

          {/* Calibrated Studio Stepped Graticule Lines (Middle Dial Bridge) */}
          <div className="hidden min-[360px]:flex items-center gap-0.5 sm:gap-1 opacity-40">
            <span className={`w-0.5 h-1.5 rounded-full transition-colors ${isDark ? 'bg-cyan-400/40' : 'bg-slate-400/50'}`} />
            <span className={`w-0.5 h-2.5 rounded-full transition-colors ${isDark ? 'bg-cyan-300/60' : 'bg-slate-600/60'}`} />
            <span className={`w-0.5 h-1.5 rounded-full transition-colors ${isDark ? 'bg-cyan-400/40' : 'bg-slate-400/50'}`} />
          </div>

          {/* Right Celestial Pip (Dark Vault Position Indicator) */}
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              isDark
                ? 'bg-[#00F0FF] scale-110 shadow-[0_0_8px_#00F0FF]'
                : 'bg-cyan-400/20 scale-75'
            }`}
          />
        </div>

        {/* Tactile 3D Master Vault Potentiometer Knob (Rotary Kinetic Spin + Weighted Glide) */}
        <div
          className={`relative w-[21px] min-[360px]:w-[22px] sm:w-[26px] h-[21px] min-[360px]:h-[22px] sm:h-[26px] rounded-full flex items-center justify-center pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.35,0.64,1)] ${
            isDark
              ? 'translate-x-[22px] min-[360px]:translate-x-[25px] sm:translate-x-[30px] rotate-180 bg-gradient-to-br from-[#1C2C45] via-[#0E1B2E] to-[#040810] border border-cyan-300/90 shadow-[0_2px_10px_rgba(0,0,0,0.95),0_0_14px_rgba(0,240,255,0.6)]'
              : 'translate-x-0 rotate-0 bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF8] to-[#F7EED9] border border-amber-400/90 shadow-[0_2px_8px_rgba(23,25,29,0.18),0_0_12px_rgba(245,158,11,0.45)]'
          }`}
        >
          {/* Micro-knurled Outer Dial Ring Texture */}
          <div
            className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-300 pointer-events-none opacity-40 ${
              isDark ? 'border-cyan-200' : 'border-amber-600'
            }`}
          />

          {/* Jewel Lens Reflection Highlight */}
          <div className="absolute top-0.5 inset-x-1 h-[30%] bg-gradient-to-b from-white/70 to-transparent rounded-t-full pointer-events-none" />

          {/* Center Graphic 1: Daylight Solar Crown Icon (Visible in Light Mode) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${
              isDark
                ? 'opacity-0 scale-50 rotate-90 pointer-events-none'
                : 'opacity-100 scale-100 rotate-0'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-45 duration-300"
            >
              <defs>
                <radialGradient id="sun-gold-core" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </radialGradient>
              </defs>
              {/* Central Radiant Sun Core */}
              <circle cx="12" cy="12" r="4.2" fill="url(#sun-gold-core)" stroke="#B45309" strokeWidth="1" />
              <circle cx="12" cy="12" r="1.8" fill="#FFFFFF" opacity="0.9" />
              {/* 8 Cardinal & Diagonal Architectural Rays */}
              <path d="M12 2.5V4.8M12 19.2V21.5M2.5 12H4.8M19.2 12H21.5" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
              <path d="M5.3 5.3L6.9 6.9M17.1 17.1L18.7 18.7M5.3 18.7L6.9 17.1M17.1 6.9L18.7 5.3" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          {/* Center Graphic 2: Dark Vault Celestial Moon & Nebula Icon (Visible in Dark Mode) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out ${
              isDark
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-50 -rotate-90 pointer-events-none'
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110 duration-300"
            >
              <defs>
                <linearGradient id="moon-cyan-core" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E0F7FF" />
                  <stop offset="40%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
              </defs>
              {/* Architectural Precision Crescent */}
              <path
                d="M15.5 7.5C13.8 8.2 12.5 10 12.5 12C12.5 14.5 14.5 16.5 17 16.5C17.8 16.5 18.6 16.2 19.2 15.8C18.5 18.3 16.2 20 13.5 20C9.9 20 7 17.1 7 13.5C7 10 9.6 7.2 13 6.6C13.9 6.5 14.7 6.8 15.5 7.5Z"
                fill="url(#moon-cyan-core)"
                stroke="#00F0FF"
                strokeWidth="1"
              />
              {/* Celestial Glint & Micro Orbitals */}
              <circle cx="18" cy="7" r="1.3" fill="#FFFFFF" />
              <circle cx="15.5" cy="4.5" r="0.8" fill="#38BDF8" />
              <circle cx="20" cy="10" r="0.8" fill="#00F0FF" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}
