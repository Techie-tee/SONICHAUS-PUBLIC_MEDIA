import { useState } from 'react';
import { Sparkles, CheckCircle, Sliders, Mic, Disc, AudioWaveform, Headphones, Layers } from 'lucide-react';

interface GearItem {
  name: string;
  maker: string;
  category: 'mics' | 'preamps' | 'monitoring' | 'headphones' | 'mixing' | 'instruments' | 'acoustics' | 'software';
  year: string;
  notes: string;
}

const GEAR_DATA: GearItem[] = [
  // Microphones
  { name: 'U87 Vintage 1974', maker: 'Neumann', category: 'mics', year: 'Vintage German', notes: 'Original German vintage capsule with battery-compartment revision. Pristine vocal transparency and intimacy.' },
  { name: 'ELA M 251 E Tube', maker: 'Telefunken', category: 'mics', year: 'Vintage Tube', notes: 'Historic GE 6072a vacuum tube, smooth silky top-end response for flagship lead vocals.' },
  { name: '4038 Studio Ribbon Pair', maker: 'Coles', category: 'mics', year: 'Matched BBC Pair', notes: 'BBC broadcasting acoustic ribbon design, exceptional warm low-mid body for drum overheads and acoustic instruments.' },
  { name: 'C800G PAC Tube', maker: 'Sony', category: 'mics', year: 'Current Series', notes: 'Internal Peltier thermoelectric cooling system for ultra-low noise floor on modern vocal tracking.' },
  { name: 'R-121 Studio Ribbon', maker: 'Royer', category: 'mics', year: 'Handcrafted USA', notes: 'High SPL tolerance figure-8 ribbon microphone for electric guitar amplifiers, brass, and percussion.' },

  // Audio Interfaces & Preamps
  { name: '1073DPX Dual Mic Pre', maker: 'Neve', category: 'preamps', year: 'Hand-Wired UK', notes: 'Marinair spec input and output transformers with classic 3-band inductors for rich harmonic weight.' },
  { name: '512c Discrete Preamp 8-Pack', maker: 'API', category: 'preamps', year: '2520 Op-Amp', notes: 'Legendary punch, explosive transient attack, and high headroom for drums and percussive tracking.' },
  { name: 'VoxBox Valve Channel Strip', maker: 'Manley Labs', category: 'preamps', year: 'All-Tube USA', notes: 'High-voltage vacuum tube preamp with opto-compressor and passive Pultec-style equalizer.' },
  { name: 'B80 Mothership Converter', maker: 'Burl Audio', category: 'preamps', year: 'Discrete Class A', notes: 'All-discrete transformer-coupled audio conversion for analog punch directly into Pro Tools HDX.' },

  // Studio Monitors
  { name: 'SCM110ASL Pro Tri-Amp', maker: 'ATC Loudspeakers', category: 'monitoring', year: 'Main Midfield', notes: 'Custom 3-inch soft dome midrange driver with zero distortion at 115 dB peak for honest balance.' },
  { name: 'NS-10M Studio Nearfield', maker: 'Yamaha', category: 'monitoring', year: 'Bryston 4B SST', notes: 'The ruthless industry reference standard revealing midrange separation and translation.' },
  { name: 'Genelec 8351B Smart Active', maker: 'Genelec SAM', category: 'monitoring', year: 'Coaxial Matrix', notes: 'Point source acoustically coaxial monitoring calibrated with GLM room acoustic software.' },

  // Headphones
  { name: 'HD 650 Reference', maker: 'Sennheiser', category: 'headphones', year: 'Open-Back', notes: 'Natural acoustic spatial reproduction and fatigue-free critical reference listening for engineers.' },
  { name: 'ATH-M50x Closed-Back Matrix', maker: 'Audio-Technica', category: 'headphones', year: 'Tracking Booths', notes: 'High-isolation closed-back tracking headphones for zero bleed in the vocal and live recording rooms.' },
  { name: 'LCD-X Planar Magnetic', maker: 'Audeze', category: 'headphones', year: 'Planar Transducer', notes: 'Ultra-fast transient response and deep sub-bass linear imaging for micro-editing and mastering.' },

  // Mixing Hardware
  { name: 'SSL 4000 G+ 48-Channel Desk', maker: 'Solid State Logic', category: 'mixing', year: 'Restored UK Desk', notes: 'The defining British analog mixing desk with black-knob 242 EQs and legendary G-Master Bus Compressor.' },
  { name: 'Model 670 Stereo Limiter', maker: 'Fairchild', category: 'mixing', year: 'Variable-Mu Tube', notes: '20 vacuum tubes and 14 transformers. The holy grail of analog master buss warmth and cohesion.' },
  { name: 'LA-2A Leveling Amplifier', maker: 'Teletronix', category: 'mixing', year: 'Original Opto', notes: 'T4 electro-optical attenuator delivering effortless musical vocal leveling without artifacting.' },
  { name: '1176LN Peak Limiter Rev D', maker: 'Universal Audio', category: 'mixing', year: 'Vintage Blackface', notes: 'Ultra-fast 20-microsecond attack time with iconic all-buttons-in overdrive slam.' },
  { name: 'CL 1B Optical Compressor', maker: 'Tube-Tech', category: 'mixing', year: 'Handmade Denmark', notes: 'Velvety tube gain reduction, the international standard for vocal tracking and mix glue.' },
  { name: 'A800 Mk III 2-Inch Tape', maker: 'Studer', category: 'mixing', year: 'Analog Tape Machine', notes: 'Swiss precision transport, calibrated for ATR Master Tape at 15/30 IPS for genuine tape saturation.' },

  // Instruments & Controllers
  { name: 'Model D Concert Grand 9ft', maker: 'Steinway & Sons', category: 'instruments', year: 'Hamburg Built', notes: 'Voiced monthly by master technicians for world-class classical, jazz, and modern pop piano tracking.' },
  { name: 'Broadkaster Custom Drum Kit', maker: 'Gretsch Drums', category: 'instruments', year: '3-Ply Maple/Gum', notes: 'Classic round-badge warm projection with 22" kick, 12"/14"/16" toms, and Dunnett snare.' },
  { name: 'Moog One 16-Voice Synthesizer', maker: 'Moog Music', category: 'instruments', year: 'Flagship Analog', notes: 'Tri-timbral polyphonic analog synthesizer with 3 dual-output analog VCOs per voice.' },
  { name: 'Prophet-10 Analog Poly', maker: 'Sequential', category: 'instruments', year: 'Dave Smith Edition', notes: 'Ten genuine Curtis CEM analog voices with vintage Curtis/Rossum filter selector.' },
  { name: 'MPC Live II Retro Edition', maker: 'Akai Professional', category: 'instruments', year: 'Standalone Grooves', notes: 'High-headroom drum pads loaded with custom Afrobeats, Amapiano, and hip-hop sonic libraries.' },

  // Acoustic Treatment
  { name: 'RPG Diffusor Systems QRD', maker: 'RPG Acoustics', category: 'acoustics', year: 'Quadratic Well', notes: 'Engineered solid American walnut quadratic residue diffusors preventing flutter echoes.' },
  { name: 'Floating Decoupled Shells', maker: 'Kinetics Noise', category: 'acoustics', year: 'NC-15 Certified', notes: 'Spring and elastomer isolated floating concrete floors achieving -85 dB mechanical isolation.' },

  // Production Software & DAWs
  { name: 'Pro Tools Ultimate HDX', maker: 'Avid Technology', category: 'software', year: '64-Channel DSP', notes: 'Sub-millisecond latency tracking engine with 192 kHz 64-channel simultaneous conversion.' },
  { name: 'Logic Pro & Ableton Live Suite', maker: 'Apple & Ableton', category: 'software', year: 'Production Hub', notes: 'Complete studio licenses integrated with UAD-2 DSP accelerators and Soundtoys analog suites.' },
];

