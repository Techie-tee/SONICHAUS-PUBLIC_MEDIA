import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, X, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { EquipmentItem } from '../../types';

const CATEGORIES = [
  { id: 'all', name: 'ALL EQUIPMENT' },
  { id: 'microphones', name: 'MICROPHONES' },
  { id: 'outboard_gear', name: 'OUTBOARD & PREAMPS' },
  { id: 'consoles', name: 'CONSOLES & CONTROL' },
  { id: 'monitors_headphones', name: 'MONITORING & CUES' },
  { id: 'instruments', name: 'INSTRUMENTS & SYNTHS' },
];

// Fallback verified equipment list identical to /api/equipment and EquipmentPage.tsx
const INITIAL_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'eq_sony_c800g',
    name: 'C-800G Studio Tube Microphone',
    manufacturer: 'Sony Pro Audio',
    model: 'C-800G PAC',
    category: 'microphones',
    room: 'The Vocal Booth',
    description: 'Legendary high-end tube microphone featuring an external Peltier thermoelectric cooling system. Renowned for silky modern highs and present lead vocals.',
    specs: {
      'Tube Type': '6AU6 vacuum tube',
      'Frequency Response': '20 Hz – 18,000 Hz',
      'Dynamic Range': '113 dB or more',
      'Cooling': 'Peltier cooling system',
    },
    applications: ['Modern Afrobeats lead vocals', 'Hip-Hop and R&B vocal stacks'],
    imageUrl: '/assets/images/sony_c800g_mic_1792661940998.jpg',
    isPublished: true,
  },
  {
    id: 'eq_neumann_u87',
    name: 'U87 Ai Large-Diaphragm Condenser',
    manufacturer: 'Neumann Berlin',
    model: 'U87 Ai',
    category: 'microphones',
    room: 'The Vocal Booth',
    description: 'The global standard for vocal clarity and acoustic intimacy. Dual-diaphragm capsule with omni, cardioid, and figure-8 switchable patterns.',
    specs: {
      'Acoustical Operating Principle': 'Pressure gradient transducer',
      'Directional Patterns': 'Omnidirectional, Cardioid, Figure-8',
      'Equivalent Noise Level': '12 dB-A',
      'Max SPL': '127 dB',
    },
    applications: ['Lead vocals', 'Acoustic guitar tracking', 'Voice-over and narrative dialogue'],
    imageUrl: '/assets/images/neumann_u87_mic_1792661940627.jpg',
    isPublished: true,
  },
  {
    id: 'eq_tubetech_cl1b',
    name: 'CL 1B Optical Tube Compressor',
    manufacturer: 'Tube-Tech',
    model: 'CL 1B',
    category: 'outboard_gear',
    room: 'The Analog Control Room',
    description: 'All-tube optical compressor celebrated for effortless, transparent vocal leveling without transient squashing or harsh coloration.',
    specs: {
      'Circuitry': 'All-tube design (ECC 82 & ECC 83)',
      'Gain Reduction': 'Up to 30 dB',
      'Attack Time': '0.5 to 300 ms',
      'Release Time': '0.05 to 10 sec',
    },
    applications: ['Tracking vocal insert', 'Bass smoothing', 'Lead instrument compression'],
    imageUrl: '/assets/images/tubetech_cl1b_comp_1792661942324.jpg',
    isPublished: true,
  },
  {
    id: 'eq_neve_1073',
    name: '1073SPX Discrete Microphone Preamp & EQ',
    manufacturer: 'Rupert Neve Designs',
    model: '1073SPX',
    category: 'outboard_gear',
    room: 'The Analog Control Room',
    description: 'Handcrafted British Class A discrete circuit with Marinair transformers delivering unmistakable punch, thick low-mids, and musical sheen.',
    specs: {
      'Topology': 'Class A discrete with transformers',
      'Max Gain': '+80 dB',
      'EQ Bands': 'High shelf 12kHz, Mid peak with selectable Q, Low shelf',
    },
    applications: ['Vocal front-end tracking', 'Snare and kick analog tracking', 'Analog master bus warming'],
    imageUrl: '/assets/images/neve_1073_preamp_1792661944145.jpg',
    isPublished: true,
  },
  {
    id: 'eq_ssl_aws948',
    name: 'AWS 948 Delta Hybrid SuperAnalogue Console',
    manufacturer: 'Solid State Logic',
    model: 'AWS 948 Delta',
    category: 'consoles',
    room: 'The Analog Control Room',
    description: '48 inputs of SSL SuperAnalogue summing with dual-channel EQ, G-Series bus compressor, and automated motorized DAW fader integration.',
    specs: {
      'Channels': '48 inputs in 24 fader frame',
      'Summing': 'SuperAnalogue ultra-wide bandwidth',
      'Bus Compression': 'Classic SSL G-Master Bus compressor',
    },
    applications: ['Summing and analog stems', 'Tracking sessions with instant DAW recall', 'Stereo bus gluing'],
    imageUrl: '/assets/images/ssl_aws948_console_1792661944667.jpg',
    isPublished: true,
  },
  {
    id: 'eq_genelec_8351b',
    name: 'The Ones 8351B Coaxial Active Monitors',
    manufacturer: 'Genelec',
    model: '8351B SAM',
    category: 'monitors_headphones',
    room: 'The Analog Control Room',
    description: 'Three-way point-source coaxial monitors featuring Smart Active Monitor DSP room correction for pinpoint stereo imaging and zero phase distortion.',
    specs: {
      'Acoustic Design': 'Coaxial three-way point source',
      'SPL': '118 dB',
      'Frequency Response': '32 Hz – 43,000 Hz (-6dB)',
      'Subwoofer Match': 'Genelec 7380A',
    },
    applications: ['Critical mixing and spatial balance', 'Phase verification across octaves'],
    imageUrl: '/assets/images/genelec_8351b_monitor_1792661945240.jpg',
    isPublished: true,
  },
  {
    id: 'eq_moog_subsequent',
    name: 'Subsequent 37 Paraphonic Analog Synthesizer',
    manufacturer: 'Moog Music',
    model: 'Subsequent 37',
    category: 'instruments',
    room: 'The Production Lab',
    description: 'Two-note paraphonic analog synthesizer with dual oscillators, sub-oscillator, multidrive saturation, and the legendary Moog ladder filter.',
    specs: {
      'Sound Engine': '100% Analog',
      'Polyphony': 'Monophonic or 2-Note Paraphonic',
      'Keys': '37 semi-weighted with velocity and aftertouch',
    },
    applications: ['Sub-bass architecture', 'Analog lead synthesis', 'Sonic soundscapes'],
    imageUrl: '/assets/images/moog_subsequent37_synth_1792661946188.jpg',
    isPublished: true,
  },
  {
    id: 'eq_shure_sm7b',
    name: 'SM7B Dynamic Vocal Microphone',
    manufacturer: 'Shure',
    model: 'SM7B',
    category: 'microphones',
    room: 'The Live Recording Room',
    description: 'Smooth, flat, wide-range frequency response suitable for broadcast speech, rock vocals, podcasts, and brass tracking.',
    specs: {
      'Type': 'Dynamic',
      'Polar Pattern': 'Cardioid',
      'Shielding': 'Electromagnetic hum rejection',
    },
    applications: ['Podcast multi-guest sessions', 'Aggressive vocal performances', 'Snare bottom / guitar cabs'],
    imageUrl: '/assets/images/shure_sm7b_mic_1792661945984.jpg',
    isPublished: true,
  },
];

