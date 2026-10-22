import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Mic, Sliders, Music, Radio, Disc, Sparkles, AudioWaveform, Headphones, ShieldCheck, ArrowRight } from 'lucide-react';

import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/mastering_suite_collaborating_1792679626184.jpg';
import recordingRoomImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';
import artistMasterImg from '../../assets/images/hero_artist_master_v2_1792444696981.jpg';
import entranceImg from '../../assets/images/studio_01_entrance_1792446831639.jpg';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
  isHomepage?: boolean;
}

export interface StudioService {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  icon: typeof Mic;
  tag: string;
  room: string;
  rateHint: string;
}

export const STUDIO_SERVICES: StudioService[] = [
  {
    id: 'vocal-recording',
    title: 'Vocal Recording',
    category: 'TRACKING & CAPTURE',
    room: 'The Vocal Booth',
    rateHint: 'FROM ₦35,000 / HR',
    description:
      'Ultra-quiet decoupled vocal booth with vintage Neumann U87, BAE 1073 preamp, and Tube-Tech CL 1B optical leveling for radio-ready intimacy.',
    image: vocalBoothImg,
    icon: Mic,
    tag: 'FLAGSHIP CHAMBER',
  },
  {
    id: 'music-production',
    title: 'Music Production',
    category: 'COMPOSITION & ARRANGEMENT',
    room: 'The Production Lab',
    rateHint: 'FROM ₦150,000 / TRACK',
    description:
      'Collaborative production sessions with in-house sound architects, world-class modular synths, and multi-display DAW matrices.',
    image: productionLabImg,
    icon: Music,
    tag: 'CREATIVE RESIDENCY',
  },
  {
    id: 'beat-production',
    title: 'Beat Production',
    category: 'SOUND DESIGN & DRUMS',
    room: 'The Production Lab',
    rateHint: 'FROM ₦150,000 / TRACK',
    description:
      'Bespoke rhythmic foundations, MPC Live II grooves, analog 808 sculpting, and proprietary Afrobeat, Alté, and Amapiano drum samples.',
    image: artistMasterImg,
    icon: Sliders,
    tag: 'ANALOG DRUM LAB',
  },
  {
    id: 'mixing',
    title: 'Analog & In-The-Box Mixing',
    category: 'BALANCE & DEPTH',
    room: 'The Control Room',
    rateHint: 'FROM ₦100,000 / TRACK',
    description:
      'Surgical 48-channel SSL 4000 G+ console summing, Neve outboard EQ, and 3D stereo spatial depth for punch, warmth, and radio translation.',
    image: controlRoomImg,
    icon: AudioWaveform,
    tag: 'SSL 4000 G+',
  },
  {
    id: 'mastering',
    title: 'Stereo & Stem Mastering',
    category: 'FINAL FINISH & RELEASE',
    room: 'The Mastering Suite',
    rateHint: 'FROM ₦50,000 / TRACK',
    description:
      'Studer A800 2-inch tape saturation, Manley Massive Passive tube equalization, and Burl Mothership conversion ready for DSP distribution.',
    image: masterSuiteImg,
    icon: Disc,
    tag: 'APPLE DIGITAL MASTERS',
  },
  {
    id: 'vocal-tuning',
    title: 'Vocal Editing & Tuning',
    category: 'CORRECTION & HARMONIES',
    room: 'The Vocal Booth',
    rateHint: 'FROM ₦60,000 / TRACK',
    description:
      'Micro-pitch Melodyne alignment, natural formant tracking, breath optimization, and lush multi-part vocal harmony stack engineering.',
    image: vocalBoothImg,
    icon: Headphones,
    tag: 'SURGICAL PRECISION',
  },
  {
    id: 'full-production',
    title: 'Full Music Production',
    category: 'END-TO-END ALBUMS',
    room: 'Full Studio Access',
    rateHint: 'FROM ₦300,000 / TRACK',
    description:
      'Turn an initial voice memo into an internationally competitive release: songwriting, live rhythm tracking, vocal production, mix, and master.',
    image: recordingRoomImg,
    icon: Sparkles,
    tag: 'EXECUTIVE DIRECTION',
  },
  {
    id: 'podcast-recording',
    title: 'Podcast Recording',
    category: 'BROADCAST & SPOKEN WORD',
    room: 'The Live Room',
    rateHint: 'FROM ₦50,000 / HR',
    description:
      'Multi-microphone broadcast setup with Shure SM7B arrays, 4K multi-cam studio capture, and real-time noise-floor cancellation.',
    image: controlRoomImg,
    icon: Radio,
    tag: '4-MIC BROADCAST',
  },
  {
    id: 'voiceover',
    title: 'Voice-Over Recording',
    category: 'COMMERCIAL & FILM ADR',
    room: 'The Vocal Booth',
    rateHint: 'FROM ₦35,000 / HR',
    description:
      'Source-Connect enabled vocal booth for national commercial voice-over, video game dialogue, and film dialogue replacement with ultra-low latency.',
    image: vocalBoothImg,
    icon: Mic,
    tag: 'SOURCE-CONNECT LIVE',
  },
  {
    id: 'lockout-residency',
    title: 'Studio Lockout & VIP Residency',
    category: 'EXCLUSIVE FACILITY HIRE',
    room: 'All Studio Chambers',
    rateHint: 'FROM ₦450,000 / DAY',
    description:
      'Complete private lockout of all 5 chambers in Lekki Phase 1 with dedicated senior engineer, VIP artist lounge, catering, and 24/7 access.',
    image: entranceImg,
    icon: ShieldCheck,
    tag: 'VIP ALBUM RESIDENCY',
  },
];

