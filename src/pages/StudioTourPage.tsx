import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Volume2, ShieldCheck, CheckCircle2, Sliders, Sparkles, Layers, Maximize2 } from 'lucide-react';

interface StudioRoom {
  id: string;
  name: string;
  tagline: string;
  purpose: string;
  description: string;
  acoustics: string[];
  equipmentList: string[];
  dimensions: string;
  primaryImage: string;
  galleryImages: string[];
  benefits: string[];
}

const ROOMS: StudioRoom[] = [
  {
    id: 'control-room',
    name: 'The Analog Control Room',
    tagline: 'Precision in every frequency. Emotion in every mix.',
    purpose: 'Critical listening, analog summing, stem mixing, tracking talkback, and final stereo balance.',
    description: 'Engineered as a true reflection-free listening zone (RFZ). Centered around our Solid State Logic AWS 948 Delta console, Genelec 8351B point-source monitors, and a boutique outboard rack featuring Tube-Tech, Neve, and Pultec analog processors.',
    acoustics: [
      'Custom floating concrete floor isolated from building structure (-80dB isolation)',
      'Perforated membrane bass traps absorbing sub-bass room modes down to 28Hz',
      'Quad-depth quadratic residue diffusers (QRD) for linear high-frequency dispersion',
      'Neutral reverberation time (RT60: 0.22s) across 20Hz - 20kHz',
    ],
    equipmentList: [
      'Solid State Logic AWS 948 Delta Console (48 Channels)',
      'Genelec 8351B SAM Coaxial Point-Source Monitors + 7380A Subwoofer',
      'Yamaha NS-10M Studio Reference Pair',
      'Tube-Tech CL 1B Optical Tube Compressor',
      'Rupert Neve Designs 1073SPX Discrete Preamps',
      'Universal Audio 1176LN Peak Limiters (Matched Pair)',
      'Pultec EQP-1A Tube Program Equalizer',
    ],
    dimensions: '38 sq m · Ceiling height 3.8m',
    primaryImage: '/assets/images/studio_03_control_room_1792446833033.jpg',
    galleryImages: [
      '/assets/images/studio_control_live_performance_1792447671011.jpg',
      '/assets/images/tour_04_control_room_1792445997182.jpg',
      '/assets/images/control_room_mobile_1792483021817.jpg',
    ],
    benefits: [
      'Mixes translate transparently to all consumer and professional playback environments',
      'Simultaneous multi-performer talkback with latency-free artist cue feeds',
      'Direct line-of-sight visual connection into the Vocal Booth and Live Room',
    ],
  },
  {
    id: 'vocal-booth',
    name: 'The Vocal Booth',
    tagline: 'Every great record begins with a voice.',
    purpose: 'Zero-noise, intimate vocal capture, voice-overs, and solo acoustic instrumentation.',
    description: 'A completely decoupled acoustic sanctuary. Double-leaf acoustic glass wall maintains eye contact with the control room while delivering complete sonic silence. Paired with the world-renowned Sony C-800G tube microphone and Neumann U87 Ai.',
    acoustics: [
      'Decoupled room-in-a-room construction with 4-inch acoustic isolation airspace',
      'Fabric-wrapped high-density broadband absorption panels (NRC 1.05)',
      'Multi-layer bass trapping behind angled acoustic baffle geometry',
      'Background noise criteria NC-15 (whisper-quiet recording floor)',
    ],
    equipmentList: [
      'Sony C-800G PAC Studio Tube Microphone with Peltier Cooling',
      'Neumann U87 Ai Large-Diaphragm Condenser',
      'Shure SM7B Broadcast Dynamic Microphone',
      'Grace Design m101 Ultra-Transparent Preamp',
      'Hear Technologies Hear Back PRO Personal Headphone Mixer',
    ],
    dimensions: '16 sq m · Ceiling height 3.2m',
    primaryImage: '/assets/images/studio_02_vocal_booth_1792446832131.jpg',
    galleryImages: [
      '/assets/images/tour_02_vocal_booth_1792445995278.jpg',
      '/assets/images/hero_vocal_booth_v2_1792444695212.jpg',
    ],
    benefits: [
      'Dead silence allows extreme vocal compression without amplifying floor noise',
      'Zero comb filtering around the microphone capsule',
      'Comfortable artist lighting moods to inspire natural vocal performances',
    ],
  },
  {
    id: 'live-room',
    name: 'The Live Performance Room',
    tagline: 'Where raw ideas become unforgettable performances.',
    purpose: 'Ensemble tracking, drum recording, live horn sections, podcasts, and acoustic sessions.',
    description: 'A spacious recording environment offering controlled natural air and musical reverberation. Designed with movable acoustic gobo panels to adapt from open dynamic room reverberation to tight acoustic containment.',
    acoustics: [
      'Reversible absorption/diffusion gobos for dynamic acoustic shaping',
      'Hardwood tongue-and-groove acoustic flooring with vibration damping subfloor',
      'Ceiling cloud absorption baffles preventing vertical flutter echoes',
      'Targeted RT60: 0.40s (musical, live, yet controlled)',
    ],
    equipmentList: [
      'Royer R-121 Ribbon Microphones (Matched Pair)',
      'AKG C414 XLS Multi-Pattern Microphones',
      'Sennheiser MD 421-II Dynamic Mics (Set of 4)',
      'Custom 4-Guest Podcast broadcast rig with Shure SM7B',
      'Direct line snakes to SSL console and Pro Tools HDX',
    ],
    dimensions: '52 sq m · Ceiling height 4.2m',
    primaryImage: '/assets/images/tour_03_live_room_1792445995741.jpg',
    galleryImages: [
      '/assets/images/hero_recording_room_v2_1792444696580.jpg',
    ],
    benefits: [
      'Sufficient physical space for 8+ musicians recording live together',
      'Multi-camera setup ready for video podcasting and live acoustic sessions',
      'Warm natural room resonance that gives drums and horns immense life',
    ],
  },
  {
    id: 'production-lab',
    name: 'The Production Lab',
    tagline: 'From a spark of inspiration to a sound of your own.',
    purpose: 'Music composition, beat-making, analog synthesis, songwriting, and sound design.',
    description: 'An incubator for producers and songwriters. Filled with analog synthesizers, drum machines, touch controllers, and instant sound design tools designed to capture inspiration at the speed of thought.',
    acoustics: [
      'Balanced nearfield acoustic treatment for accurate beat sub-bass evaluation',
      'Corner bass traps calibrated for 40Hz - 80Hz 808 kick accuracy',
      'Acoustic ceiling absorption preventing fatigue during 12-hour production sessions',
    ],
    equipmentList: [
      'Moog Subsequent 37 Paraphonic Analog Synthesizer',
      'Roland Juno-X Synthesizer Engine',
      'Akai Professional MPC X Special Edition',
      'Yamaha Montage 88 Weighted Key Workstation',
      'Focal Trio11 Be 3-Way Reference Monitors',
    ],
    dimensions: '28 sq m · Ceiling height 3.0m',
    primaryImage: '/assets/images/studio_04_production_lab_1792446833465.jpg',
    galleryImages: [
      '/assets/images/tour_05_production_lab_1792445998500.jpg',
      '/assets/images/hero_production_lab_v2_1792444697086.jpg',
    ],
    benefits: [
      'Direct hardware-to-DAW patching: record analog synths instantly',
      'Deep sub-bass accuracy ensuring low-end 808s rumble without muddiness',
      'Private creative sanctuary away from control room bustle',
    ],
  },
  {
    id: 'mastering-suite',
    name: 'The Mastering Suite',
    tagline: 'The final acoustic verdict.',
    purpose: 'Stereo mastering, Dolby Atmos calibration, true-peak limiting, and archival stem rendering.',
    description: 'Built to mastering laboratory tolerances. Uncompromising phase coherence, surgical monitoring, and custom analog mastering chains guarantee that every record released from SonicVault commands attention on global platforms.',
    acoustics: [
      'Symmetrical room geometry optimized for ultra-precise stereo imaging',
      'Floating floor and double walls with STC-72 acoustic rating',
      'True-peak frequency response: ±1.2dB from 24Hz to 28kHz',
    ],
    equipmentList: [
      'Rupert Neve Master Bus Transformer (MBT)',
      'Manley Massive Passive Mastering EQ',
      'Shadow Hills Mastering Compressor',
      'Weiss Engineering DS1-MK3 Digital De-Esser/Limiter',
      'Genelec Coaxial Active Monitoring Array with calibrated DSP',
    ],
    dimensions: '32 sq m · Ceiling height 3.5m',
    primaryImage: '/assets/images/studio_05_master_suite_1792446834087.jpg',
    galleryImages: [
      '/assets/images/tour_06_master_suite_1792445997686.jpg',
      '/assets/images/master_suite_mobile_1792482735792.jpg',
    ],
    benefits: [
      'Flawless translation to Apple Music, Spotify, YouTube, vinyl, and radio',
      'Full compliance with global streaming loudness standards without clipping',
      'Final high-resolution master delivery in 24-bit/96kHz lossless audio',
    ],
  },
];

