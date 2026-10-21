import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import { SonicVaultVectorMark } from '../common/BrandLogo';

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
  objectPosition?: string;
}

// 5 Master Studio Environments with Architectural Visual Continuity
const TOUR_SCENES: TourScene[] = [
  {
    id: 'studio-entrance',
    title: 'ARCHITECTURAL ENTRANCE',
    image: entranceImg,
    mobileImage: entranceMobileImg,
    soundIndex: 0,
    objectPosition: 'center center',
  },
  {
    id: 'vocal-booth',
    title: 'THE VAULT VOCAL BOOTH',
    image: vocalBoothImg,
    mobileImage: vocalBoothMobileImg,
    soundIndex: 1,
    objectPosition: 'center 40%',
  },
  {
    id: 'control-room-live',
    title: 'MASTER CONTROL ROOM & LIVE STAGE',
    image: controlRoomImg,
    mobileImage: controlRoomMobileImg,
    soundIndex: 2,
    objectPosition: 'center center',
  },
  {
    id: 'production-lab',
    title: 'MODULAR PRODUCTION LAB',
    image: productionLabImg,
    mobileImage: productionLabMobileImg,
    soundIndex: 3,
    objectPosition: 'center center',
  },
  {
    id: 'master-suite',
    title: 'ANALOG MASTERING SUITE',
    image: masterSuiteImg,
    mobileImage: masterSuiteMobileImg,
    soundIndex: 4,
    objectPosition: 'center center',
  },
];

