import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';
import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/mastering_suite_collaborating_1792679626184.jpg';

interface CinematicHeroProps {
  onOpenBooking?: (roomId?: string) => void;
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
    mobileImage: entranceImg,
    soundIndex: 0,
    objectPosition: 'center clamp(50px, 6.5vh, 76px)',
    transformOrigin: 'center top',
    inStart: 0.0,
    inEnd: 0.0,
    outStart: 0.15,
    outEnd: 0.25,
    sweetSpot: 0.04,
    scaleStart: 1.00,
    scaleEnd: 1.02,
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
    mobileImage: vocalBoothImg,
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
    mobileImage: controlRoomImg,
    soundIndex: 2,
    objectPosition: 'center 24%',
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
    mobileImage: productionLabImg,
    soundIndex: 3,
    objectPosition: 'center 16%',
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
    mobileImage: masterSuiteImg,
    soundIndex: 4,
    objectPosition: 'center 32%',
    transformOrigin: '50% 35%',
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

// 28 Symmetrical Musical Frequency Equalizer Bars with harmonic heights and phase-staggered delays
const MUSIC_WAVE_BARS = [
  { height: 20, delay: '0.45s', duration: '0.7s' },
  { height: 32, delay: '0.2s', duration: '0.55s' },
  { height: 48, delay: '0.6s', duration: '0.65s' },
  { height: 64, delay: '0.1s', duration: '0.5s' },
  { height: 82, delay: '0.35s', duration: '0.6s' },
  { height: 104, delay: '0.05s', duration: '0.75s' },
  { height: 122, delay: '0.25s', duration: '0.52s' },
  { height: 100, delay: '0.4s', duration: '0.68s' },
  { height: 118, delay: '0.15s', duration: '0.58s' },
  { height: 135, delay: '0.3s', duration: '0.72s' },
  { height: 148, delay: '0.0s', duration: '0.62s' },
  { height: 125, delay: '0.2s', duration: '0.54s' },
  { height: 95, delay: '0.5s', duration: '0.66s' },
  { height: 65, delay: '0.1s', duration: '0.48s' },
  // Mirrored right half for balanced acoustic symmetry
  { height: 65, delay: '0.1s', duration: '0.48s' },
  { height: 95, delay: '0.5s', duration: '0.66s' },
  { height: 125, delay: '0.2s', duration: '0.54s' },
  { height: 148, delay: '0.0s', duration: '0.62s' },
  { height: 135, delay: '0.3s', duration: '0.72s' },
  { height: 118, delay: '0.15s', duration: '0.58s' },
  { height: 100, delay: '0.4s', duration: '0.68s' },
  { height: 122, delay: '0.25s', duration: '0.52s' },
  { height: 104, delay: '0.05s', duration: '0.75s' },
  { height: 82, delay: '0.35s', duration: '0.6s' },
  { height: 64, delay: '0.1s', duration: '0.5s' },
  { height: 48, delay: '0.6s', duration: '0.65s' },
  { height: 32, delay: '0.2s', duration: '0.55s' },
  { height: 20, delay: '0.45s', duration: '0.7s' },
];

const AUTO_TRANSITION_INTERVAL = 5000; // 5 seconds per chamber

export default function CinematicHero({ onOpenBooking, onExploreSpaces }: CinematicHeroProps) {
  const { isDaylight, toggleTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [prevSceneIndex, setPrevSceneIndex] = useState(0);
  const [autoProgress, setAutoProgress] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isMusicWaveActive, setIsMusicWaveActive] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const waveTimeoutRef = useRef<number | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

  // Transition to a specific scene with musical visual wave effect
  const goToScene = useCallback((index: number) => {
    setPrevSceneIndex(activeSceneRef.current);
    activeSceneRef.current = index;
    setActiveSceneIndex(index);
    setAutoProgress(0);

    // Trigger Music Wave Fade-In & Fade-Out effect
    setIsMusicWaveActive(true);
    if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
    waveTimeoutRef.current = window.setTimeout(() => {
      setIsMusicWaveActive(false);
    }, 1800);
  }, []);

  const handleNextScene = useCallback(() => {
    const next = (activeSceneIndex + 1) % CINEMATIC_SCENES.length;
    goToScene(next);
  }, [activeSceneIndex, goToScene]);

  const handlePrevScene = useCallback(() => {
    const prev = (activeSceneIndex - 1 + CINEMATIC_SCENES.length) % CINEMATIC_SCENES.length;
    goToScene(prev);
  }, [activeSceneIndex, goToScene]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlay((prev) => !prev);
  }, []);

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

