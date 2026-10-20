import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2 } from 'lucide-react';
import LightboxModal from '../ui/LightboxModal';

import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/studio_05_master_suite_1792446834087.jpg';
import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';
import recordingRoomImg from '../../assets/images/hero_recording_room_v2_1792446896580.jpg';

interface ExplorationItem {
  id: string;
  title: string;
  concept: string;
  image: string;
  heightClass: string;
}

const EXPLORATIONS: ExplorationItem[] = [
  {
    id: 'exp-1',
    title: 'Harmonic Geometry',
    concept: 'Quadratic residue acoustic diffusion well reflections in walnut finish.',
    image: controlRoomImg,
    heightClass: 'h-80 sm:h-96',
  },
  {
    id: 'exp-2',
    title: 'Vacuum Tube Luminescence',
    concept: 'Manley Massive Passive high-voltage triode cathode glow in low-light tracking.',
    image: masterSuiteImg,
    heightClass: 'h-64 sm:h-80',
  },
  {
    id: 'exp-3',
    title: 'Voltage Controlled Currents',
    concept: 'Eurorack modular patch chords routing control voltage to multi-mode analog filters.',
    image: productionLabImg,
    heightClass: 'h-96 sm:h-[420px]',
  },
  {
    id: 'exp-4',
    title: 'The Silent Threshold',
    concept: 'Acoustically decoupled floating architectural entrance in Lekki Phase 1.',
    image: entranceImg,
    heightClass: 'h-72 sm:h-88',
  },
  {
    id: 'exp-5',
    title: 'Vocal Chamber Solitude',
    concept: 'Suspended dual-diaphragm gold capsule absorbing intimate vocal micro-dynamics.',
    image: vocalBoothImg,
    heightClass: 'h-96 sm:h-[440px]',
  },
  {
    id: 'exp-6',
    title: 'Tape Transport Inertia',
    concept: 'Studer A800 precision flywheels moving 2-inch ferric oxide at 30 inches per second.',
    image: masterSuiteImg,
    heightClass: 'h-72 sm:h-80',
  },
];

export default function VisualExplorations() {
  const [activeItem, setActiveItem] = useState<ExplorationItem | null>(null);

  // Divide into two asymmetric columns
  const col1 = [EXPLORATIONS[0], EXPLORATIONS[2], EXPLORATIONS[4]];
  const col2 = [EXPLORATIONS[1], EXPLORATIONS[3], EXPLORATIONS[5]];

  return (
    <section id="explorations" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#060910] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>EXPLORATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
            WHERE SOUND BECOMES VISION.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            A visual playground inspired by rhythm, texture, atmosphere, and the creative process in our Lagos studios.
          </p>
        </div>

        {/* Dual Asymmetric Columns Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Column 1 */}
          <div className="space-y-6 sm:space-y-8">
            {col1.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveItem(item)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 hover:border-[#4E85BF]/40 transition-all duration-500 cursor-pointer ${item.heightClass}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="text-xl font-bold text-white font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans line-clamp-1">
                    {item.concept}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Column 2 (Offset on desktop for staggered parallax rhythm) */}
          <div className="space-y-6 sm:space-y-8 md:pt-12">
            {col2.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveItem(item)}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 hover:border-[#4E85BF]/40 transition-all duration-500 cursor-pointer ${item.heightClass}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="text-xl font-bold text-white font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans line-clamp-1">
                    {item.concept}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        imageSrc={activeItem?.image || ''}
        title={activeItem?.title || ''}
        caption={activeItem?.concept}
        category="SONIC EXPLORATION"
      />
    </section>
  );
}
