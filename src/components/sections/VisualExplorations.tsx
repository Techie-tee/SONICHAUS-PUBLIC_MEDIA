import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2, Compass, Layers } from 'lucide-react';
import LightboxModal from '../ui/LightboxModal';

import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/studio_05_master_suite_1792446834087.jpg';
import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';
import recordingRoomImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';

interface ExplorationItem {
  id: string;
  title: string;
  chamber: string;
  concept: string;
  image: string;
  tag: string;
}

const EXPLORATIONS: ExplorationItem[] = [
  {
    id: 'exp-1',
    title: 'Harmonic Geometry',
    chamber: 'STUDIO A · ANALOG CONTROL ROOM',
    concept: 'Quadratic residue acoustic diffusion well reflections in dark walnut finish with SSL AWS 948 analog summing.',
    image: controlRoomImg,
    tag: 'ACOUSTIC DIFFUSION',
  },
  {
    id: 'exp-2',
    title: 'Vacuum Tube Luminescence',
    chamber: 'MASTERING SUITE · OUTBOARD RACK',
    concept: 'Manley Massive Passive high-voltage triode cathode glow providing discrete analog air during late-night tracking.',
    image: masterSuiteImg,
    tag: 'TUBE TOPOLOGY',
  },
  {
    id: 'exp-3',
    title: 'Voltage Controlled Currents',
    chamber: 'THE PRODUCTION LAB · MODULAR SYNTHS',
    concept: 'Eurorack modular patch chords routing control voltage to multi-mode analog filters for hypnotic syncopated textures.',
    image: productionLabImg,
    tag: 'MODULAR SYNTHESIS',
  },
  {
    id: 'exp-4',
    title: 'The Silent Threshold',
    chamber: 'ARCHITECTURAL ARRIVAL · LEKKI PHASE 1',
    concept: 'Acoustically decoupled floating architectural entrance engineered with triple-seal airlocks and ambient wood ribbing.',
    image: entranceImg,
    tag: 'ACOUSTIC DECOUPLING',
  },
  {
    id: 'exp-5',
    title: 'Vocal Chamber Solitude',
    chamber: 'THE VOCAL BOOTH · ISOLATION SUITE',
    concept: 'Suspended dual-diaphragm gold capsule absorbing intimate vocal micro-dynamics with true zero-flutter isolation.',
    image: vocalBoothImg,
    tag: 'MICRO-DYNAMICS',
  },
  {
    id: 'exp-6',
    title: 'Tape Transport Inertia',
    chamber: 'THE LIVE RECORDING ROOM · ANALOG DECKS',
    concept: 'Studer A800 precision flywheels moving 2-inch ferric oxide at 30 inches per second for uncompressed dynamic transient punch.',
    image: recordingRoomImg,
    tag: 'ANALOG TAPE SATURATION',
  },
];

export default function VisualExplorations() {
  const [activeItem, setActiveItem] = useState<ExplorationItem | null>(null);

  return (
    <section id="explorations" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-[#060910] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>VISUAL EXPLORATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
            WHERE SOUND BECOMES VISION.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-2xl mx-auto">
            A visual playground inspired by rhythm, texture, analog warmth, and architectural acoustics in our Lekki Phase 1 studio sanctuary.
          </p>
        </div>

        {/* Even 50/50 Proportional 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {EXPLORATIONS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => setActiveItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveItem(item);
                }
              }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#090d16] hover:border-[#4E85BF]/60 transition-all duration-500 cursor-pointer flex flex-col justify-end min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] shadow-2xl hover:shadow-[#4E85BF]/10"
            >
              {/* High-Resolution Architectural Photo */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.88] group-hover:brightness-100"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-[#040609]/50 to-transparent pointer-events-none" />

              {/* Ambient Glow Gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-radial from-[#4E85BF]/15 via-transparent to-transparent pointer-events-none" />

              {/* Top Header Controls: Chamber Badge & Expand Button */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono font-medium uppercase tracking-wider text-[#89AACC]">
                  <Compass className="w-3 h-3 text-[#4E85BF]" />
                  {item.tag}
                </span>

                <div className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:border-[#4E85BF]/60 group-hover:bg-[#4E85BF]/20 transition-all shadow-lg">
                  <Maximize2 className="w-4 h-4 text-slate-200 group-hover:text-white" />
                </div>
              </div>

              {/* Bottom Content Container - Symmetrical across all cards */}
              <div className="relative z-10 p-6 sm:p-8 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#89AACC] tracking-widest uppercase">
                    {item.chamber}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-tight group-hover:text-[#89AACC] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed line-clamp-2">
                  {item.concept}
                </p>

                {/* Subtle Click Indicator */}
                <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors">
                  <Layers className="w-3.5 h-3.5 text-[#4E85BF]" />
                  <span>Click to expand 4K high-resolution frame</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        imageSrc={activeItem?.image || ''}
        title={activeItem?.title || ''}
        caption={`${activeItem?.chamber} — ${activeItem?.concept}`}
        category="SONIC EXPLORATIONS"
      />
    </section>
  );
}
