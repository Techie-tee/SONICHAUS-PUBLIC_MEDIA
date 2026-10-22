import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, ChevronDown } from 'lucide-react';
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
  onExploreSpaces?: () => void;
}

interface TourSceneConfig {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  roomTag: string;
  image: string;
  mobileImage: string;
  soundIndex: number;
  objectPosition: string;
  transformOrigin: string;
  // Normalized scroll intervals [0, 1]
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
  sweetSpot: number;
  // Camera motion bounds
  scaleStart: number;
  scaleEnd: number;
  panXStart: number;
  panXEnd: number;
  panYStart: number;
  panYEnd: number;
}

// 5 Master Studio Environments with Choreographed Timeline Segments
const CINEMATIC_SCENES: TourSceneConfig[] = [
  {
    id: 'studio-entrance',
    number: '01',
    title: 'THE ARRIVAL',
    subtitle: 'Where great records begin.',
    roomTag: 'Architectural Entrance & Reception',
    image: entranceImg,
    mobileImage: entranceMobileImg,
    soundIndex: 0,
    objectPosition: 'center top',
    transformOrigin: 'center top',
    inStart: 0.0,
    inEnd: 0.0,
    outStart: 0.15,
    outEnd: 0.25,
    sweetSpot: 0.04,
    scaleStart: 1.02,
    scaleEnd: 1.05,
    panXStart: 0,
    panXEnd: 0,
    panYStart: 5.5,
    panYEnd: 5.5,
  },
  {
    id: 'vocal-booth',
    number: '02',
    title: 'THE VAULT VOCAL BOOTH',
    subtitle: 'Every great record begins with a voice.',
    roomTag: 'Floating Acoustic Vault Chamber',
    image: vocalBoothImg,
    mobileImage: vocalBoothMobileImg,
    soundIndex: 1,
    objectPosition: 'center 20%',
    transformOrigin: '52% 24%',
    inStart: 0.15,
    inEnd: 0.25,
    outStart: 0.38,
    outEnd: 0.48,
    sweetSpot: 0.31,
    scaleStart: 1.00,
    scaleEnd: 1.038,
    panXStart: 0,
    panXEnd: 0,
    panYStart: 0,
    panYEnd: 0,
  },
  {
    id: 'control-room-live',
    number: '03',
    title: 'MASTER CONTROL ROOM & LIVE STAGE',
    subtitle: 'Precision in every frequency. Emotion in every mix.',
    roomTag: '48-Channel SSL G+ & Glass Sightline',
    image: controlRoomImg,
    mobileImage: controlRoomMobileImg,
    soundIndex: 2,
    objectPosition: 'center 22%',
    transformOrigin: '50% 25%',
    inStart: 0.38,
    inEnd: 0.48,
    outStart: 0.62,
    outEnd: 0.72,
    sweetSpot: 0.55,
    scaleStart: 1.005,
    scaleEnd: 1.04,
    panXStart: -1.2,
    panXEnd: 1.2,
    panYStart: 0,
    panYEnd: 0,
  },
  {
    id: 'production-lab',
    number: '04',
    title: 'MODULAR PRODUCTION LAB',
    subtitle: 'From a spark of inspiration to a sound of your own.',
    roomTag: 'Analog Synthesis & Beat Production',
    image: productionLabImg,
    mobileImage: productionLabMobileImg,
    soundIndex: 3,
    objectPosition: 'center 12%',
    transformOrigin: '68% 22%',
    inStart: 0.62,
    inEnd: 0.72,
    outStart: 0.84,
    outEnd: 0.94,
    sweetSpot: 0.78,
    scaleStart: 1.00,
    scaleEnd: 1.038,
    panXStart: 0.8,
    panXEnd: -0.8,
    panYStart: 0,
    panYEnd: 0,
  },
  {
    id: 'master-suite',
    number: '05',
    title: 'ANALOG MASTERING SUITE',
    subtitle: 'RECORD. PRODUCE. MIX. MASTER. RELEASE.',
    roomTag: 'Audiophile Monitoring & 2-Inch Tape',
    image: masterSuiteImg,
    mobileImage: masterSuiteMobileImg,
    soundIndex: 4,
    objectPosition: 'center 10%',
    transformOrigin: '55% 22%',
    inStart: 0.84,
    inEnd: 0.94,
    outStart: 1.0,
    outEnd: 1.0,
    sweetSpot: 0.96,
    scaleStart: 1.03,
    scaleEnd: 1.00, // Settling to final rest
    panXStart: 0,
    panXEnd: 0,
    panYStart: 0,
    panYEnd: 0,
  },
];

