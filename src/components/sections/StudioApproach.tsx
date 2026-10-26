import { motion } from 'motion/react';
import { Sparkles, Mic2, Compass, Cpu, Users } from 'lucide-react';

export default function StudioApproach() {
  const pillars = [
    {
      id: 'performance',
      icon: Mic2,
      title: 'The Performance',
      tagline: 'Give every take the attention it deserves.',
      description:
        'Technical specs mean nothing if the artist feels constrained. We craft an unhurried, psychologically supportive recording sanctuary where you can take risks, tap into emotional vulnerability, and execute career-defining vocal and instrumental takes.',
    },
    {
      id: 'process',
      icon: Compass,
      title: 'The Process',
      tagline: 'Move thoughtfully from recording to production and final delivery.',
      description:
        'A great record is built in deliberate stages. Rather than rushing straight to heavy plugins, we ensure track arrangement, harmonic voicing, and clean phase relationships are resolved first. The music breathes because the foundation is solid.',
    },
    {
      id: 'details',
      icon: Cpu,
      title: 'The Details',
      tagline: 'Treat editing, balance, clarity, and finish as essential parts of the creative process.',
      description:
        'Micro-dynamics, surgical resonance control, and authentic analog warmth are not afterthoughts. Every decibel of gain reduction, transformer saturation, and acoustic space is calibrated to translate seamlessly across clubs, car systems, and AirPods.',
    },
    {
      id: 'collaboration',
      icon: Users,
      title: 'The Collaboration',
      tagline: 'Build an environment where artists and creative teams can develop their ideas.',
      description:
        'Located in Lekki Phase 1, our rooms serve as a creative haven for visionaries, executive producers, songwriters, and musicians. Private valet parking, secure lounges, and world-class engineers ensure your energy remains 100% on the art.',
    },
  ];

  return (
    <section id="approach" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>THE SONICVAULT APPROACH</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
              DETAIL IS THE DIFFERENCE.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            We reject rushed mass-production. Every record tracked at SONICVAULT receives obsessive attention to artistic intent, sonic fidelity, and enduring musicality.
          </p>
        </div>

        {/* 4 Pillars Grid with Fine Separators - Balanced padding prevents top grid line choking (first:pt-0 token preserved) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className="py-10 sm:py-12 md:py-10 px-4 sm:px-6 md:px-6 lg:px-8 space-y-6 flex flex-col justify-between items-center text-center"
              >
                <div className="space-y-4 flex flex-col items-center text-center w-full">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#89AACC] shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-2xl font-bold text-white font-display text-center">
                    {pillar.title}
                  </h3>

                  <p className="text-xs font-mono text-[#89AACC] font-medium leading-relaxed text-center max-w-xs">
                    {pillar.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed text-center">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 flex justify-center w-full">
                  <div className="w-10 h-[2px] accent-gradient rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
