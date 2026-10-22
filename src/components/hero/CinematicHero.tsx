import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';
import entranceMobileImg from '../../assets/images/mobile/scene_01_entrance_mobile.jpg';
import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import vocalBoothMobileImg from '../../assets/images/mobile/scene_02_vocal_booth_mobile.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import controlRoomMobileImg from '../../assets/images/control_room_mobile_1792483021817.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import productionLabMobileImg from '../../assets/images/production_lab_mobile_1792482735447.jpg';
import masterSuiteImg from '../../assets/images/mastering_suite_collaborating_1792679626184.jpg';
import masterSuiteMobileImg from '../../assets/images/master_suite_mobile_1792482735792.jpg';

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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [prevSceneIndex, setPrevSceneIndex] = useState(0);
  const [autoProgress, setAutoProgress] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isMusicWaveActive, setIsMusicWaveActive] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => audioEngine.getMuted());
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSceneRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const waveTimeoutRef = useRef<number | null>(null);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

  // Transition to a specific scene with audio trigger and musical wave effect
  const goToScene = useCallback((index: number) => {
    setPrevSceneIndex(activeSceneRef.current);
    activeSceneRef.current = index;
    setActiveSceneIndex(index);
    setAutoProgress(0);
    audioEngine.triggerRoomAudio(index);

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

  // Sync audio mute state periodically
  useEffect(() => {
    const checkAudio = () => {
      setIsAudioMuted(audioEngine.getMuted());
    };
    const interval = setInterval(checkAudio, 1000);
    return () => clearInterval(interval);
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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320vh] sm:h-[350vh] lg:h-[380vh] bg-[#040609]"
      id="tour"
    >
      {/* Pinned Cinematic Viewport */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none">
        
        {/* Layer 1: Living Cinematic Scenes Stack with Auto-Transition & Ken Burns Drift */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#040609]">
          {CINEMATIC_SCENES.map((scene, idx) => {
            const isActive = idx === activeSceneIndex;
            const isPrev = idx === prevSceneIndex;
            const isReducedMotion = prefersReducedMotionRef.current;

            // Only mount the active and outgoing scenes to maintain peak 60fps performance
            if (!isActive && !isPrev) {
              return null;
            }

            return (
              <div
                key={scene.id}
                className={`absolute inset-0 w-full h-full pointer-events-none transform-gpu transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{
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
                    className={`w-full h-full object-cover filter contrast-[1.05] brightness-[0.96] saturate-[1.06] transition-transform duration-[5000ms] ease-out ${
                      isActive && !isReducedMotion
                        ? 'scale-[1.045] translate-x-[0.3%]'
                        : 'scale-100 translate-x-0'
                    }`}
                    style={{
                      objectPosition: scene.objectPosition || 'center center',
                      transformOrigin: scene.transformOrigin || 'center 20%',
                    }}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Layer 2: Music Wave Fade-In & Fade-Out Transition Effect (No middle line, purely organic audio wave) */}
        <div
          className={`absolute inset-0 pointer-events-none z-20 flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
            isMusicWaveActive
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }`}
          aria-hidden="true"
        >
          {/* Soft atmospheric radial bloom — no harsh lines */}
          <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent mix-blend-screen pointer-events-none" />

          {/* Organic Audio Waveform & Equalizer Visualizer */}
          <div className="relative w-full max-w-xl px-4 flex flex-col items-center justify-center pointer-events-none">
            {/* Dual Oscillating Audio Sine Wave Paths */}
            <svg
              className="w-full h-12 sm:h-16 overflow-visible drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]"
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
            <div className="flex items-end justify-center gap-1 sm:gap-1.5 h-12 sm:h-14 px-4 py-1 mt-1">
              {MUSIC_WAVE_BARS.map((bar, bIdx) => (
                <div
                  key={bIdx}
                  className={`w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-[#4E85BF] via-[#38bdf8] to-[#00f0ff] shadow-[0_0_8px_rgba(56,189,248,0.7)] origin-bottom transition-all ${
                    isMusicWaveActive ? 'music-wave-bar' : ''
                  }`}
                  style={{
                    height: `${bar.height * 0.35}px`,
                    animationDuration: bar.duration,
                    animationDelay: bar.delay,
                  }}
                />
              ))}
            </div>

            {/* Subtle Chamber Transition Acoustic Pill */}
            <div className="flex items-center gap-2 mt-2 px-3 py-0.5 rounded-full bg-black/60 border border-cyan-400/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,240,255,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-cyan-300 uppercase select-none">
                {CINEMATIC_SCENES[activeSceneIndex]?.roomTag || 'ACOUSTIC RESONANCE'}
              </span>
            </div>
          </div>
        </div>

        {/* Layer 3: Cinematic Atmospheric Vignettes & Contrast Scrims */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/80 pointer-events-none z-10" />

        {/* Minimal soft top gradient that keeps navbar legible without dimming the illuminated SONICVAULT STUDIOS sign */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#040609]/70 via-[#040609]/20 to-transparent pointer-events-none z-10" />

        {/* Seamless bottom fade that cleanly bridges into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#040609] via-[#040609]/80 to-transparent pointer-events-none z-20" />

        {/* Layer 5: Main Headline & Intro Branding — Positioned downward into the balanced space below the entrance logo and doorframe */}
        <main className="relative z-20 flex-1 flex flex-col justify-start items-center text-center px-4 sm:px-6 max-w-4xl mx-auto pointer-events-none w-full pt-[clamp(21.5rem,47vh,28rem)] sm:pt-[clamp(23.5rem,51vh,32rem)] md:pt-[clamp(25.5rem,56vh,36rem)] lg:pt-[clamp(18rem,38.5vh,23rem)] pb-4">
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
          )}
        </main>

        {/* Layer 6: Cinematic Studio Tour HUD (Synchronized Scene Indicator, 5s Auto-Transition Gauge & Controls) */}
        <div
          className="relative z-30 pb-4 sm:pb-6 flex justify-center pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center gap-2 sm:gap-3 max-w-[96vw] transition-all duration-300 hover:border-cyan-500/50">
            {/* Auto Play/Pause Button */}
            <button
              onClick={toggleAutoPlay}
              className="p-1 sm:p-1.5 rounded-full text-white/70 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 shrink-0"
              title={isAutoPlay ? 'Auto-Transition Active (5s) — Click to pause' : 'Auto-Transition Paused — Click to play'}
              aria-label={isAutoPlay ? 'Pause auto transition' : 'Play auto transition'}
            >
              {isAutoPlay ? (
                <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              ) : (
                <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/80" />
              )}
            </button>

            {/* Previous Chamber Chevron */}
            <button
              onClick={handlePrevScene}
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 shrink-0"
              title="Previous studio chamber"
              aria-label="Previous studio chamber"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Active cyan pulse dot */}
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            
            {/* Counter and Room Name with smooth transition */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-white whitespace-nowrap overflow-hidden">
              <span className="text-cyan-300 font-bold tabular-nums">{`0${activeSceneIndex + 1}`}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60 tabular-nums">{`0${CINEMATIC_SCENES.length}`}</span>
              <span className="text-white/30 hidden sm:inline">·</span>
              <span className="tracking-wider uppercase truncate font-medium text-slate-200 max-w-[140px] sm:max-w-[220px] md:max-w-none transition-all duration-300">
                {CINEMATIC_SCENES[activeSceneIndex]?.title}
              </span>
            </div>

            {/* Next Chamber Chevron */}
            <button
              onClick={handleNextScene}
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 shrink-0"
              title="Next studio chamber"
              aria-label="Next studio chamber"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Interactive Room Progress Dots with 5-Second Active Gauge */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-white/20 shrink-0">
              {CINEMATIC_SCENES.map((scene, sIdx) => {
                const isActive = sIdx === activeSceneIndex;
                return (
                  <button
                    key={scene.id}
                    onClick={() => goToScene(sIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 relative overflow-hidden ${
                      isActive
                        ? 'bg-white/20 w-10 sm:w-14 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                        : 'bg-white/30 hover:bg-white/60 w-2 hover:scale-125'
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

            {/* Ambient Sound Toggle Button */}
            <button
              onClick={handleSoundToggle}
              className="hidden sm:flex items-center justify-center p-1 sm:p-1.5 rounded-full text-white/60 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer shrink-0 ml-1"
              title={isAudioMuted ? 'Unmute Ambient Room Audio' : 'Mute Ambient Room Audio'}
              aria-label={isAudioMuted ? 'Unmute studio audio' : 'Mute studio audio'}
            >
              {isAudioMuted ? (
                <VolumeX className="w-3 h-3 text-white/40" />
              ) : (
                <Volume2 className="w-3 h-3 text-cyan-400" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

