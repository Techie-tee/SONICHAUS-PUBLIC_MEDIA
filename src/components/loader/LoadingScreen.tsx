import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const ROTATING_WORDS = ['RECORD.', 'CREATE.', 'EVOLVE.'];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percent, setPercent] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Animate percentage 0 to 100 over ~1.8 seconds
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1800; // 1.8 seconds

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setPercent(progress);

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsExiting(true);
        setTimeout(onComplete, 600);
      }
    };

    const rafId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete]);

  // Cycle rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="sonic-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] bg-[#05070c] text-white flex flex-col justify-between p-6 sm:p-12 select-none pointer-events-auto"
        >
          {/* Top-Left: Studio Label */}
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#4E85BF] animate-ping" />
            <span className="text-xs font-mono tracking-[0.25em] text-slate-400 uppercase">
              SONICVAULT STUDIOS · LAGOS
            </span>
          </div>

          {/* Center: Expressive Rotating Words */}
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="overflow-hidden h-16 sm:h-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -35, filter: 'blur(8px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-editorial text-5xl sm:text-7xl md:text-8xl tracking-tight text-white block"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#89AACC] mt-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              WHERE SOUND BECOMES ART
            </p>
          </div>

          {/* Bottom Row: Percentage Counter & Progress Bar */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between text-xs font-mono text-slate-400">
              <span className="tracking-widest uppercase">INITIALIZING ACOUSTIC ENVIRONMENT</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                {String(percent).padStart(3, '0')}%
              </span>
            </div>

            {/* Thin Signature Blue-Gradient Progress Bar */}
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full accent-gradient transition-all duration-150 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
