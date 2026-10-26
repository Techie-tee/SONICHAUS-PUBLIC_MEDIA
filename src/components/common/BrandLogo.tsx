import React, { useState } from 'react';

export interface BrandLogoProps {
  variant?: 'horizontal' | 'icon-only' | 'stacked' | 'full';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  useImageEmblem?: boolean;
}

/**
 * World-Class Precision Vector SVG Emblem for SONICVAULT STUDIOS
 * Features:
 * - Radiant Polished Chrome / Titanium Outer Vault Chamber Bezel
 * - Vault Locking Lugs & Calibrated Acoustic Quadrant Ticks
 * - Luminous Electric Cyan Neon Resonance Ring with Glow Filter
 * - Acoustic Soundwave Frequency Visualizer Radiating Outward
 * - Interlocking Champagne Gold S-V Monogram at the Acoustic Center
 * - High Contrast: Crisp, sharp, and 100% visible against any dark or glass background
 */
export function SonicVaultVectorMark({
  size = 44,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  const cyanGradId = `sv-cyan-${size}`;
  const goldGradId = `sv-gold-${size}`;
  const chromeGradId = `sv-chrome-${size}`;
  const chamberBgId = `sv-chamber-${size}`;
  const glowFilterId = `sv-glow-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300 group-hover:scale-105 shrink-0 block`}
      aria-label="SONICVAULT Master Acoustic Vault Emblem"
    >
      <defs>
        {/* Electric Cyan Neon Gradient */}
        <linearGradient id={cyanGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F7FF" />
          <stop offset="30%" stopColor="#38BDF8" />
          <stop offset="70%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Radiant Champagne Gold Monogram Gradient */}
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FDE68A" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* Polished Chrome / Titanium Ring Gradient */}
        <linearGradient id={chromeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#E2E8F0" />
          <stop offset="55%" stopColor="#94A3B8" />
          <stop offset="80%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Deep Acoustic Chamber Radial Gradient */}
        <radialGradient id={chamberBgId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0D1E38" />
          <stop offset="60%" stopColor="#060C18" />
          <stop offset="100%" stopColor="#020409" />
        </radialGradient>

        {/* High-Key Cyan Glow Filter */}
        <filter id={glowFilterId} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Outer Luminous Cyan Halo */}
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="1.5"
        opacity="0.35"
        filter={`url(#${glowFilterId})`}
      />

      {/* 2. Outer Precision Chrome Vault Bezel */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill={`url(#${chamberBgId})`}
        stroke={`url(#${chromeGradId})`}
        strokeWidth="4.5"
      />

      {/* 3. Vault Locking Lug Indices (North, South, East, West) */}
      <line x1="50" y1="8" x2="50" y2="13" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="87" x2="50" y2="92" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="50" x2="13" y2="50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <line x1="87" y1="50" x2="92" y2="50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

      {/* 4. Acoustic Stepped Frequency Arc */}
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="none"
        stroke={`url(#${cyanGradId})`}
        strokeWidth="1.2"
        strokeDasharray="2.5 3.5"
        opacity="0.85"
      />

      {/* 5. Brilliant Electric Cyan Neon Resonance Ring */}
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={`url(#${cyanGradId})`}
        strokeWidth="3.2"
        filter={`url(#${glowFilterId})`}
      />

      {/* 6. Dynamic Soundwave Frequency Oscillator Lines */}
      {/* Left Waveform Cluster */}
      <path
        d="M 20 50 L 24 43 L 28 57 L 31 36 L 35 64 L 38 50"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowFilterId})`}
        opacity="0.9"
      />
      {/* Right Waveform Cluster */}
      <path
        d="M 62 50 L 65 36 L 69 64 L 72 43 L 76 57 L 80 50"
        fill="none"
        stroke="#00F0FF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowFilterId})`}
        opacity="0.9"
      />

      {/* 7. Champagne Gold Sculpted S-V Monogram */}
      {/* S-Curve Shadow Base for 3D Pop */}
      <path
        d="M 39 36 C 39 28, 55 27, 58 35 C 60 41, 47 44, 48 51 C 49 58, 64 58, 64 50"
        fill="none"
        stroke="#02050D"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* S-Curve Main Gold Stroke */}
      <path
        d="M 39 36 C 39 28, 55 27, 58 35 C 60 41, 47 44, 48 51 C 49 58, 64 58, 64 50"
        fill="none"
        stroke={`url(#${goldGradId})`}
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* V-Vault Spear Shadow Base */}
      <path
        d="M 34 35 L 50 74 L 66 31"
        fill="none"
        stroke="#02050D"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* V-Vault Spear Main Gold Stroke */}
      <path
        d="M 34 35 L 50 74 L 66 31"
        fill="none"
        stroke={`url(#${goldGradId})`}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Diamond Glint on V Apex */}
      <circle cx="50" cy="74" r="2.2" fill="#FFFFFF" filter={`url(#${glowFilterId})`} />
    </svg>
  );
}