export default function GearLocker() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<EquipmentItem | null>(null);

  useEffect(() => {
    fetch('/api/equipment')
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data: EquipmentItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setEquipment(data);
        }
      })
      .catch(() => {
        // Fallback already initialized
      });
  }, []);

  const filteredEquipment = useMemo(() => {
    if (selectedCategory === 'all') return equipment;
    return equipment.filter((item) => item.category === selectedCategory);
  }, [equipment, selectedCategory]);

  return (
    <section id="equipment" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>TOOLS OF THE CRAFT · VERIFIED RIGS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
              THE RIGHT TOOLS. THE RIGHT FEEL.
            </h2>
          </div>
          <div className="max-w-md space-y-3">
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              Every microphone, tube compressor, and analog console is calibrated to laboratory standard. 
              Synchronized directly with our Lekki Phase 1 tracking facility inventory.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% CALIBRATED & OPERATIONAL</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'accent-gradient text-white font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gear Grid Synchronized with EquipmentPage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group rounded-2xl bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/70 p-5 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(78,133,191,0.15)] hover:-translate-y-1 cursor-pointer h-full"
            >
              {/* Image Frame */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center p-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#89AACC]">
                  {item.manufacturer}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">
                  {item.room}
                </span>
                <h3 className="font-display text-base font-bold text-white group-hover:text-[#89AACC] transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Footer specs pill & action */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 mt-auto">
                <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
                  VIEW SPECS
                </span>
                <div className="flex items-center gap-1 text-[#89AACC]">
                  <Sliders className="w-3.5 h-3.5" />
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Equipment Library Action */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-slate-400">
            SHOWING VERIFIED INVENTORY FOR LEKKI PHASE 1 FACILITY
          </p>
          <Link
            to="/equipment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white hover:text-sky-300 transition-all cursor-pointer shadow-sm group"
          >
            <span>EXPLORE FULL EQUIPMENT LIBRARY (12+ RIGS)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Detail Specifications Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0a0e16] border border-white/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-40 h-40 shrink-0 bg-black/60 rounded-xl border border-white/10 p-3 flex items-center justify-center">
                <img
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#4E85BF]/20 text-[#89AACC] border border-[#4E85BF]/30">
                  {activeModalItem.category.replace('_', ' ')} · {activeModalItem.room}
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  {activeModalItem.name}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Manufacturer: {activeModalItem.manufacturer} · Model: {activeModalItem.model}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeModalItem.description}
            </p>

            {/* Verified Specs */}
            {activeModalItem.specs && Object.keys(activeModalItem.specs).length > 0 && (
              <div className="space-y-2 bg-[#05080e] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-wider block font-semibold">
                  VERIFIED HARDWARE SPECIFICATIONS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(activeModalItem.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                      <span className="text-slate-500 font-mono text-[11px]">{k}</span>
                      <span className="font-medium text-right text-slate-200">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications */}
            {activeModalItem.applications && activeModalItem.applications.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  PRIMARY RECORDING APPLICATIONS
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeModalItem.applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{app}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                to={`/book-session?gear=${encodeURIComponent(activeModalItem.id)}`}
                className="py-2.5 px-5 rounded-xl accent-gradient text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-md"
              >
                <span>BOOK THIS RIG</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
