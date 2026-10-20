import { Shield, Activity, Waves, Gauge, Zap, Wind } from 'lucide-react';

export default function AcousticalEngineering() {
  const specs = [
    {
      icon: Shield,
      title: 'Decoupled Floating Slabs',
      value: '-85 dB Isolation',
      desc: 'Box-in-a-box structural architecture isolated on high-deflection elastomeric springs. Heavy subway and street noise completely attenuated.',
    },
    {
      icon: Waves,
      title: 'Tuned Membrane Bass Trapping',
      value: 'Flat down to 18 Hz',
      desc: 'Precision Helmholtz resonators and custom damped limp-mass membrane absorbers eliminate modal low-frequency standing waves.',
    },
    {
      icon: Activity,
      title: 'Quadratic Residue Diffusers',
      value: 'Prime 7 & 13 QRD',
      desc: 'Solid American black walnut diffusion wells scattered across live rooms maintain acoustic energy without flutter echo or comb filtering.',
    },
    {
      icon: Wind,
      title: 'Silent Displacement HVAC',
      value: 'NC-15 Certified',
      desc: 'Low-velocity oversized duct silencers and active laminar airflow ensure continuous studio cooling with zero audible background hum.',
    },
    {
      icon: Zap,
      title: 'Isolated Balanced Power',
      value: 'Equi=Tech 10kVA',
      desc: 'Symmetrical balanced AC power distribution with dedicated audiophile grounding rods eliminates ground loop 60Hz hum entirely.',
    },
    {
      icon: Gauge,
      title: 'Dolby Atmos 9.1.4 Certified',
      value: 'AES/EBU Spatial Matrix',
      desc: 'Time-aligned and frequency-calibrated spatial audio suite using Trinnov D-MON acoustic optimization and Avid MTRX II routing.',
    },
  ];

  return (
    <section id="acoustics" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#060910] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-2 sm:space-y-3">
            <div className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-sky-400">
              ACOUSTIC ARCHITECTURE
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
              Scientific Precision. Musical Soul.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
            Our facilities were conceived by world-renowned acoustic architects to deliver an honest listening environment where mixing decisions translate seamlessly to any playback medium on earth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {specs.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 hover:border-sky-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-mono text-sky-400 block uppercase tracking-wider">{spec.value}</span>
                  <h4 className="text-xl font-bold text-white font-display">{spec.title}</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {spec.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
