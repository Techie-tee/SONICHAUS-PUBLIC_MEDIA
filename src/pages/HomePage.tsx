import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowUpRight, Layers, Sliders, ShieldCheck, Users, Radio, Disc } from 'lucide-react';
import CinematicHero from '../components/hero/CinematicHero';
import SonicPhilosophy from '../components/sections/SonicPhilosophy';
import ServicesSection from '../components/sections/ServicesSection';
import SelectedWork from '../components/sections/SelectedWork';
import StudioFAQ from '../components/sections/StudioFAQ';
import FinalCinematicCTA from '../components/sections/FinalCinematicCTA';

import controlRoomImg from '../assets/images/studio_control_live_performance_1792447671011.jpg';
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
    role: 'Beat-Making, Analog Synthesis & Drums',
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
      <section
        id="studio-metrics"
        aria-label="Acoustic Credentials & Studio Specifications"
        className="relative z-20 py-5 sm:py-7 px-4 sm:px-6 lg:px-12 bg-[#060911] border-y border-white/10 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto">
          {/* Subtle Lead-in Header */}
          <div className="text-center mb-4 sm:mb-5">
            <p className="text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#89AACC] uppercase select-none font-semibold">
              UNCOMPROMISING ACOUSTIC BENCHMARKS · LEKKI PHASE 1
            </p>
          </div>

          {/* 4 Architectural Metric Pillars */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-stretch">
            {/* Metric 1: Structural Isolation */}
            <div className="studio-metric-card p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#4E85BF]/50">
              <span className="metric-value font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#38BDF8] tracking-tight tabular-nums">
                -85 dB
              </span>
              <p className="metric-label mt-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-bold text-slate-200">
                STRUCTURAL ISOLATION
              </p>
              <p className="metric-context mt-0.5 text-[10.5px] sm:text-xs text-slate-400">
                Floating concrete box-in-box
              </p>
            </div>

            {/* Metric 2: Noise Criteria */}
            <div className="studio-metric-card p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#4E85BF]/50">
              <span className="metric-value font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#60A5FA] tracking-tight tabular-nums">
                NC-15
              </span>
              <p className="metric-label mt-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-bold text-slate-200">
                NOISE CRITERIA BASELINE
              </p>
              <p className="metric-context mt-0.5 text-[10.5px] sm:text-xs text-slate-400">
                Silenced ultra-low airflow HVAC
              </p>
            </div>

            {/* Metric 3: Console */}
            <div className="studio-metric-card p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#4E85BF]/50">
              <span className="metric-value font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight tabular-nums">
                48 CH
              </span>
              <p className="metric-label mt-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-bold text-slate-200">
                SSL AWS 948 CONSOLE
              </p>
              <p className="metric-context mt-0.5 text-[10.5px] sm:text-xs text-slate-400">
                Dual analog & DAW summing
              </p>
            </div>

            {/* Metric 4: Lockouts */}
            <div className="studio-metric-card p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-emerald-500/50">
              <span className="metric-value font-display text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 tracking-tight tabular-nums">
                24/7
              </span>
              <p className="metric-label mt-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] font-bold text-slate-200">
                PRIVATE VIP LOCKOUTS
              </p>
              <p className="metric-context mt-0.5 text-[10.5px] sm:text-xs text-slate-400">
                Biometric access & lounge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Sonic Philosophy (Beyond The Sound · Great music needs more than a room) */}
      <SonicPhilosophy />

      {/* 3. Core Services Overview (Curated Flagship Disciplines with link to full /services) */}
      <ServicesSection onSelectService={onOpenBooking} isHomepage={true} />

      {/* 4. Architectural Spaces Gateway Bridge (Anchored for smooth scroll from hero CTA) */}
      <section id="spaces" className="py-10 sm:py-16 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-5 sm:pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
                <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
                <span>ARCHITECTURAL SANCTUARY · LEKKI PHASE 1</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight uppercase leading-tight">
                FIVE ISOLATED ACOUSTIC WORLDS.
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-snug">
              Floating concrete slabs, -85dB isolation, and tuned diffusion. Step into the chambers engineered for uncompromising sonic truth.
            </p>
          </div>

          {/* Chamber Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {FEATURED_CHAMBERS.map((chamber) => (
              <Link
                key={chamber.id}
                to="/studio"
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#080b12] hover:border-[#4E85BF]/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg"
              >
                {/* Visual Image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black">
                  <img
                    src={chamber.image}
                    alt={chamber.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b12] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Text Description: Consistent bottom-aligned layout so all chamber titles sit well below */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 flex-1 flex flex-col justify-end">
                    <span
                      style={{ color: '#38BDF8' }}
                      className="text-[10.5px] font-mono text-[#38BDF8] !text-[#38BDF8] uppercase tracking-wider block font-bold min-h-[1.75rem] flex items-end drop-shadow-sm"
                    >
                      {chamber.role}
                    </span>
                    <h3
                      style={{ color: '#FFFFFF' }}
                      className="studio-gallery-card-title chamber-card-title text-sm sm:text-base font-extrabold !text-white text-white font-display group-hover:text-[#38BDF8] transition-colors leading-snug min-h-[2.5rem] flex items-end drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
                    >
                      {chamber.name}
                    </h3>
                  </div>
                  <p
                    style={{ color: '#E2E8F0' }}
                    className="chamber-card-gear text-[11px] text-slate-200 !text-[#E2E8F0] font-mono font-medium line-clamp-1 pt-1.5 border-t border-white/10 mt-2 drop-shadow-sm"
                  >
                    {chamber.gear}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Direct Link to Dedicated Studio Tour */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs font-mono text-slate-300 dark:text-slate-400 font-medium">
              EXPLORE SCHEMATICS, ACOUSTIC RATINGS (NC-15), ROOM DIMENSIONS & FULL SPECIFICATIONS
            </p>
            <Link
              to="/studio"
              className="studio-tour-cta-btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#090D16] hover:bg-[#111827] active:bg-[#060910] border border-white/20 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer group hover:border-[#4E85BF]/60 active:scale-[0.98]"
            >
              <span className="text-white font-bold tracking-wider">TAKE FULL ARCHITECTURAL STUDIO TOUR</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#4E85BF]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Selected Work (Curated Flagship Releases with link to full /our-work) */}
      <SelectedWork onOpenBooking={onOpenBooking} isHomepage={true} />

      {/* 6. Hardware & Sanctuary Origin Deep-Dive Gateways */}
      <section id="studio-gateways" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-12 bg-[#040609] border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card A: Equipment Locker Gateway */}
          <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/40 transition-all duration-300 flex flex-col justify-between space-y-4 group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#89AACC]">
                  VERIFIED HARDWARE VAULT
                </span>
                <Sliders className="w-5 h-5 text-[#4E85BF]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-tight">
                THE EQUIPMENT LIBRARY.
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-snug font-sans">
                From the Sony C-800G tube chain and SSL AWS 948 Delta to Neve 1073 preamps, Tube-Tech CL 1B compression, and Genelec coaxial monitoring. Search our complete hardware and microphone inventory.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
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
          <div className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/40 transition-all duration-300 flex flex-col justify-between space-y-4 group">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#89AACC]">
                  MISSION & RESIDENT TEAM
                </span>
                <Users className="w-5 h-5 text-[#4E85BF]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-tight">
                THE LEKKI SANCTUARY & TEAM.
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-snug font-sans">
                Learn why we built an uncompromising acoustic haven in Lekki Phase 1. Discover the four pillars of record creation, meet our resident executive producers, and read our control room journals.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10">
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
