import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';
import entranceMobileImg from '../../assets/images/mobile/scene_01_entrance_mobile.jpg';
import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import vocalBoothMobileImg from '../../assets/images/mobile/scene_02_vocal_booth_mobile.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import controlRoomMobileImg from '../../assets/images/control_room_mobile_1792483021817.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import productionLabMobileImg from '../../assets/images/production_lab_mobile_1792482735447.jpg';
import masterSuiteImg from '../../assets/images/studio_05_master_suite_1792446834087.jpg';
import masterSuiteMobileImg from '../../assets/images/master_suite_mobile_1792482735792.jpg';

interface CinematicHeroProps {
  onOpenBooking: (roomId?: string) => void;
  onExploreSpaces: () => void;
}

interface TourScene {
  id: string;
  title: string;
  image: string;
  mobileImage: string;
  soundIndex: number;
}

// 5 Real, Consistent Studio Facilities
// 100% Character & Equipment Consistency across Mobile, Tablet, PC, and Desktop
const TOUR_SCENES: TourScene[] = [
  {
    id: 'studio-entrance',
    title: 'SONICVAULT ARCHITECTURAL ENTRANCE',
    image: entranceImg,
    mobileImage: entranceMobileImg,
    soundIndex: 0,
  },
  {
    id: 'vocal-booth',
    title: 'THE VAULT VOCAL BOOTH',
    image: vocalBoothImg,
    mobileImage: vocalBoothMobileImg,
    soundIndex: 1,
  },
  {
    id: 'control-room-live',
    title: 'MASTER CONTROL ROOM & LIVE BOOTH SIGHTLINE',
    image: controlRoomImg,
    mobileImage: controlRoomMobileImg,
    soundIndex: 2,
  },
  {
    id: 'production-lab',
    title: 'THE MODULAR PRODUCTION LAB',
    image: productionLabImg,
    mobileImage: productionLabMobileImg,
    soundIndex: 3,
  },
  {
    id: 'master-suite',
    title: 'ANALOG MASTERING SUITE',
    image: masterSuiteImg,
    mobileImage: masterSuiteMobileImg,
    soundIndex: 4,
  },
];