  // 5-Second Auto-Transition Engine with 60fps smooth progress fill
  useEffect(() => {
    if (!isAutoPlay || isHovered || !isHeroInView) return;

    const tickMs = 50;
    const stepIncrement = (tickMs / AUTO_TRANSITION_INTERVAL) * 100;

    const timer = setInterval(() => {
      setAutoProgress((current) => {
        const next = current + stepIncrement;
        if (next >= 100) {
          const nextIndex = (activeSceneRef.current + 1) % CINEMATIC_SCENES.length;
          goToScene(nextIndex);
          return 0;
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, isHeroInView, goToScene]);

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

      // Pause auto-transition if user scrolled deeply past hero
      setIsHeroInView(rect.bottom > 80 && rect.top < viewportH);
    };

    const animateLoop = () => {
      if (!isRunning) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (prefersReducedMotionRef.current) {
        currentProgressRef.current = targetProgressRef.current;
      } else if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.16;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;
      setScrollProgress(p);

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
      if (waveTimeoutRef.current) {
        clearTimeout(waveTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation support across chambers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextScene();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevScene();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextScene, handlePrevScene, toggleAutoPlay]);

  // Handle scroll to enter next studio section
  const handleScrollToEnter = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    window.scrollTo({
      top: container.offsetTop + viewportH,
      behavior: 'smooth',
    });
  }, []);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320vh] sm:h-[350vh] lg:h-[380vh] bg-[#040609]"
      id="tour"
    >
      {/* Pinned Cinematic Viewport */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none bg-[#040609]">
        
        {/* Layer 1: Living Cinematic Scenes Stack with Full Resolution Auto-Transition */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#040609]">
          {CINEMATIC_SCENES.map((scene, idx) => {
            const isActive = idx === activeSceneIndex;
            const isReducedMotion = prefersReducedMotionRef.current;
            const isEntrance = scene.id === 'studio-entrance';

            return (
              <div
                key={scene.id}
                className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{
                  willChange: 'opacity',
                }}
              >
                <img
                  src={scene.image}
                  alt={scene.title}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover select-none transition-transform duration-[6000ms] ease-out ${
                    isDaylight
                      ? 'contrast-[1.03] brightness-[1.02] saturate-[1.08]'
                      : 'contrast-[1.05] brightness-[0.96] saturate-[1.06]'
                  } ${
                    isActive && !isReducedMotion
                      ? (isEntrance ? 'scale-100 sm:scale-[1.01]' : 'scale-100 sm:scale-[1.035] sm:translate-x-[0.2%]')
                      : 'scale-100 translate-x-0'
                  }`}
                  style={{
                    objectPosition: isEntrance
                      ? 'center clamp(50px, 6.5vh, 76px)'
                      : (scene.objectPosition || 'center center'),
                    transformOrigin: isEntrance
                      ? 'center top'
                      : (scene.transformOrigin || 'center 20%'),
                    imageRendering: 'auto',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Layer 2: Music Wave Fade-In & Fade-Out Transition Effect (Organic audio wave pulse during chamber changes) */}
        <div
          className={`absolute inset-0 pointer-events-none z-15 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
            isMusicWaveActive
              ? 'opacity-85 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }`}
          aria-hidden="true"
        >
          {/* Soft atmospheric radial bloom */}
          <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent mix-blend-screen pointer-events-none" />

          {/* Organic Audio Waveform & Equalizer Visualizer */}
          <div className="relative w-full max-w-md sm:max-w-xl px-4 flex flex-col items-center justify-center pointer-events-none">
            {/* Dual Oscillating Audio Sine Wave Paths */}
            <svg
              className="w-full h-8 sm:h-12 overflow-visible drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]"
              viewBox="0 0 600 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sonicWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                  <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
                  <stop offset="75%" stopColor="#818cf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sonicWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4E85BF" stopOpacity="0" />
                  <stop offset="30%" stopColor="#4E85BF" stopOpacity="0.65" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#4E85BF" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#4E85BF" stopOpacity="0" />
                </linearGradient>
                <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Primary Harmonic Sound Wave Curve */}
              <path
                d="M 0,40 C 75,18 125,62 200,40 C 275,18 325,62 400,40 C 475,18 525,62 600,40"
                stroke="url(#sonicWaveGrad1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#waveGlow)"
                className="wave-oscillate"
                style={{
                  strokeDasharray: '600',
                }}
              />

              {/* Secondary Phase-Shifted Wave Curve */}
              <path
                d="M 0,40 C 60,56 140,24 220,40 C 300,56 380,24 460,40 C 530,52 570,32 600,40"
                stroke="url(#sonicWaveGrad2)"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.65"
              />
            </svg>

            {/* Symmetrical Harmonic Equalizer Frequency Bars */}
            <div className="flex items-end justify-center gap-1 sm:gap-1.5 h-7 sm:h-10 px-4 py-1 mt-0.5">
              {MUSIC_WAVE_BARS.map((bar, bIdx) => (
                <div
                  key={bIdx}
                  className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-[#4E85BF] via-[#38bdf8] to-[#00f0ff] shadow-[0_0_8px_rgba(56,189,248,0.7)] origin-bottom transition-all ${
                    isMusicWaveActive ? 'music-wave-bar' : ''
                  }`}
                  style={{
                    height: `${bar.height * 0.25}px`,
                    animationDuration: bar.duration,
                    animationDelay: bar.delay,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Layer 3: Cinematic Atmospheric Vignettes & Contrast Scrims */}
        <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500 bg-radial from-transparent via-black/25 to-black/80" />

        {/* Minimal soft top gradient that keeps navbar legible without dimming the illuminated SONICVAULT STUDIOS sign */}
        <div className="absolute top-0 inset-x-0 h-20 pointer-events-none z-10 transition-colors duration-500 bg-gradient-to-b from-[#040609]/70 via-[#040609]/20 to-transparent" />

        {/* Layer 4: Cinematic bottom vignette & contrast scrim — Preserves rich console & room details without milky haze */}
        <div className={`absolute bottom-0 inset-x-0 h-24 sm:h-28 pointer-events-none z-20 transition-colors duration-500 ${
          isDaylight
            ? 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'
            : 'bg-gradient-to-t from-[#040609]/90 via-[#040609]/40 to-transparent'
        }`} />
        <div className={`absolute bottom-0 inset-x-0 h-[1px] pointer-events-none z-30 transition-colors duration-500 ${
          isDaylight ? 'bg-white/20' : 'bg-white/10'
        }`} />

        {/* Layer 5: Main Headline & Intro Branding — Responsive vertical positioning ensuring every element is visible on mobile and desktop */}
        <main className={`relative z-20 flex-1 flex flex-col justify-start items-center text-center px-3 sm:px-6 max-w-4xl mx-auto pointer-events-none w-full transition-all duration-500 pb-2 sm:pb-4 ${
          activeSceneIndex === 0
            ? 'pt-[clamp(8rem,20vh,11.5rem)] sm:pt-[clamp(18rem,36vh,24rem)] lg:pt-[clamp(18rem,38.5vh,23rem)]'
            : 'pt-[clamp(5.5rem,14vh,8rem)] sm:pt-[clamp(13rem,26vh,17rem)] lg:pt-[clamp(15rem,30vh,19rem)]'
        }`}>
          {headlineOpacity > 0.01 && (
            activeSceneIndex === 0 ? (
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
                      onClick={handleScrollToEnter}
                      className="inline-flex items-center justify-center gap-1 text-[7px] sm:text-[8px] md:text-[8.5px] font-mono text-slate-300 hover:text-cyan-300 tracking-wider cursor-pointer pointer-events-auto transition-colors leading-none group"
                      aria-label="Scroll to enter the studio tour"
                    >
                      <span className="group-hover:text-cyan-300 transition-colors">SCROLL TO ENTER</span>
                      <span className="text-cyan-400 group-hover:translate-y-0.5 transition-transform animate-pulse font-bold">↓</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={activeSceneIndex}
                className="space-y-1.5 min-[360px]:space-y-2 pointer-events-auto flex flex-col items-center justify-center text-center px-2 min-[360px]:px-4 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500"
                style={{
                  opacity: headlineOpacity,
                  transform: `translate3d(0, ${headlineTranslateY}px, 0) scale(${headlineScale})`,
                  willChange: 'opacity, transform',
                }}
              >
                {/* Chamber Kicker Badge */}
                <div className="inline-flex items-center gap-1.5 min-[360px]:gap-2 px-2.5 min-[360px]:px-3 py-0.5 min-[360px]:py-1 rounded-full bg-black/60 border border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="text-[8px] min-[360px]:text-[9px] sm:text-[10px] font-mono tracking-[0.2em] min-[360px]:tracking-[0.22em] text-cyan-300 uppercase select-none truncate max-w-[270px] min-[380px]:max-w-none">
                    CHAMBER 0{activeSceneIndex + 1} OF 05 · {CINEMATIC_SCENES[activeSceneIndex]?.roomTag}
                  </span>
                </div>

                {/* Chamber Title */}
                <h2 className="text-base min-[360px]:text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white font-display uppercase leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] max-w-xl">
                  {CINEMATIC_SCENES[activeSceneIndex]?.title}
                </h2>

                {/* Chamber Subtitle / Acoustic Identity */}
                <p className="text-[11px] min-[360px]:text-xs sm:text-sm font-medium tracking-wide text-slate-200 font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)] max-w-md px-2">
                  {CINEMATIC_SCENES[activeSceneIndex]?.subtitle}
                </p>

                {/* Chamber Quick CTAs */}
                <div className="pt-1 flex items-center justify-center gap-2 sm:gap-2.5">
                  <button
                    type="button"
                    onClick={() => onExploreSpaces?.()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold tracking-wider text-white bg-black/60 hover:bg-black/85 border border-white/20 hover:border-cyan-400/60 backdrop-blur-md transition-all shadow-md group cursor-pointer active:scale-95"
                  >
                    <span>EXPLORE CHAMBERS</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenBooking?.(CINEMATIC_SCENES[activeSceneIndex]?.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider text-white bg-gradient-to-r from-[#2563EB] to-[#0284C7] hover:from-[#1D4ED8] hover:to-[#0369A1] shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-all cursor-pointer active:scale-95"
                  >
                    <span>RESERVE SESSION</span>
                  </button>
                </div>
              </div>
            )
          )}
        </main>

        {/* Layer 6: Cinematic Studio Tour HUD (Synchronized Scene Indicator, 5s Auto-Transition Gauge & Controls) */}
        <div
          className="relative z-30 pb-14 min-[380px]:pb-16 sm:pb-6 px-2 flex justify-center pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`px-2.5 min-[360px]:px-3 sm:px-4 py-1.5 min-[360px]:py-2 sm:py-2.5 rounded-full backdrop-blur-2xl border transition-all duration-300 flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-3 max-w-[96vw] ${
            isDaylight
              ? 'bg-white/95 border-slate-200/90 text-slate-900 shadow-[0_16px_40px_rgba(0,0,0,0.2)] hover:border-[#4E85BF]'
              : 'bg-black/85 border-white/20 text-white shadow-[0_16px_40px_rgba(0,0,0,0.85)] hover:border-cyan-500/50'
          }`}>
            {/* Auto Play/Pause Button */}
            <button
              onClick={toggleAutoPlay}
              className={`p-1 sm:p-1.5 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 shrink-0 ${
                isDaylight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-white/70 hover:text-cyan-300 hover:bg-white/10'
              }`}
              title={isAutoPlay ? 'Auto-Transition Active (5s) — Click to pause' : 'Auto-Transition Paused — Click to play'}
              aria-label={isAutoPlay ? 'Pause auto transition' : 'Play auto transition'}
            >
              {isAutoPlay ? (
                <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              ) : (
                <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isDaylight ? 'text-slate-700' : 'text-white/80'}`} />
              )}
            </button>

            {/* Previous Chamber Chevron */}
            <button
              onClick={handlePrevScene}
              className={`p-1 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 shrink-0 ${
                isDaylight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Previous studio chamber"
              aria-label="Previous studio chamber"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Active cyan pulse dot */}
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            
            {/* Counter and Room Name with smooth transition */}
            <div className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-mono whitespace-nowrap overflow-hidden ${
              isDaylight ? 'text-slate-900' : 'text-white'
            }`}>
              <span className="text-cyan-500 font-bold tabular-nums">{`0${activeSceneIndex + 1}`}</span>
              <span className={isDaylight ? 'text-slate-400' : 'text-white/40'}>/</span>
              <span className={`tabular-nums ${isDaylight ? 'text-slate-600 font-semibold' : 'text-white/60'}`}>{`0${CINEMATIC_SCENES.length}`}</span>
              <span className={`hidden sm:inline ${isDaylight ? 'text-slate-300' : 'text-white/30'}`}>·</span>
              <span className={`tracking-wider uppercase truncate max-w-[80px] min-[360px]:max-w-[110px] min-[400px]:max-w-[160px] sm:max-w-[220px] md:max-w-none transition-all duration-300 ${
                isDaylight ? 'text-slate-900 font-bold' : 'text-slate-100 font-semibold'
              }`}>
                {CINEMATIC_SCENES[activeSceneIndex]?.title}
              </span>
            </div>

            {/* Next Chamber Chevron */}
            <button
              onClick={handleNextScene}
              className={`p-1 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 shrink-0 ${
                isDaylight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title="Next studio chamber"
              aria-label="Next studio chamber"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Interactive Room Progress Dots with 5-Second Active Gauge */}
            <div className={`flex items-center gap-1 min-[360px]:gap-1.5 pl-1.5 min-[360px]:pl-2 sm:pl-3 border-l shrink-0 ${isDaylight ? 'border-slate-300' : 'border-white/20'}`}>
              {CINEMATIC_SCENES.map((scene, sIdx) => {
                const isActive = sIdx === activeSceneIndex;
                return (
                  <button
                    key={scene.id}
                    onClick={() => goToScene(sIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 relative overflow-hidden ${
                      isActive
                        ? isDaylight
                          ? 'bg-slate-200 w-8 sm:w-14 shadow-sm'
                          : 'bg-white/20 w-8 sm:w-14 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                        : isDaylight
                        ? 'bg-slate-300 hover:bg-slate-400 w-1.5 sm:w-2 hover:scale-125'
                        : 'bg-white/30 hover:bg-white/60 w-1.5 sm:w-2 hover:scale-125'
                    }`}
                    title={`Chamber 0${sIdx + 1}: ${scene.title} (Click to view)`}
                    aria-label={`Jump to Chamber 0${sIdx + 1}: ${scene.title}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-y-0 left-0 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.9)]"
                        style={{
                          width: `${isAutoPlay && !isHovered ? autoProgress : 100}%`,
                          transition: 'width 60ms linear',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Atmosphere Mode Toggle Button inside HUD */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center p-1 sm:p-1.5 rounded-full transition-colors cursor-pointer shrink-0 ml-0.5 ${
                isDaylight
                  ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-100/60'
                  : 'text-white/60 hover:text-cyan-300 hover:bg-white/10'
              }`}
              title={isDaylight ? 'Switch to Night Vault Mode' : 'Switch to Daylight Sanctuary Mode'}
              aria-label={isDaylight ? 'Switch to Night Vault' : 'Switch to Daylight Sanctuary'}
            >
              {isDaylight ? (
                <Sun className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-300" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