// Hermite smoothstep interpolation for organic, non-linear cinematic ease
function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export default function CinematicHero({ onOpenBooking, onExploreSpaces }: CinematicHeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(() => audioEngine.getMuted());
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

  // Preload all 5 scenes upfront so there is never a blank frame or pop
  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = CINEMATIC_SCENES.length * 2; // desktop + mobile

    CINEMATIC_SCENES.forEach((scene) => {
      const imgDesktop = new Image();
      imgDesktop.src = scene.image;
      imgDesktop.onload = () => {
        loadedCount++;
        if (loadedCount >= totalAssets) setImagesLoaded(true);
      };
      imgDesktop.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalAssets) setImagesLoaded(true);
      };

      const imgMobile = new Image();
      imgMobile.src = scene.mobileImage;
      imgMobile.onload = () => {
        loadedCount++;
        if (loadedCount >= totalAssets) setImagesLoaded(true);
      };
      imgMobile.onerror = () => {
        loadedCount++;
        if (loadedCount >= totalAssets) setImagesLoaded(true);
      };
    });

    // Safety timeout: ensure imagesLoaded is true after 1s even on slow connections
    const timer = setTimeout(() => setImagesLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Motion preference detection
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mql.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Sync audio mute state periodically
  useEffect(() => {
    const checkAudio = () => {
      setIsAudioMuted(audioEngine.getMuted());
    };
    const interval = setInterval(checkAudio, 1000);
    return () => clearInterval(interval);
  }, []);

  // Master scroll listener with RAF interpolation & dampening
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

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (prefersReducedMotionRef.current) {
        currentProgressRef.current = targetProgressRef.current;
      } else if (Math.abs(diff) > 0.0001) {
        // High-precision smooth follow (0.16) for buttery continuous tracking without input lag
        currentProgressRef.current += diff * 0.16;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setScrollProgress(p);

      // Determine active scene based on sweetest spot proximity and visibility
      let activeIndex = 0;
      let highestOpacity = -1;

      for (let i = 0; i < CINEMATIC_SCENES.length; i++) {
        const sc = CINEMATIC_SCENES[i];
        let op = 0;
        if (p >= sc.inStart && p <= sc.outEnd) {
          if (i === 0) {
            op = p <= sc.outStart ? 1 : 1 - smoothstep(sc.outStart, sc.outEnd, p);
          } else if (i === CINEMATIC_SCENES.length - 1) {
            op = p < sc.inEnd ? smoothstep(sc.inStart, sc.inEnd, p) : 1;
          } else {
            if (p < sc.inEnd) {
              op = smoothstep(sc.inStart, sc.inEnd, p);
            } else if (p <= sc.outStart) {
              op = 1;
            } else {
              op = 1 - smoothstep(sc.outStart, sc.outEnd, p);
            }
          }
        }

        if (op > highestOpacity) {
          highestOpacity = op;
          activeIndex = i;
        }
      }

      if (activeIndex !== activeSceneRef.current) {
        activeSceneRef.current = activeIndex;
        setActiveSceneIndex(activeIndex);
        audioEngine.triggerRoomAudio(activeIndex);
      }

      rafRef.current = requestAnimationFrame(animateLoop);
    };

    const onScrollOrResize = () => {
      updateScrollMetrics();
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

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

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top <= 0) {
          e.preventDefault();
          const nextIdx = Math.min(CINEMATIC_SCENES.length - 1, activeSceneRef.current + 1);
          scrollToScene(nextIdx);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top <= 0) {
          e.preventDefault();
          const prevIdx = Math.max(0, activeSceneRef.current - 1);
          scrollToScene(prevIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Direct scene navigation on indicator click
  const scrollToScene = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const targetScene = CINEMATIC_SCENES[index];
    if (!targetScene) return;

    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const totalScrollHeight = container.scrollHeight - viewportH;
    const targetScroll = targetScene.sweetSpot * totalScrollHeight;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: containerTop + targetScroll,
      behavior: 'smooth',
    });
  }, []);

  const handleSoundToggle = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  // Headline Typography Math:
  // Starts solid at p = 0.00, holds until p = 0.08, then gently glides up and dissolves out by p = 0.18
  const headlineFadeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.08) / 0.10));
  const headlineOpacity = scrollProgress <= 0.08 ? 1 : 1 - smoothstep(0, 1, headlineFadeProgress);
  const headlineTranslateY = prefersReducedMotionRef.current
    ? 0
    : -smoothstep(0, 1, headlineFadeProgress) * 45;
  const headlineScale = prefersReducedMotionRef.current
    ? 1
    : 1 - smoothstep(0, 1, headlineFadeProgress) * 0.04;

  // Transition Wave Energy Bridge Calculation:
  // Detects if we are currently inside any transition zone between scenes
  const transitionInfo = useMemo(() => {
    const p = scrollProgress;
    for (let i = 0; i < CINEMATIC_SCENES.length - 1; i++) {
      const fromScene = CINEMATIC_SCENES[i];
      const toScene = CINEMATIC_SCENES[i + 1];
      const tStart = fromScene.outStart;
      const tEnd = fromScene.outEnd;

      if (p >= tStart && p <= tEnd) {
        const norm = (p - tStart) / (tEnd - tStart);
        // Sine bell curve: 0 at start, 1 at midpoint, 0 at end
        const intensity = Math.sin(norm * Math.PI);
        return {
          isTransitioning: true,
          intensity,
          fromTitle: fromScene.title,
          toTitle: toScene.title,
        };
      }
    }
    return { isTransitioning: false, intensity: 0, fromTitle: '', toTitle: '' };
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420vh] sm:h-[480vh] lg:h-[540vh] bg-[#040609]"
      id="tour"
    >
      {/* Pinned Cinematic Viewport */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none">
        
        {/* Layer 1: Living Cinematic Scenes Stack */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#040609]">
          {CINEMATIC_SCENES.map((scene, idx) => {
            const p = scrollProgress;
            let opacity = 0;
            const isReducedMotion = prefersReducedMotionRef.current;

            // Compute exact smoothstep opacity for scene
            if (idx === 0) {
              if (p <= scene.outStart) {
                opacity = 1;
              } else if (p <= scene.outEnd) {
                opacity = 1 - smoothstep(scene.outStart, scene.outEnd, p);
              } else {
                opacity = 0;
              }
            } else if (idx === CINEMATIC_SCENES.length - 1) {
              if (p < scene.inStart) {
                opacity = 0;
              } else if (p < scene.inEnd) {
                opacity = smoothstep(scene.inStart, scene.inEnd, p);
              } else {
                opacity = 1;
              }
            } else {
              if (p < scene.inStart || p > scene.outEnd) {
                opacity = 0;
              } else if (p < scene.inEnd) {
                opacity = smoothstep(scene.inStart, scene.inEnd, p);
              } else if (p <= scene.outStart) {
                opacity = 1;
              } else {
                opacity = 1 - smoothstep(scene.outStart, scene.outEnd, p);
              }
            }

            // Zero GPU compositor overhead for completely inactive scenes
            if (opacity <= 0.001) {
              return null;
            }

            // Continuous camera push-in and perspective drift
            let localProgress = 0;
            if (scene.outEnd > scene.inStart) {
              localProgress = Math.max(0, Math.min(1, (p - scene.inStart) / (scene.outEnd - scene.inStart)));
            }

            const currentScale = isReducedMotion
              ? 1.0
              : scene.scaleStart + (scene.scaleEnd - scene.scaleStart) * localProgress;
            const currentPanX = isReducedMotion
              ? 0
              : scene.panXStart + (scene.panXEnd - scene.panXStart) * localProgress;
            const currentPanY = isReducedMotion
              ? 0
              : scene.panYStart + (scene.panYEnd - scene.panYStart) * localProgress;

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
                  {/* Portrait orientation for mobile devices */}
                  <source
                    media="(orientation: portrait), (max-aspect-ratio: 1/1)"
                    srcSet={scene.mobileImage}
                  />
                  {/* Landscape orientation for desktop & widescreen displays */}
                  <source
                    media="(orientation: landscape)"
                    srcSet={scene.image}
                  />
                  <img
                    src={scene.image}
                    alt={scene.title}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.96] saturate-[1.06]"
                    style={{
                      objectPosition: scene.objectPosition || 'center center',
                      transform: `scale(${currentScale}) translate3d(${currentPanX}%, ${currentPanY}%, 0)`,
                      transformOrigin: scene.transformOrigin || 'center 20%',
                    }}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Layer 2: Subtle Luminous Audio Frequency Wave Bridge during transitions */}
        {transitionInfo.isTransitioning && transitionInfo.intensity > 0.04 && (
          <div
            className="absolute inset-x-0 bottom-20 sm:bottom-24 z-15 pointer-events-none flex flex-col items-center justify-center transition-opacity duration-300"
            style={{
              opacity: transitionInfo.intensity * 0.85,
            }}
          >
            {/* Luminous audio frequency waveform pulse */}
            <div className="flex items-center gap-1">
              {[8, 16, 26, 14, 32, 20, 36, 18, 28, 12, 22, 10, 6].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.7)]"
                  style={{
                    height: `${Math.round(h * (0.4 + transitionInfo.intensity * 0.6))}px`,
                  }}
                />
              ))}
            </div>
            {/* Cyan frequency line */}
            <div className="mt-1.5 w-48 sm:w-80 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_rgba(0,240,255,0.85)]" />
          </div>
        )}

        {/* Layer 3: Cinematic Atmospheric Vignettes & Contrast Scrims */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/80 pointer-events-none z-10" />

        {/* Minimal soft top gradient that keeps navbar legible without dimming the illuminated SONICVAULT STUDIOS sign */}
        <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#040609]/60 via-[#040609]/20 to-transparent pointer-events-none z-10" />

        {/* Seamless bottom fade that cleanly bridges into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#040609] via-[#040609]/80 to-transparent pointer-events-none z-20" />

        {/* Layer 5: Main Headline & Intro Branding — Positioned downward into the balanced space between the entrance logo and the tip of the entering figure */}
        <main className="relative z-20 flex-1 flex flex-col justify-start items-center text-center px-4 sm:px-6 max-w-3xl mx-auto pointer-events-none w-full pt-[clamp(20rem,43.5vh,26rem)] sm:pt-[clamp(22rem,48vh,30rem)] md:pt-[clamp(24rem,53vh,35rem)] lg:pt-[clamp(15rem,32.5vh,20rem)] pb-4">
          {headlineOpacity > 0.01 && (
            <div
              className="space-y-1.5 sm:space-y-2 pointer-events-auto flex flex-col items-center justify-center text-center px-2 w-full max-w-full"
              style={{
                opacity: headlineOpacity,
                transform: `translate3d(0, ${headlineTranslateY}px, 0) scale(${headlineScale})`,
                willChange: 'opacity, transform',
              }}
            >
              {/* Main Headline: MAKE MAGIC. MAKE HISTORY. */}
              <div className="text-center w-full">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black tracking-tight text-white font-display uppercase leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)]">
                  <span className="text-white">MAKE MAGIC. </span>
                  <span className="accent-gradient-text">MAKE HISTORY.</span>
                </h1>
              </div>

              {/* Subhead and signature tagline */}
              <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-200 font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)]">
                WHERE SOUND BECOMES ART.
              </p>

              {/* Architectural Transom Supporting Unit — Anchored directly in the upper entrance doorway area */}
              <div className="mt-2.5 sm:mt-3 flex flex-col items-center justify-center text-center max-w-full">
                <div className="inline-flex flex-col items-center justify-center text-center gap-[3px] py-0.5 px-2.5 max-w-full">
                  <p className="text-[7.5px] sm:text-[8.5px] md:text-[9.5px] font-mono tracking-[0.22em] text-[#89AACC] uppercase leading-none select-none whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)]">
                    WORLD-CLASS ACOUSTIC SANCTUARY
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToScene(1)}
                    className="inline-flex items-center justify-center gap-1 text-[7px] sm:text-[8px] md:text-[8.5px] font-mono text-slate-300 hover:text-cyan-300 tracking-wider cursor-pointer pointer-events-auto transition-colors leading-none group"
                    aria-label="Scroll to enter the studio tour"
                  >
                    <span className="group-hover:text-cyan-300 transition-colors">SCROLL TO ENTER</span>
                    <span className="text-cyan-400 group-hover:translate-y-0.5 transition-transform animate-pulse font-bold">↓</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Layer 6: Cinematic Studio Tour HUD (Synchronized Scene Indicator & Sound Bar) */}
        <div className="relative z-30 pb-4 sm:pb-5 flex justify-center pointer-events-auto">
          <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center gap-2.5 sm:gap-4 max-w-[94vw] transition-all duration-300">
            {/* Active cyan pulse dot */}
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            
            {/* Counter and Room Name */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-white whitespace-nowrap">
              <span className="text-cyan-300 font-bold tabular-nums">{`0${activeSceneIndex + 1}`}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60 tabular-nums">{`0${CINEMATIC_SCENES.length}`}</span>
              <span className="text-white/30 hidden sm:inline">·</span>
              <span className="tracking-wider uppercase truncate font-medium text-slate-200 max-w-[160px] sm:max-w-[260px] md:max-w-none">
                {CINEMATIC_SCENES[activeSceneIndex]?.title}
              </span>
            </div>

            {/* Interactive Room Progress Dots with Smooth Sweet-Spot Jumps */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-white/20 shrink-0">
              {CINEMATIC_SCENES.map((scene, sIdx) => {
                const isActive = sIdx === activeSceneIndex;
                return (
                  <button
                    key={scene.id}
                    onClick={() => scrollToScene(sIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isActive
                        ? 'bg-cyan-400 w-5 sm:w-6 shadow-[0_0_12px_rgba(0,240,255,0.8)]'
                        : 'bg-white/30 hover:bg-white/60 w-2'
                    }`}
                    title={`Tour Scene 0${sIdx + 1}: ${scene.title}`}
                    aria-label={`Jump to Scene 0${sIdx + 1}: ${scene.title}`}
                    aria-current={isActive ? 'step' : undefined}
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