export default function CinematicHero({ onOpenBooking, onExploreSpaces }: CinematicHeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Synchronize scroll position strictly on scroll event using RAF for silky performance across all devices
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        const totalScrollHeight = container.scrollHeight - viewportH;
        if (totalScrollHeight <= 0) return;

        const currentScroll = Math.max(0, -rect.top);
        const rawProgress = Math.min(1, Math.max(0, currentScroll / totalScrollHeight));

        setScrollProgress(rawProgress);

        // Trigger room audio stems as user enters each space
        const sceneIndex = Math.min(
          TOUR_SCENES.length - 1,
          Math.floor(rawProgress * TOUR_SCENES.length)
        );

        if (sceneIndex !== activeSceneRef.current) {
          activeSceneRef.current = sceneIndex;
          audioEngine.triggerRoomAudio(sceneIndex);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to establish initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Keyboard accessibility navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        const muted = audioEngine.toggleMute();
        setIsAudioMuted(muted);
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        window.scrollBy({ top: window.innerHeight * 0.45, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        window.scrollBy({ top: -window.innerHeight * 0.45, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAudioToggle = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  // Opening headline opacity: Fades out smoothly as you begin scrolling
  const introOpacity = Math.max(0, 1 - scrollProgress * 10);
  const totalScenes = TOUR_SCENES.length;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500vh] bg-[#040609]"
      id="tour"
    >
      {/* Sticky Fullscreen Hero Viewport (using 100dvh for mobile address bar safety) */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none">
        {/* Full-bleed Edge-to-Edge Cinematic Studio Image Canvas Layers */}
        {/* Consistent visual effects, editing, and scale dolly across Mobile, Tablet, PC, and Desktop */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {TOUR_SCENES.map((scene, idx) => {
            const sceneStep = 1 / totalScenes;
            const sceneStart = idx * sceneStep;
            const sceneEnd = (idx + 1) * sceneStep;

            // Normalized scene progress: 0 (entering) to 1 (leaving)
            const localProgress = Math.max(0, Math.min(1, (scrollProgress - sceneStart) / sceneStep));

            // Smooth cross-fade calculation strictly proportional to scroll
            let opacity = 0;
            if (scrollProgress >= sceneStart && scrollProgress <= sceneEnd) {
              opacity = 1;
            } else if (scrollProgress < sceneStart && scrollProgress >= sceneStart - sceneStep * 0.4) {
              const fadeRatio = (scrollProgress - (sceneStart - sceneStep * 0.4)) / (sceneStep * 0.4);
              opacity = Math.max(0, Math.min(1, fadeRatio));
            } else if (scrollProgress > sceneEnd && scrollProgress <= sceneEnd + sceneStep * 0.4) {
              const fadeRatio = 1 - (scrollProgress - sceneEnd) / (sceneStep * 0.4);
              opacity = Math.max(0, Math.min(1, fadeRatio));
            }

            if (idx === 0 && scrollProgress < sceneStart) opacity = 1;
            if (idx === totalScenes - 1 && scrollProgress > sceneEnd) opacity = 1;

            // Forward camera dolly walk-through moving identically across ALL device resolutions
            const scale = 1.0 + localProgress * 0.08;

            return (
              <div
                key={scene.id}
                className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 ease-out"
                style={{
                  opacity,
                  zIndex: idx + 1,
                }}
              >
                <picture className="w-full h-full block">
                  {/* Portrait orientation: Mobile phones and tablets in portrait mode */}
                  <source media="(orientation: portrait), (max-aspect-ratio: 1/1)" srcSet={scene.mobileImage} />
                  {/* Landscape orientation: Desktops, laptops, and tablets in landscape mode */}
                  <source media="(orientation: landscape)" srcSet={scene.image} />
                  <img
                    src={scene.image}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter contrast-[1.05] saturate-[1.06] tour-scene-img"
                    style={{
                      objectPosition: 'center center',
                      transform: `scale(${scale})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Global responsive styling ensuring perfect centering and hardware acceleration */}
        <style>{`
          .tour-scene-img {
            object-position: center center !important;
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        `}</style>

        {/* Ambient Contrast Vignette for Uniform Readability */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/80 pointer-events-none z-10" />

        {/* Top spacer to ensure clear spacing below floating pill navbar */}
        <div className="relative z-20 pt-16 sm:pt-20 pointer-events-none" />

        {/* Center Main Overlay — Centered Headline (MAKE NOISE. MAKE MAGIC. MAKE HISTORY.) */}
        <main className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-3.5 sm:px-6 max-w-5xl mx-auto pointer-events-none w-full">
          {/* Opening Centered Slogan */}
          {introOpacity > 0.01 && (
            <div
              className="space-y-4 sm:space-y-6 transition-opacity duration-300 pointer-events-auto flex flex-col items-center justify-center text-center px-2 w-full max-w-full"
              style={{
                opacity: introOpacity,
                transform: `scale(${1 - (1 - introOpacity) * 0.08})`,
              }}
            >
              {/* Studio badge: 'SONICVAULT STUDIOS · LAGOS' */}
              <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#4E85BF]/40 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC] drop-shadow-md">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#4E85BF] shrink-0" />
                <span>SONICVAULT STUDIOS · LAGOS</span>
              </div>

              {/* Centered Headline: MAKE NOISE. MAKE MAGIC. MAKE HISTORY. */}
              <div className="space-y-1 sm:space-y-2 text-center w-full">
                <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-display uppercase leading-[1.05] drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]">
                  <span className="block text-white">MAKE NOISE.</span>
                  <span className="block text-white/95">MAKE MAGIC.</span>
                  <span className="block accent-gradient-text">MAKE HISTORY.</span>
                </h1>
              </div>

              <div className="space-y-1 text-center">
                <p className="text-xs sm:text-base md:text-xl font-medium tracking-wide text-slate-200 font-display drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
                  WHERE SOUND BECOMES ART.
                </p>
                <p className="text-[11px] sm:text-xs font-mono tracking-widest text-[#89AACC] uppercase">
                  YOUR SOUND. YOUR WORLD. YOUR LEGACY.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
                }}
                className="pt-2 sm:pt-4 flex flex-col items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono text-slate-300 tracking-wider animate-bounce drop-shadow cursor-pointer pointer-events-auto hover:text-white transition-colors"
                aria-label="Scroll to enter the studio"
              >
                <span>SCROLL TO ENTER THE STUDIO ↓</span>
              </button>
            </div>
          )}


          {/* Closing Grand Reveal CTA (Only appears at the very end of the tour, scrollProgress >= 0.92) */}
          {scrollProgress >= 0.92 && (
            <div className="space-y-3.5 sm:space-y-6 w-full max-w-sm sm:max-w-xl mx-auto bg-black/90 backdrop-blur-md p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/20 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.85)] animate-fade-in text-center">
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-sky-400">
                SONIC VAULT STUDIOS.
              </div>
              <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-white font-display uppercase tracking-tight leading-tight">
                YOUR NEXT GREAT RECORD STARTS HERE.
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                From the first vocal take to the final master, step into a creative space built to bring your sound to life.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
                <button
                  onClick={onExploreSpaces}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/20 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Explore The Studio
                </button>
                <button
                  onClick={() => onOpenBooking()}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] cursor-pointer"
                >
                  Book A Session
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Clean bottom anchor */}
        <div className="relative z-20 pb-2 sm:pb-4 pointer-events-none" />
      </div>
    </div>
  );
}