/**
 * SonicVault Luxury Emblem Badge
 * Renders the world-class emblem with ambient neon backglow and metallic bezel
 */
export function SonicVaultEmblemBadge({
  size = 44,
  className = '',
  useImage = false,
}: {
  size?: number;
  className?: string;
  useImage?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  // If using photo emblem mode and image didn't fail
  if (useImage && !imageError) {
    return (
      <div
        className={`relative shrink-0 rounded-full p-[2px] bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-950 shadow-[0_0_20px_rgba(0,240,255,0.45)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all duration-300 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-[#040711] flex items-center justify-center relative">
          <img
            src="/assets/logo/sonicvault-emblem.jpg"
            alt="SONICVAULT Master Emblem"
            className="w-full h-full object-cover object-[50%_40%] scale-125 group-hover:scale-130 transition-transform duration-500"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30 pointer-events-none" />
        </div>
      </div>
    );
  }

  // Vector mark is default: 100% crisp, zero loading latency, vibrant, razor-sharp at any size!
  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-br from-cyan-400/80 via-sky-500/40 to-slate-900 border border-cyan-400/40 shadow-[0_0_18px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_26px_rgba(0,240,255,0.65)] group-hover:border-cyan-400/80 transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full bg-[#050B16] flex items-center justify-center overflow-hidden">
        <SonicVaultVectorMark size={Math.round(size * 0.94)} />
      </div>
    </div>
  );
}

/**
 * Master BrandLogo Component with Responsive Variations
 */
export default function BrandLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = false,
  useImageEmblem = false,
}: BrandLogoProps) {
  // Dimension tokens optimized for maximum visibility and impact
  const sizeMap = {
    sm: {
      emblem: 34,
      text: 'text-sm sm:text-base',
      subText: 'text-[10px]',
      gap: 'gap-2.5 sm:gap-3',
      letterSpacing: 'tracking-[0.14em]',
    },
    md: {
      emblem: 40,
      text: 'text-sm sm:text-base lg:text-lg',
      subText: 'text-[10px] sm:text-[11px]',
      gap: 'gap-2 sm:gap-3 lg:gap-3.5',
      letterSpacing: 'tracking-[0.14em] sm:tracking-[0.16em]',
    },
    lg: {
      emblem: 56,
      text: 'text-xl sm:text-2xl',
      subText: 'text-xs',
      gap: 'gap-3.5 sm:gap-4',
      letterSpacing: 'tracking-[0.18em]',
    },
    xl: {
      emblem: 84,
      text: 'text-3xl sm:text-4xl',
      subText: 'text-sm',
      gap: 'gap-4 sm:gap-5',
      letterSpacing: 'tracking-[0.2em]',
    },
  };

  const currentSize = sizeMap[size];

  // 1. Icon-Only Mode
  if (variant === 'icon-only') {
    return (
      <div className={`group inline-flex items-center justify-center shrink-0 ${className}`}>
        <SonicVaultEmblemBadge
          size={currentSize.emblem}
          useImage={useImageEmblem}
        />
      </div>
    );
  }

  // 2. Stacked Mode (Splash screens, Auth cards, Modals)
  if (variant === 'stacked') {
    return (
      <div
        className={`flex flex-col items-center text-center ${currentSize.gap} ${className} group select-none shrink-0`}
      >
        <div className="relative shrink-0">
          {/* Ambient luminous backing aura */}
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/30 via-blue-600/25 to-sky-400/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
          <SonicVaultEmblemBadge
            size={currentSize.emblem * 1.2}
            useImage={useImageEmblem}
          />
        </div>

        <div className="space-y-1.5 shrink-0">
          <div
            className={`font-display font-black uppercase text-white ${currentSize.text} ${currentSize.letterSpacing} flex items-center justify-center gap-2 whitespace-nowrap`}
          >
            <span className="text-white brand-logo-text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              SONIC<span className="text-cyan-400">VAULT</span>
            </span>
            <span className="text-[#FDE68A] brand-logo-text-gold font-semibold tracking-[0.22em] text-[0.8em]">
              STUDIOS
            </span>
          </div>

          <div
            className={`font-mono text-cyan-200/80 brand-logo-tagline tracking-[0.28em] uppercase ${currentSize.subText} flex items-center justify-center gap-2 whitespace-nowrap`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>WHERE SOUND BECOMES ART · LEKKI PHASE 1</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Full Studio Credentials Mode (Footer, About)
  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col sm:flex-row items-center sm:items-start ${currentSize.gap} ${className} group select-none shrink-0`}
      >
        <div className="relative shrink-0">
          <div className="absolute -inset-2 bg-cyan-500/30 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
          <SonicVaultEmblemBadge
            size={currentSize.emblem}
            useImage={useImageEmblem}
          />
        </div>

        <div className="flex flex-col text-center sm:text-left shrink-0">
          <div
            className={`font-display font-extrabold uppercase text-white ${currentSize.text} ${currentSize.letterSpacing} flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap`}
          >
            <span className="text-white brand-logo-text-primary">SONIC<span className="text-cyan-400">VAULT</span></span>
            <span className="text-[#FDE68A] brand-logo-text-gold font-medium tracking-[0.22em] text-[0.82em]">
              STUDIOS
            </span>
          </div>

          <span
            className={`font-mono text-slate-300 tracking-[0.2em] uppercase mt-1 whitespace-nowrap ${currentSize.subText}`}
          >
            ACOUSTIC ARCHITECTURE · EST. 2026 · LEKKI, LAGOS
          </span>

          <div className="h-[2px] w-32 bg-gradient-to-r from-cyan-400 via-sky-500 to-transparent mt-2 rounded-full opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
        </div>
      </div>
    );
  }

  // 4. Standard Horizontal Mode (Navbar Header) - Crisp, punchy, ultra-visible, zero shrink, zero wrap
  return (
    <div
      className={`flex items-center ${currentSize.gap} ${className} group select-none shrink-0 whitespace-nowrap`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Intense neon cyan underglow for immediate contrast against any dark backdrop */}
        <div className="absolute -inset-1 bg-cyan-400/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <SonicVaultEmblemBadge
          size={currentSize.emblem}
          useImage={useImageEmblem}
        />
      </div>

      <div className="flex flex-col justify-center leading-tight shrink-0">
        <div
          className={`font-display font-black ${currentSize.letterSpacing} uppercase text-white ${currentSize.text} flex items-center gap-1.5 whitespace-nowrap`}
        >
          <span className="text-white brand-logo-text-primary group-hover:text-slate-100 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            SONIC<span className="text-cyan-400">VAULT</span>
          </span>
          <span className="text-[#FDE68A] brand-logo-text-gold font-bold text-[0.75em] tracking-[0.22em] sm:tracking-[0.24em] group-hover:text-[#FFFBEB] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            STUDIOS
          </span>
        </div>

        {showTagline ? (
          <span
            className={`font-mono text-cyan-200/90 tracking-[0.24em] uppercase mt-0.5 whitespace-nowrap ${currentSize.subText}`}
          >
            WHERE SOUND BECOMES ART
          </span>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 mt-0.5 shrink-0">
            <div className="h-[2px] w-16 lg:w-20 bg-gradient-to-r from-cyan-400 via-sky-400 to-transparent rounded-full opacity-80 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
