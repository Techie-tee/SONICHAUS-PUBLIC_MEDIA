import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowUpRight, Volume2, ShieldCheck } from 'lucide-react';

import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import liveHallImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/studio_05_master_suite_1792446834087.jpg';

interface StudioChambersPreviewProps {
  onOpenBooking: (room?: string) => void;
}

const CHAMBERS = [
  {
    id: 'control-room',
    name: 'The Analog Control Room',
    role: 'MIXING & MASTER MONITORING',
    dimensions: '38 sq m · Ceiling 3.8m',
    specs: 'SSL AWS 948 Delta · Genelec 8351B · Neve 1073 · Tube-Tech CL 1B',
    description: 'Reflection-Free Zone (RFZ) acoustic design with -80dB physical isolation and pristine linear stereo imaging.',
    image: controlRoomImg,
  },
  {
    id: 'vocal-booth',
    name: 'The Vault Vocal Booth',
    role: 'VOCAL TRACKING & INTIMACY',
    dimensions: '18 sq m · Ceiling 3.2m',
    specs: 'Sony C-800G · Neumann U87 Ai · BAE 1073 · RT60: 0.16s',
    description: 'Floating decouple shell engineered for zero noise floor and upfront, warm, radio-ready lead vocals.',
    image: vocalBoothImg,
  },
  {
    id: 'live-room',
    name: 'Studio A Live Recording Hall',
    role: 'LIVE DRUMS & ENSEMBLE',
    dimensions: '62 sq m · Ceiling 4.2m',
    specs: 'Quadratic Residue Diffusers · Yamaha Maple Custom · Direct Sightline',
    description: 'Expansive acoustic volume with natural decay, ideal for live rhythm sections, horns, and strings.',
    image: liveHallImg,
  },
  {
    id: 'production-lab',
    name: 'Modular Production Lab',
    role: 'BEATMAKING & SYNTHESIS',
    dimensions: '28 sq m · Spatial Nearfield',
    specs: 'Moog Subsequent 37 · Sequential Prophet-10 · Akai MPC Live II',
    description: 'Creative composition sanctuary outfitted with world-class analog synthesizers and instant MIDI matrices.',
    image: productionLabImg,
  },
  {
    id: 'mastering-suite',
    name: 'Analog Mastering Suite',
    role: 'FINAL FINISH & STEREO SPEC',
    dimensions: '24 sq m · Linear Response',
    specs: 'Manley Massive Passive · Studer 2-Inch Tape · Prism Sound ADA-8XR',
    description: 'Surgical true-peak calibration environment ensuring your records translate flawlessly across all DSP platforms.',
    image: masterSuiteImg,
  },
];

export default function StudioChambersPreview({ onOpenBooking }: StudioChambersPreviewProps) {
  return (
    <section id="spaces" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-[#040609] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>5 DECOUPLED CHAMBERS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
              THE ACOUSTIC SPACES.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              Every room is physically decoupled on floating concrete slabs to guarantee -80dB isolation between simultaneous sessions.
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white transition-all shrink-0 hover:translate-x-1"
            >
              <span>Full 3D Tour & Dimensions</span>
              <ArrowRight className="w-4 h-4 text-[#4E85BF]" />
            </Link>
          </div>
        </div>

        {/* 5-Chamber Showcase Cards (Top 2 Flagship + 3 Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAMBERS.map((chamber, i) => (
            <motion.div
              key={chamber.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden border border-white/10 bg-[#090d16] flex flex-col justify-between hover:border-[#4E85BF]/60 transition-all duration-300 ${
                i === 0 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Image Banner */}
              <div className={`relative w-full overflow-hidden bg-black ${i === 0 ? 'h-64 sm:h-80' : 'h-52 sm:h-60'}`}>
                <img
                  src={chamber.image}
                  alt={chamber.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.8] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/30 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono z-10 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#89AACC] uppercase tracking-wider">
                    {chamber.role}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-slate-300">
                    {chamber.dimensions}
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight group-hover:text-[#89AACC] transition-colors">
                    {chamber.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {chamber.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    <span className="text-[#89AACC] font-semibold">Core Hardware:</span> {chamber.specs}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Link
                      to="/studio"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                    >
                      <span>Room Specs</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#4E85BF]" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onOpenBooking(chamber.name)}
                      className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#4E85BF] text-[11px] font-mono uppercase tracking-wider text-white border border-white/10 hover:border-transparent transition-all cursor-pointer"
                    >
                      Book Chamber
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dedicated Page Link Banner */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase font-semibold">
              WANT TO DIVE DEEPER INTO OUR ARCHITECTURE?
            </span>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Explore 3D models, RT60 acoustic frequency absorption charts, and high-resolution spatial photos on the dedicated studio page.
            </p>
          </div>
          <Link
            to="/studio"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#4E85BF] hover:bg-[#3d6ca1] text-xs font-mono font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(78,133,191,0.35)] transition-all shrink-0"
          >
            <span>Explore The 3D Studio Tour Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
