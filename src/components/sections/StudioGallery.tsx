import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Maximize2, ArrowRight } from 'lucide-react';
import LightboxModal from '../ui/LightboxModal';

import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';
import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/mastering_suite_collaborating_1792679626184.jpg';
import liveHallImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';

interface StudioGalleryProps {
  onOpenBooking: () => void;
}

interface GalleryItem {
  id: string;
  category: 'vocal' | 'performance' | 'production' | 'collaboration';
  categoryLabel: string;
  title: string;
  caption: string;
  image: string;
  specs: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-vocal',
    category: 'vocal',
    categoryLabel: 'Vocal Recording Environment',
    title: 'The Vault Vocal Chamber',
    caption: 'Dual-isolated floating acoustic shell with RT60 of 0.16s, vintage Neumann U87, and zero ground noise.',
    image: vocalBoothImg,
    specs: '180 sq ft · -85 dB Decoupling',
  },
  {
    id: 'gal-performance',
    category: 'performance',
    categoryLabel: 'Recording & Performance Space',
    title: 'Studio A Live Recording Hall',
    caption: 'Direct sightline glass looking into the control room, high ceilings, and prime quadratic residue diffusion wells.',
    image: controlRoomImg,
    specs: '650 sq ft · Direct Glass Sightline',
  },
  {
    id: 'gal-production',
    category: 'production',
    categoryLabel: 'Production & Mixing Environment',
    title: 'Lab B Modular Production Suite',
    caption: 'Moog One, Sequential Prophet-10, Akai MPC X, and Genelec Smart Active Monitoring for pristine composition.',
    image: productionLabImg,
    specs: '340 sq ft · Spatial Nearfield Matrix',
  },
  {
    id: 'gal-collaboration',
    category: 'collaboration',
    categoryLabel: 'Creative Collaboration Space',
    title: 'Analog Mastering & Artist Suite',
    caption: 'Studer 2-inch tape deck, Manley Massive Passive EQ, and dedicated private artist listening lounge in Lekki Phase 1.',
    image: masterSuiteImg,
    specs: '420 sq ft · Master Tape Calibrated',
  },
  {
    id: 'gal-live-tracking',
    category: 'performance',
    categoryLabel: 'Recording & Performance Space',
    title: 'Studio A Drum & Live Tracking Floor',
    caption: 'Tuned hardwood acoustic tracking floor with 4.2m ceiling volume for live drum kits, brass sections, and acoustic ensembles.',
    image: liveHallImg,
    specs: '520 sq ft · Tuned Hardwood Floor',
  },
  {
    id: 'gal-entrance',
    category: 'collaboration',
    categoryLabel: 'Creative Collaboration Space',
    title: 'Architectural Reception & Green Room',
    caption: 'Gated private access, artist hospitality suite, and executive meeting area for management and production teams.',
    image: entranceImg,
    specs: 'Private Access · 24/7 Lockout',
  },
];

export default function StudioGallery({ onOpenBooking }: StudioGalleryProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'vocal' | 'performance' | 'production' | 'collaboration'>('all');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="spaces" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>THE SPACE BEHIND THE SOUND</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
              MADE FOR THE MOMENT.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Step into a creative environment designed to help ideas become records. Conceived by world-class acoustic architects.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Environments' },
            { id: 'vocal', label: 'Vocal Environment' },
            { id: 'performance', label: 'Performance Space' },
            { id: 'production', label: 'Production & Mixing' },
            { id: 'collaboration', label: 'Collaboration Space' },
          ].map((tab) => (
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

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 hover:border-[#4E85BF]/40 transition-all duration-500 cursor-pointer flex flex-col justify-between"
              onClick={() => setActiveLightboxItem(item)}
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[#89AACC]">
                    {item.specs}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#89AACC] uppercase block">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer Detail */}
              <div className="p-5 sm:p-6 bg-[#07090e] border-t border-white/5 space-y-3">
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {item.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#89AACC] pt-1">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    VIEW ARCHITECTURAL VIEW <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onOpenBooking}
            className="px-8 py-3.5 rounded-full accent-gradient text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2"
          >
            <span>EXPLORE THE STUDIO & RESERVE SESSIONS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(activeLightboxItem)}
        onClose={() => setActiveLightboxItem(null)}
        imageSrc={activeLightboxItem?.image || ''}
        title={activeLightboxItem?.title || ''}
        caption={activeLightboxItem?.caption}
        category={activeLightboxItem?.categoryLabel}
      />
    </section>
  );
}