export default function ServicesSection({ onSelectService, isHomepage = false }: ServicesSectionProps) {
  const displayedServices = isHomepage ? STUDIO_SERVICES.slice(0, 4) : STUDIO_SERVICES;

  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#070a12] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>WHAT WE DO</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
              EVERY SOUND HAS A PURPOSE.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            From the first idea to the final master, find the right space and service for your next project.
          </p>
        </div>

        {/* Perfectly Even 50/50 Proportional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {displayedServices.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0b0f19] hover:border-[#4E85BF]/60 transition-all duration-500 flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_rgba(78,133,191,0.18)]"
              >
                {/* Top Half: Visual Media Container (Even 50% Visual Proportion) */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:h-72 w-full overflow-hidden shrink-0 bg-black">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.8] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/30 to-black/30 pointer-events-none" />

                  {/* Top Badge & Functional Icon */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[#89AACC] tracking-wider uppercase font-medium shadow-sm">
                      {service.tag}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center group-hover:bg-[#4E85BF] group-hover:border-[#89AACC] group-hover:shadow-[0_0_15px_rgba(78,133,191,0.6)] transition-all">
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Bottom Half: Editorial Content Container (Even 50% Content Proportion) */}
                <div className="p-5 sm:p-7 lg:p-8 flex-1 flex flex-col justify-between space-y-5 bg-[#0b0f19]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#89AACC] uppercase block font-semibold truncate">
                        {service.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">
                        {service.room}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight group-hover:text-[#89AACC] transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Pinned Action Bar */}
                  <div className="pt-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 border-t border-white/10 mt-auto">
                    <button
                      type="button"
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white hover:text-[#89AACC] transition-colors cursor-pointer group-hover:translate-x-1 duration-300"
                    >
                      <span>BOOK THIS SERVICE</span>
                      <ArrowUpRight className="w-4 h-4 text-[#4E85BF]" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-500 tracking-wide shrink-0">
                      {service.rateHint}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dedicated Services Page Navigation Bridge for Homepage */}
        {isHomepage && (
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-mono text-slate-400">
              SHOWING 4 CORE DISCIPLINES · 9 VERIFIED RECORDING, MIXING & MASTERING SERVICES AVAILABLE
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white hover:text-sky-300 transition-all cursor-pointer shadow-sm group"
            >
              <span>EXPLORE ALL SERVICES & RATES</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#4E85BF]" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
