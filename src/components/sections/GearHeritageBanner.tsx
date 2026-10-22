import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowUpRight, Sliders, CheckCircle2 } from 'lucide-react';

const FLAGSHIP_GEAR = [
  {
    name: 'Sony C-800G Tube Mic',
    category: 'MICROPHONES',
    room: 'The Vocal Booth',
    role: 'Peltier cooling · Silky modern top end · The definitive Afrobeats & Trap lead vocal mic.',
    image: '/assets/images/sony_c800g_mic_1792661940998.jpg',
  },
  {
    name: 'Neumann U87 Ai Condenser',
    category: 'MICROPHONES',
    room: 'The Vocal Booth',
    role: 'Multi-pattern German condenser · Warm body · Acoustic intimacy and world-class vocal tracking.',
    image: '/assets/images/neumann_u87_mic_1792661940627.jpg',
  },
  {
    name: 'Solid State Logic AWS 948',
    category: 'ANALOG CONSOLES',
    room: 'The Control Room',
    role: '48-channel analog console with SuperAnalogue summing, classic SSL G-Master Bus compressor.',
    image: '/assets/images/ssl_aws948_console_1792661944667.jpg',
  },
  {
    name: 'Neve 1073SPX Discrete Preamp',
    category: 'OUTBOARD & PREAMPS',
    room: 'The Control Room',
    role: 'Original discrete transistor topology with Marinair transformers for unmistakable vintage weight.',
    image: '/assets/images/neve_1073_preamp_1792661944145.jpg',
  },
  {
    name: 'Tube-Tech CL 1B Compressor',
    category: 'OUTBOARD & DYNAMICS',
    room: 'The Control Room',
    role: 'All-tube optical compressor delivering silky dynamic control without transient loss or crunch.',
    image: '/assets/images/tubetech_cl1b_comp_1792661942324.jpg',
  },
  {
    name: 'Genelec 8351B SAM Monitors',
    category: 'MONITORING & CUES',
    room: 'The Control Room',
    role: 'Point-source coaxial acoustic monitors calibrated via GLM network for zero room distortion.',
    image: '/assets/images/genelec_8351b_monitor_1792661945240.jpg',
  },
];

export default function GearHeritageBanner() {
  return (
    <section id="gear-heritage" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-[#06080e] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>THE HARDWARE HERITAGE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
              TOOLS OF THE CRAFT.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              We do not compromise with plugin simulations where analog transformers and pure vacuum tubes make the record.
            </p>
            <Link
              to="/equipment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white transition-all shrink-0 hover:translate-x-1"
            >
              <span>Full Equipment Library</span>
              <ArrowRight className="w-4 h-4 text-[#4E85BF]" />
            </Link>
          </div>
        </div>

        {/* 6 Flagship Hardware Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FLAGSHIP_GEAR.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#090d16] flex flex-col justify-between hover:border-[#4E85BF]/60 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden bg-black/60">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.85] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/40 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono z-10 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#89AACC] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-slate-300">
                    {item.room}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold font-display text-white tracking-tight group-hover:text-[#89AACC] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {item.role}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified On-Site in Lekki
                  </span>
                  <Link
                    to="/equipment"
                    className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                  >
                    <span>View In Locker</span>
                    <ArrowUpRight className="w-3 h-3 text-[#4E85BF]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link Out to Complete Library */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase font-semibold">
              LOOKING FOR A SPECIFIC MIC, SYNTH, OR OUTBOARD RACK?
            </span>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Our full equipment library includes Moog synthesizers, Pultec EQs, Yamaha drums, guitar amps, and Burl converters with technical specs.
            </p>
          </div>
          <Link
            to="/equipment"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4E85BF] hover:bg-[#3d6ca1] text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(78,133,191,0.35)] transition-all shrink-0"
          >
            <span>Explore Complete Equipment Library (25+ Tools)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
