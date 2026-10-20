import { motion } from 'motion/react';
import { ArrowUpRight, Mic, Sliders, Music, Radio, Disc, Sparkles, AudioWaveform, Headphones } from 'lucide-react';

import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/studio_05_master_suite_1792446834087.jpg';
import recordingRoomImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';
import artistMasterImg from '../../assets/images/hero_artist_master_v2_1792444696981.jpg';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export interface StudioService {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  span: string; // Tailwind grid span for desktop bento layout
  icon: typeof Mic;
  tag: string;
}

export const STUDIO_SERVICES: StudioService[] = [
  {
    id: 'vocal-recording',
    title: 'Vocal Recording',
    category: 'TRACKING & CAPTURE',
    description:
      'Ultra-quiet decoupled vocal booth with vintage Neumann U87, BAE 1073 preamp, and Tube-Tech CL 1B optical leveling for radio-ready intimacy.',
    image: vocalBoothImg,
    span: 'col-span-12 lg:col-span-7',
    icon: Mic,
    tag: 'FLAGSHIP CHAMBER',
  },
  {
    id: 'music-production',
    title: 'Music Production',
    category: 'COMPOSITION & ARRANGEMENT',
    description:
      'Collaborative production sessions with in-house sound architects, world-class modular synths, and multi-display DAW matrices.',
    image: productionLabImg,
    span: 'col-span-12 lg:col-span-5',
    icon: Music,
    tag: 'CREATIVE RESIDENCY',
  },
  {
    id: 'beat-production',
    title: 'Beat Production',
    category: 'SOUND DESIGN & DRUMS',
    description:
      'Bespoke rhythmic foundations, MPC Live II grooves, analog 808 sculpting, and proprietary Afrobeat, Alté, and Amapiano drum samples.',
    image: artistMasterImg,
    span: 'col-span-12 lg:col-span-4',
    icon: Sliders,
    tag: 'ANALOG DRUM LAB',
  },
  {
    id: 'mixing',
    title: 'Analog & In-The-Box Mixing',
    category: 'BALANCE & DEPTH',
    description:
      'Surgical 48-channel SSL 4000 G+ console summing, Neve outboard EQ, and 3D stereo spatial depth for punch, warmth, and radio translation.',
    image: controlRoomImg,
    span: 'col-span-12 lg:col-span-8',
    icon: AudioWaveform,
    tag: 'SSL 4000 G+',
  },
  {
    id: 'mastering',
    title: 'Stereo & Stem Mastering',
    category: 'FINAL FINISH & RELEASE',
    description:
      'Studer A800 2-inch tape saturation, Manley Massive Passive tube equalization, and Burl Mothership conversion ready for DSP distribution.',
    image: masterSuiteImg,
    span: 'col-span-12 lg:col-span-6',
    icon: Disc,
    tag: 'APPLE DIGITAL MASTERS',
  },
  {
    id: 'vocal-tuning',
    title: 'Vocal Editing & Tuning',
    category: 'CORRECTION & HARMONIES',
    description:
      'Micro-pitch Melodyne alignment, natural formant tracking, breath optimization, and lush multi-part vocal harmony stack engineering.',
    image: vocalBoothImg,
    span: 'col-span-12 lg:col-span-6',
    icon: Headphones,
    tag: 'SURGICAL PRECISION',
  },
  {
    id: 'full-production',
    title: 'Full Music Production',
    category: 'END-TO-END ALBUMS',
    description:
      'Turn an initial voice memo into an internationally competitive release: songwriting, live rhythm tracking, vocal production, mix, and master.',
    image: recordingRoomImg,
    span: 'col-span-12 lg:col-span-8',
    icon: Sparkles,
    tag: 'EXECUTIVE DIRECTION',
  },
  {
    id: 'podcast-recording',
    title: 'Podcast Recording',
    category: 'BROADCAST & SPOKEN WORD',
    description:
      'Multi-microphone broadcast setup with Shure SM7B arrays, 4K multi-cam studio capture, and real-time noise-floor cancellation.',
    image: controlRoomImg,
    span: 'col-span-12 lg:col-span-4',
    icon: Radio,
    tag: '4-MIC BROADCAST',
  },
  {
    id: 'voiceover',
    title: 'Voice-Over Recording',
    category: 'COMMERCIAL & FILM ADR',
    description:
      'Source-Connect enabled vocal booth for national commercial voice-over, video game dialogue, and film dialogue replacement with ultra-low latency.',
    image: vocalBoothImg,
    span: 'col-span-12',
    icon: Mic,
    tag: 'SOURCE-CONNECT LIVE',
  },
];

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#070a12] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
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

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-12 gap-5 sm:gap-6">
          {STUDIO_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`${service.span} relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 hover:border-[#4E85BF]/50 transition-all duration-500 flex flex-col justify-between`}
              >
                {/* Background Image with Ambient Gradient */}
                <div className="relative aspect-[16/10] sm:aspect-auto sm:h-64 lg:h-72 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.75] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-[#070a12]/40 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[#89AACC] tracking-wider uppercase">
                      {service.tag}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center group-hover:accent-gradient transition-all">
                      <Icon className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Card Content & Action Button */}
                <div className="p-6 sm:p-8 space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                      {service.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <button
                      onClick={() => onSelectService(service.title)}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white hover:text-[#89AACC] transition-colors cursor-pointer group-hover:translate-x-1 duration-300"
                    >
                      <span>BOOK THIS SERVICE</span>
                      <ArrowUpRight className="w-4 h-4 text-[#4E85BF]" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-500">
                      ENQUIRE FOR PRICING
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
