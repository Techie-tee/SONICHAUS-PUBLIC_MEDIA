import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowUpRight, Layers, Sliders, ShieldCheck, Users, Radio, Disc } from 'lucide-react';
import CinematicHero from '../components/hero/CinematicHero';
import SonicPhilosophy from '../components/sections/SonicPhilosophy';
import ServicesSection from '../components/sections/ServicesSection';
import SelectedWork from '../components/sections/SelectedWork';
import StudioFAQ from '../components/sections/StudioFAQ';
import FinalCinematicCTA from '../components/sections/FinalCinematicCTA';

import controlRoomImg from '../assets/images/studio_03_control_room_1792446833033.jpg';
import vocalBoothImg from '../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import liveRoomImg from '../assets/images/hero_recording_room_v2_1792444696580.jpg';
import productionLabImg from '../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../assets/images/mastering_suite_collaborating_1792679626184.jpg';

interface HomePageProps {
  onOpenBooking: (serviceOrRoom?: string) => void;
}

const FEATURED_CHAMBERS = [
  {
    id: 'control-room',
    name: 'The Analog Control Room',
    role: 'Mixing, Summing & Critical Listening',
    gear: 'SSL AWS 948 Delta · Genelec 8351B · Tube-Tech CL 1B',
    image: controlRoomImg,
  },
  {
    id: 'vocal-booth',
    name: 'The Vocal Booth',
    role: 'Zero-Noise Intimate Vocal Tracking',
    gear: 'Sony C-800G · Neumann U87 Ai · Grace Design Preamp',
    image: vocalBoothImg,
  },
  {
    id: 'live-room',
    name: 'The Live Performance Room',
    role: 'Ensemble Tracking, Drums & Podcasts',
    gear: 'Royer R-121 · Coles 4038 · 4-Guest Podcast Rig',
    image: liveRoomImg,
  },
  {
    id: 'production-lab',
    name: 'The Production Lab',
    role: 'Beat-Making & Analog Synthesis',
    gear: 'Moog Subsequent 37 · Akai MPC X · Focal Trio11 Be',
    image: productionLabImg,
  },
  {
    id: 'mastering-suite',
    name: 'The Mastering Suite',
    role: 'Stereo Mastering & Dolby Atmos Prep',
    gear: 'Manley Massive Passive · Neve MBT · Weiss DS1-MK3',
    image: masterSuiteImg,
  },
];

export default function HomePage({ onOpenBooking }: HomePageProps) {
  const handleExploreSpaces = useCallback(() => {
    const spacesElem = document.getElementById('spaces');
    if (spacesElem) {
      spacesElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <main className="w-full">
      {/* 1. Cinematic Hero & 8-Scene Studio Scroll Tour */}
      <CinematicHero
        onOpenBooking={onOpenBooking}
        onExploreSpaces={handleExploreSpaces}
      />

      {/* Architectural Studio Credentials & Acoustic Metrics Ribbon: Bridges Hero into Philosophy */}
      <div id="studio-metrics" className="bg-[#030508] border-y border-white/10 py-6 px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center text-center">
          <div className="space-y-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#89AACC]">-85 dB</span>
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">STRUCTURAL ISOLATION</p>
          </div>
          <div className="space-y-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#4E85BF]">NC-15</span>
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">NOISE CRITERIA BASELINE</p>
          </div>
          <div className="space-y-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">48 CH</span>
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">SSL AWS 948 CONSOLE</p>
          </div>
          <div className="space-y-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-400">24/7</span>
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">PRIVATE VIP LOCKOUTS</p>
          </div>
        </div>
      </div>

      {/* 2. The Sonic Philosophy (Beyond The Sound · Great music needs more than a room) */}
      <SonicPhilosophy />

      {/* 3. Core Services Overview (Curated Flagship Disciplines with link to full /services) */}
      <ServicesSection onSelectService={onOpenBooking} isHomepage={true} />

      {/* 4. Architectural Spaces Gateway Bridge (Anchored for smooth scroll from hero CTA) */}
      <section id="spaces" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6 sm:pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
                <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
                <span>ARCHITECTURAL SANCTUARY · LEKKI PHASE 1</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
                FIVE ISOLATED ACOUSTIC WORLDS.
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              Floating concrete slabs, -85dB isolation, and tuned diffusion. Step into the chambers engineered for uncompromising sonic truth.
            </p>
          </div>

          {/* Chamber Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FEATURED_CHAMBERS.map((chamber) => (
              <Link
                key={chamber.id}
                to="/studio"
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#080b12] hover:border-[#4E85BF]/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg"
              >
                {/* Visual Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <img
                    src={chamber.image}
                    alt={chamber.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Text Description */}
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-wider block font-semibold">
                      {chamber.role}
                    </span>
                    <h3 className="text-sm font-bold text-white font-display group-hover:text-[#89AACC] transition-colors leading-snug">
                      {chamber.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono line-clamp-1 pt-2 border-t border-white/5">
                    {chamber.gear}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Direct Link to Dedicated Studio Tour */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-mono text-slate-400">
              EXPLORE SCHEMATICS, ACOUSTIC RATINGS (NC-15), ROOM DIMENSIONS & FULL SPECIFICATIONS
            </p>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white hover:text-sky-300 transition-all cursor-pointer shadow-sm group"
            >
              <span>TAKE FULL ARCHITECTURAL STUDIO TOUR</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#4E85BF]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Selected Work (Curated Flagship Releases with link to full /our-work) */}
      <SelectedWork onOpenBooking={onOpenBooking} isHomepage={true} />

      {/* 6. Hardware & Sanctuary Origin Deep-Dive Gateways */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-[#040609] border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Equipment Locker Gateway */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#89AACC]">
                  VERIFIED HARDWARE VAULT
                </span>
                <Sliders className="w-5 h-5 text-[#4E85BF]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
                THE EQUIPMENT LIBRARY.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                From the Sony C-800G tube chain and SSL AWS 948 Delta to Neve 1073 preamps, Tube-Tech CL 1B compression, and Genelec coaxial monitoring. Search our complete hardware and microphone inventory.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/equipment"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white hover:text-[#89AACC] transition-colors group-hover:translate-x-1 duration-300"
              >
                <span>EXPLORE ALL HARDWARE & SPECS</span>
                <ArrowRight className="w-4 h-4 text-[#4E85BF]" />
              </Link>
            </div>
          </div>

          {/* Card B: Sanctuary & Leadership Gateway */}
          <div className="p-8 sm:p-10 rounded-2xl bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/40 transition-all duration-300 flex flex-col justify-between space-y-6 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#89AACC]">
                  MISSION & RESIDENT TEAM
                </span>
                <Users className="w-5 h-5 text-[#4E85BF]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
                THE LEKKI SANCTUARY & TEAM.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                Learn why we built an uncompromising acoustic haven in Lekki Phase 1. Discover the four pillars of record creation, meet our resident executive producers, and read our control room journals.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white hover:text-[#89AACC] transition-colors group-hover:translate-x-1 duration-300"
              >
                <span>MEET THE TEAM & OUR STORY</span>
                <ArrowRight className="w-4 h-4 text-[#4E85BF]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Studio FAQ (Essential Common Inquiries & Dynamic Accordion) */}
      <StudioFAQ onOpenBooking={onOpenBooking} />

      {/* 8. Final Cinematic CTA (Continuous Marquee & Session Booking) */}
      <FinalCinematicCTA onOpenBooking={() => onOpenBooking()} />
    </main>
  );
}