export default function GearLocker() {
  const [activeTab, setActiveTab] = useState<'all' | 'mics' | 'preamps' | 'monitoring' | 'headphones' | 'mixing' | 'instruments' | 'acoustics' | 'software'>('all');

  const filteredGear = activeTab === 'all' ? GEAR_DATA : GEAR_DATA.filter((g) => g.category === activeTab);

  const categories = [
    { id: 'all', label: 'All Equipment' },
    { id: 'mics', label: 'Microphones' },
    { id: 'preamps', label: 'Interfaces & Preamps' },
    { id: 'monitoring', label: 'Studio Monitors' },
    { id: 'headphones', label: 'Headphones' },
    { id: 'mixing', label: 'Mixing Hardware' },
    { id: 'instruments', label: 'Instruments & Keys' },
    { id: 'acoustics', label: 'Acoustic Treatment' },
    { id: 'software', label: 'Production Software' },
  ];

  return (
    <section id="equipment" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        {/* Header matching Section 10 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>TOOLS OF THE CRAFT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
              THE RIGHT TOOLS. THE RIGHT FEEL.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            A closer look at the equipment and technology behind the recording process. Every piece of outboard gear, tape machine, and vintage microphone is calibrated and verified.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'accent-gradient text-white font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gear Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGear.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#4E85BF]/40 transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-[#89AACC] font-bold uppercase tracking-wider">{item.maker}</span>
                  <span className="text-slate-500">{item.year}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors font-display">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {item.notes}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase border-t border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Studio Calibrated</span>
                </div>
                <span className="text-slate-600">SONICVAULT LAGOS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
