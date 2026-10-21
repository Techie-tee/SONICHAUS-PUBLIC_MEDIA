import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, Mic, Activity, Disc } from 'lucide-react';

export default function SonicPhilosophy() {
  const shouldReduceMotion = useReducedMotion();
  const principles = [
    {
      icon: Mic,
      number: '01',
      title: 'Capture the moment.',
      description:
        'Honoring raw emotional truth and unrepeatable spontaneous takes before technical overthinking interferes.',
    },
    {
      icon: Activity,
      number: '02',
      title: 'Shape the emotion.',
      description:
        'Sculpting analog tone, harmonic saturation, dynamic impact, and architectural acoustic space to support the artist’s narrative.',
    },
    {
      icon: Disc,
      number: '03',
      title: 'Perfect the details.',
      description:
        'Surgical frequency calibration, phase alignment, and master bus cohesion so your sound translates impeccably everywhere.',
    },
  ];

  return (
    <section id="philosophy" className="relative py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#05070c] overflow-hidden border-t border-white/10">
      {/* Background Subtle Waveform & Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#4E85BF] rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-16 sm:space-y-24">
        {/* Animated Sonic Waveform Line (The Sonic Line Motif) */}
        <div className="w-full flex items-center justify-center gap-1.5 py-4 overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => {
            const height = 8 + Math.sin(i * 0.28) * 24 + Math.cos(i * 0.15) * 12;
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0.3 }}
                animate={shouldReduceMotion ? { scaleY: 0.7 } : undefined}
                whileInView={shouldReduceMotion ? undefined : { scaleY: [0.3, 1, 0.4] }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 2.2,
                        delay: (i % 8) * 0.15,
                        ease: 'easeInOut',
                      }
                }
                style={{ height: `${Math.max(6, height)}px` }}
                className="w-[2px] rounded-full bg-gradient-to-t from-slate-800 via-[#4E85BF] to-[#89AACC] opacity-80"
              />
            );
          })}
        </div>

        {/* Section Header */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
            <Sparkles className="w-3 h-3 text-[#4E85BF]" />
            <span>BEYOND THE SOUND</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.12]">
            GREAT RECORDS BEGIN WITH <br className="hidden sm:inline" />
            <span className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal underline decoration-[#4E85BF]/40 decoration-1 underline-offset-8">
              a feeling.
            </span>
          </h2>

          <p className="text-sm sm:text-lg text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Every performance has a story. Every arrangement has a purpose. Every detail contributes to the final sound.
          </p>
        </div>

        {/* 3 Creative Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-6">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#4E85BF]/40 transition-all duration-300 space-y-5 group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#89AACC] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 font-bold tracking-widest">
                    {principle.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                    {principle.description}
                  </p>
                </div>

                <div className="w-12 h-[2px] bg-white/10 group-hover:w-full group-hover:accent-gradient transition-all duration-500 rounded-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