export default function StudioTourPage() {
  const [selectedRoom, setSelectedRoom] = useState<StudioRoom>(ROOMS[0]);
  const [activeImage, setActiveImage] = useState<string>(ROOMS[0].primaryImage);

  const handleSelectRoom = (room: StudioRoom) => {
    setSelectedRoom(room);
    setActiveImage(room.primaryImage);
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>ARCHITECTURAL STUDIO EXPLORATION · LEKKI PHASE 1</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase">
            THE ARCHITECTURE OF SOUND.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every cubic meter of SONICVAULT STUDIOS in Lekki Phase 1 was drafted by world-class acoustic architects. 
            Isolated floating slabs, zero-resonance floating walls, and calibrated monitor geometry ensure that what you hear is absolute truth.
          </p>
        </div>

        {/* Room Navigation Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {ROOMS.map((room) => {
            const isActive = room.id === selectedRoom.id;
            return (
              <button
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'accent-gradient text-white font-bold shadow-lg shadow-[#4E85BF]/20 scale-102'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {room.name}
              </button>
            );
          })}
        </div>

        {/* Interactive Room Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: High-Res Viewport & Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 aspect-[16/10] group shadow-2xl">
              <img
                src={activeImage}
                alt={selectedRoom.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/90">
                <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10">
                  {selectedRoom.dimensions}
                </span>
                <span className="px-3 py-1 rounded-md bg-[#4E85BF]/80 backdrop-blur-md text-white font-semibold">
                  VERIFIED ACOUSTIC VAULT
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {[selectedRoom.primaryImage, ...selectedRoom.galleryImages].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative rounded-xl overflow-hidden w-24 h-16 shrink-0 border-2 transition-all cursor-pointer ${
                    activeImage === img ? 'border-[#4E85BF] scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Technical Details & Equipment Specs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-widest text-[#89AACC] uppercase block">
                FACILITY OVERVIEW
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {selectedRoom.name}
              </h2>
              <p className="text-sm font-editorial italic text-slate-300">
                "{selectedRoom.tagline}"
              </p>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {selectedRoom.description}
            </p>

            {/* Acoustic Treatment Accordion */}
            <div className="bg-[#0c1018] border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#89AACC] font-semibold">
                <Layers className="w-4 h-4 text-[#4E85BF]" />
                <span>ACOUSTIC SPECIFICATIONS & ISOLATION</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 font-sans">
                {selectedRoom.acoustics.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Hardware Chain */}
            <div className="bg-[#0c1018] border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#89AACC] font-semibold">
                <Sliders className="w-4 h-4 text-[#4E85BF]" />
                <span>INSTALLED HARDWARE & MONITORS</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                {selectedRoom.equipmentList.map((eq, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4E85BF]" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Booking Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                to={`/book-session?room=${encodeURIComponent(selectedRoom.id)}`}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl accent-gradient text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
              >
                <span>BOOK THIS ROOM</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-medium tracking-wide flex items-center justify-center transition-all cursor-pointer"
              >
                <span>EXPLORE SERVICES</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section Closing CTA */}
        <div className="mt-20 pt-16 border-t border-white/10 text-center space-y-4">
          <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
            VISIT THE FACILITY IN PERSON
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            STEP INSIDE. FIND YOUR SOUND.
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria. 
            All walkthroughs and recording lockouts strictly by appointment.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              to="/book-session"
              className="py-3 px-6 rounded-full accent-gradient text-white font-semibold text-xs tracking-wide shadow-md hover:opacity-90 transition-opacity"
            >
              SCHEDULE A SESSION
            </Link>
            <a
              href="https://wa.me/2349015104502"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-semibold text-xs tracking-wide hover:bg-emerald-600/30 transition-colors"
            >
              WHATSAPP WALKTHROUGH
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
