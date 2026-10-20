import { useState } from 'react';
import { Mic, Radio, Sliders, Volume2, Music, CheckCircle } from 'lucide-react';

interface GearItem {
  name: string;
  maker: string;
  category: 'mics' | 'preamps' | 'outboard' | 'monitoring' | 'instruments';
  year: string;
  notes: string;
}

const GEAR_DATA: GearItem[] = [
  // Microphones
  { name: 'U87 Vintage', maker: 'Neumann', category: 'mics', year: '1974', notes: 'Original German vintage capsule with battery-compartment revision. Pristine vocal transparency.' },
  { name: 'ELA M 251 E', maker: 'Telefunken', category: 'mics', year: 'Vintage Reissue', notes: 'Historic GE 6072a vacuum tube, smooth silky top-end response for lead vocals.' },
  { name: '4038 Studio Ribbon Pair', maker: 'Coles', category: 'mics', year: 'Matched Pair', notes: 'BBC broadcasting acoustic ribbon design, exceptional low-mid body for drum overheads and brass.' },
  { name: 'C800G Pac', maker: 'Sony', category: 'mics', year: 'Current Series', notes: 'Internal Peltier thermoelectric cooling system for ultra-low noise floor on modern modern pop/rap.' },
  { name: 'R-121 Studio Ribbon', maker: 'Royer', category: 'mics', year: '2022', notes: 'High SPL tolerance figure-8 ribbon microphone for electric guitar cabs and acoustic strings.' },

  // Preamps & Consoles
  { name: 'SSL 4000 G+ 48-Channel', maker: 'Solid State Logic', category: 'preamps', year: 'Custom Restored', notes: 'The defining British rock and pop analog desk with black-knob 242 EQs and Master Bus Compressor.' },
  { name: '1073DPX Dual Mic Pre', maker: 'Neve', category: 'preamps', year: 'Hand-Wired UK', notes: 'Marinair spec input and output transformers with classic 3-band inductors.' },
  { name: '512c Discrete Preamp 8-Pack', maker: 'API', category: 'preamps', year: '2520 Op-Amp', notes: 'Legendary punch, explosive transient attack, and high headroom for drums and percussive takes.' },
  { name: 'VoxBox Valve Channel', maker: 'Manley Labs', category: 'preamps', year: 'All-Tube', notes: 'High-voltage vacuum tube preamp with opto-compressor and passive Pultec-style equalizer.' },

  // Dynamics & Outboard
  { name: 'Model 670 Stereo Limiter', maker: 'Fairchild', category: 'outboard', year: 'Restored 1959', notes: '20 vacuum tubes and 14 transformers. The holy grail of variable-mu analog master buss warmth.' },
  { name: 'LA-2A Leveling Amplifier', maker: 'Teletronix', category: 'outboard', year: 'Original Opto', notes: 'T4 electro-optical attenuator delivering effortless musical vocal leveling without artifacting.' },
  { name: '1176LN Peak Limiter Rev D', maker: 'Universal Audio', category: 'outboard', year: 'Vintage Blackface', notes: 'Ultra-fast 20-microsecond attack time with iconic all-buttons-in overdrive slam.' },
  { name: 'CL 1B Optical Compressor', maker: 'Tube-Tech', category: 'outboard', year: 'Handcrafted Denmark', notes: 'Velvety tube gain reduction, the international standard for vocal chain tracking.' },

  // Monitoring & Tape
  { name: 'A800 Mk III 24-Track 2"', maker: 'Studer', category: 'monitoring', year: 'Master Tape Machine', notes: 'Swiss precision transport, calibrated for ATR Master Tape at 15/30 IPS.' },
  { name: 'SCM110ASL Pro Tri-Amp', maker: 'ATC Loudspeakers', category: 'monitoring', year: 'Main Monitors', notes: 'Custom 3-inch soft dome midrange driver with zero distortion at 115 dB peak.' },
  { name: 'NS-10M Studio Nearfield', maker: 'Yamaha', category: 'monitoring', year: 'Class A Monitored', notes: 'The ruthless industry reference standard powered by Bryston 4B SST amplifiers.' },
  { name: 'B80 Mothership Converter', maker: 'Burl Audio', category: 'monitoring', year: 'Discrete Class A', notes: 'All-discrete transformer-coupled audio conversion for analog punch directly into Pro Tools HDX.' },

  // Instruments
  { name: 'Model D Concert Grand 9ft', maker: 'Steinway & Sons', category: 'instruments', year: 'Hamburg Built', notes: 'Maintained and voiced monthly by master technicians for world-class classical, jazz, and pop.' },
  { name: 'Broadkaster Custom Kit', maker: 'Gretsch Drums', category: 'instruments', year: '3-Ply Maple/Gum', notes: 'Classic round-badge warm projection with 22" kick, 12"/14"/16" toms, and Dunnett snare.' },
  { name: 'Moog One 16-Voice', maker: 'Moog Music', category: 'instruments', year: 'Flagship Analog', notes: 'Tri-timbral polyphonic synthesizer with 3 dual-output analog VCOs per voice.' },
  { name: 'Prophet-10 Analog Poly', maker: 'Sequential', category: 'instruments', year: 'Dave Smith Edition', notes: 'Ten genuine Curtis CEM analog voices with vintage Curtis/Rossum filter selector.' },
];

export default function GearLocker() {
  const [activeTab, setActiveTab] = useState<'all' | 'mics' | 'preamps' | 'outboard' | 'monitoring' | 'instruments'>('all');

  const filteredGear = activeTab === 'all' ? GEAR_DATA : GEAR_DATA.filter((g) => g.category === activeTab);

  return (
    <section id="gear" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-2 sm:space-y-3">
            <div className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-sky-400">
              AUTHENTIC HARDWARE ARSENAL
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
              The Verified Gear Locker
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every piece of outboard hardware, analog tape recorder, and vintage microphone is serviced, calibrated, and operational in our signal chains.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Equipment' },
            { id: 'mics', label: 'Microphones' },
            { id: 'preamps', label: 'Consoles & Preamps' },
            { id: 'outboard', label: 'Dynamics & EQs' },
            { id: 'monitoring', label: 'Tape & Conversion' },
            { id: 'instruments', label: 'Instruments & Backline' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-sky-400 text-black font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gear Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGear.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-sky-400 font-bold uppercase">{item.maker}</span>
                  <span>{item.year}</span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors font-display">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.notes}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase border-t border-white/5">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Calibrated & Studio Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