export default function CinematicHero({ onOpenBooking }: CinematicHeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Silky smooth scroll synchronization with inertia dampening & requestAnimationFrame
  useEffect(() => {
    let isRunning = true;

    const updateScrollMetrics = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const totalScrollHeight = container.scrollHeight - viewportH;
      if (totalScrollHeight <= 0) return;

      const currentScroll = Math.max(0, -rect.top);
      const rawProgress = Math.min(1, Math.max(0, currentScroll / totalScrollHeight));
      targetProgressRef.current = rawProgress;
    };

    const animateLoop = () => {
      if (!isRunning) return;

      // Inertial smoothing for silky continuous transitions across all input devices
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0002) {
        currentProgressRef.current += diff * 0.18;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      setScrollProgress(currentProgressRef.current);

      // Determine active scene and trigger room stems
      const totalScenes = TOUR_SCENES.length;
      const continuousScene = currentProgressRef.current * (totalScenes - 1);
      const sceneIndex = Math.min(totalScenes - 1, Math.max(0, Math.round(continuousScene)));

      if (sceneIndex !== activeSceneRef.current) {
        activeSceneRef.current = sceneIndex;
        setActiveSceneIndex(sceneIndex);
        audioEngine.triggerRoomAudio(sceneIndex);
      }

      rafRef.current = requestAnimationFrame(animateLoop);
    };

    const onScrollOrResize = () => {
      updateScrollMetrics();
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    
    // Initial compute and launch animation loop
    updateScrollMetrics();
    currentProgressRef.current = targetProgressRef.current;
    rafRef.current = requestAnimationFrame(animateLoop);

    return () => {
      isRunning = false;
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        window.scrollBy({ top: window.innerHeight * 0.5, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        window.scrollBy({ top: -window.innerHeight * 0.5, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Jump to specific tour scene on indicator click
  const scrollToScene = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScenes = TOUR_SCENES.length;
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const totalScrollHeight = container.scrollHeight - viewportH;
    const targetScroll = (index / (totalScenes - 1)) * totalScrollHeight;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: containerTop + targetScroll,
      behavior: 'smooth',
    });
  };

  const totalScenes = TOUR_SCENES.length;
  // continuousProgress from 0 to (totalScenes - 1)
  const continuousProgress = scrollProgress * (totalScenes - 1);
  const activeBaseIdx = Math.min(totalScenes - 2, Math.floor(continuousProgress));
  const nextBaseIdx = activeBaseIdx + 1;
  const crossfadeBlend = Math.max(0, Math.min(1, continuousProgress - activeBaseIdx));

  // Opening headline: Starts at opacity 1, glides up smoothly and fades out by progress 0.18
  const introFactor = Math.max(0, Math.min(1, scrollProgress / 0.16));
  const introOpacity = 1 - introFactor;
  const introTranslateY = -introFactor * 40;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280vh] bg-[#040609]"
      id="tour"
    >
      {/* Sticky Fullscreen Hero Viewport */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none">
        
        {/* Full-bleed Studio Canvas Layer Stack — Seamless Hardware Accelerated Dissolve */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {TOUR_SCENES.map((scene, idx) => {
            // Mathematical seamless cross-fade:
            // The active underlying scene stays solid, and the incoming scene dissolves over it
            let opacity = 0;
            if (idx < activeBaseIdx) {
              opacity = 0;
            } else if (idx === activeBaseIdx) {
              opacity = 1;
            } else if (idx === nextBaseIdx) {
              opacity = crossfadeBlend;
            } else {
              opacity = 0;
            }

            // Subtle continuous camera push (4% dolly zoom)
            const localOffset = continuousProgress - idx;
            const scale = 1.0 + Math.max(0, Math.min(1, localOffset + 1)) * 0.04;

            return (
              <div
                key={scene.id}
                className="absolute inset-0 w-full h-full pointer-events-none transform-gpu"
                style={{
                  opacity,
                  zIndex: idx + 1,
                  willChange: 'opacity, transform',
                }}
              >
                <picture className="w-full h-full block">
                  {/* Portrait orientation for mobile */}
                  <source
                    media="(orientation: portrait), (max-aspect-ratio: 1/1)"
                    srcSet={scene.mobileImage}
                  />
                  {/* Landscape orientation for desktop & tablets */}
                  <source
                    media="(orientation: landscape)"
                    srcSet={scene.image}
                  />
                  <img
                    src={scene.image}
                    alt={scene.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter contrast-[1.04] saturate-[1.05]"
                    style={{
                      objectPosition: scene.objectPosition || 'center center',
                      transform: `scale(${scale})`,
                      transformOrigin: 'center center',
                    }}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Ambient Contrast Vignette for Uniform Readability */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/85 pointer-events-none z-10" />

        {/* Seamless bottom fade that cleanly bridges into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#05070c] via-[#05070c]/70 to-transparent pointer-events-none z-20" />

        {/* Top spacer below floating pill navbar */}
        <div className="relative z-20 pt-20 sm:pt-24 md:pt-28 pointer-events-none" />

        {/* Center Main Overlay — Centered Headline (MAKE MAGIC. MAKE HISTORY.) */}
        <main className="relative z-20 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 max-w-5xl mx-auto pointer-events-none w-full">
          {introOpacity > 0.01 && (
            <div
              className="space-y-4 sm:space-y-6 pointer-events-auto flex flex-col items-center justify-center text-center px-2 w-full max-w-full"
              style={{
                opacity: introOpacity,
                transform: `translateY(${introTranslateY}px) scale(${0.96 + introOpacity * 0.04})`,
                willChange: 'opacity, transform',
              }}
            >
              {/* Studio badge: 'SONICVAULT STUDIOS · LAGOS' */}
              <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/40 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                <SonicVaultVectorMark size={16} />
                <span>SONICVAULT STUDIOS · LAGOS</span>
              </div>

              {/* Centered Headline: MAKE MAGIC. MAKE HISTORY. */}
              <div className="space-y-2 sm:space-y-3 text-center w-full">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white font-display uppercase leading-[1.06] drop-shadow-[0_4px_35px_rgba(0,0,0,0.95)]">
                  <span className="block text-white">MAKE MAGIC.</span>
                  <span className="block accent-gradient-text">MAKE HISTORY.</span>
                </h1>
              </div>

              <div className="space-y-1 text-center max-w-xl mx-auto">
                <p className="text-xs sm:text-base md:text-xl font-medium tracking-wide text-slate-200 font-display drop-shadow-[0_2px_15px_rgba(0,0,0,0.95)]">
                  WHERE SOUND BECOMES ART.
                </p>
                <p className="text-[10px] sm:text-xs font-mono tracking-widest text-[#89AACC] uppercase">
                  YOUR SOUND. YOUR WORLD. YOUR LEGACY.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' });
                }}
                className="pt-2 sm:pt-4 flex flex-col items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono text-slate-300 tracking-wider animate-bounce drop-shadow cursor-pointer pointer-events-auto hover:text-white transition-colors"
                aria-label="Scroll to explore studio facilities"
              >
                <span>SCROLL TO ENTER THE STUDIO ↓</span>
              </button>
            </div>
          )}
        </main>

        {/* Cinematic Studio Tour HUD — Silky Smooth Interactive Room Tracker */}
        <div className="relative z-30 pb-6 sm:pb-8 flex justify-center pointer-events-auto">
          <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.85)] flex items-center gap-2.5 sm:gap-4 max-w-[94vw]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-white whitespace-nowrap">
              <span className="text-cyan-300 font-semibold">{`0${activeSceneIndex + 1}`}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">{`0${totalScenes}`}</span>
              <span className="text-white/30 hidden sm:inline">·</span>
              <span className="tracking-wider uppercase truncate font-medium text-slate-200">
                {TOUR_SCENES[activeSceneIndex]?.title}
              </span>
            </div>

            {/* Interactive Room Progress Dots */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-white/20 shrink-0">
              {TOUR_SCENES.map((scene, sIdx) => {
                const isActive = sIdx === activeSceneIndex;
                return (
                  <button
                    key={scene.id}
                    onClick={() => scrollToScene(sIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-400 w-5 shadow-[0_0_10px_rgba(0,240,255,0.7)]'
                        : 'bg-white/30 hover:bg-white/60 w-2'
                    }`}
                    title={`Go to ${scene.title}`}
                    aria-label={`Go to ${scene.title}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
