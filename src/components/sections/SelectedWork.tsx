import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import {
  Play,
  Pause,
  Sparkles,
  ArrowUpRight,
  Disc3,
  Sliders,
  Maximize2,
  X,
  Volume2,
  CheckCircle2,
  Layers,
  Radio,
  Share2,
  ExternalLink,
  ChevronRight,
  AudioWaveform,
  Headphones,
  Mic,
  Calendar,
  Clock,
  Compass
} from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

// Authentic Studio Assets
import artistMasterImg from '../../assets/images/hero_artist_master_v2_1792444696981.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/studio_05_master_suite_1792446834087.jpg';
import recordingRoomImg from '../../assets/images/hero_recording_room_v2_1792444696580.jpg';
import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';

export type ProjectCategory = 'all' | 'artist-sessions' | 'original-productions' | 'mix-master' | 'sound-in-motion';

export interface ProjectRecord {
  id: string;
  title: string;
  artist: string;
  category: string;
  categorySlug: 'artist-sessions' | 'original-productions' | 'mix-master' | 'sound-in-motion';
  duration: string;
  year: string;
  bpm: number;
  key: string;
  image: string;
  desktopSpan: string; // 12-col bento pattern
  description: string;
  caseStudy: {
    heroQuote: string;
    overview: string;
    creativeChallenge: string;
    studioRoom: string;
    signalChain: { stage: string; hardware: string; role: string }[];
    sessionLog: string[];
    technicalSpecs: { label: string; value: string }[];
    stems: { id: string; name: string; type: string; frequencyNote: string }[];
    galleryImages: string[];
  };
}

const PROJECTS_DATA: ProjectRecord[] = [
  {
    id: 'proj-01',
    title: 'Midnight Lagos Echoes',
    artist: 'SonicVault Collective · Live Vol. 1',
    category: 'Artist Sessions',
    categorySlug: 'artist-sessions',
    duration: '3:42',
    year: '2026',
    bpm: 108,
    key: 'E minor',
    image: controlRoomImg,
    desktopSpan: 'col-span-12 lg:col-span-7',
    description: 'Tracked live on the 48-channel SSL desk with tenor saxophone, percussive log drums, and vintage ribbon mics.',
    caseStudy: {
      heroQuote: '"Capturing the raw tension between acoustic African percussion and London-calibrated analog tape saturation."',
      overview: 'A late-night collaborative session recorded in the main live room, pairing three live percussionists with a muted saxophone and modular bassline. The objective was acoustic transparency without losing the punch needed for contemporary club systems.',
      creativeChallenge: 'Balancing the high dynamic peaks of traditional Nigerian bata and talking drums against subtle, breathy woodwind phrases while preserving absolute phase coherence.',
      studioRoom: 'Studio A · SSL 4000 G+ Live Room & Sightline',
      signalChain: [
        { stage: 'Acoustic Capture', hardware: 'Coles 4038 & Royer R-121 Ribbons', role: 'Blumlein pair for room ambience' },
        { stage: 'Preamplification', hardware: 'Neve 1073 DPD (Dual Channel)', role: 'Silky analog harmonic warmth' },
        { stage: 'Dynamics Control', hardware: 'Tube-Tech CL 1B Optical Compressor', role: 'Transparent peak control on lead sax' },
        { stage: 'Console Summing', hardware: 'Solid State Logic 4000 G+ 48-Channel', role: 'Analog bus glue and VCA punch' },
        { stage: 'Master Capture', hardware: 'Studer A800 2-Inch 24-Track Tape', role: 'Subtle 15 IPS magnetic tape compression' },
      ],
      sessionLog: [
        '22:00 — Room mic calibration using laser distance measurements to eliminate comb filtering.',
        '23:45 — Live take 4 selected for the master cut after spontaneous saxophone cadenza.',
        '02:15 — Analog tape pass through Studer A800 for natural 3rd-order harmonic saturation.',
      ],
      technicalSpecs: [
        { label: 'Sample Rate', value: '96 kHz / 24-bit PCM' },
        { label: 'Master Format', value: 'Stereo 1/2" Tape + Dolby Atmos Bed' },
        { label: 'Dynamic Range', value: 'DR12 (Preserved Acoustic Dynamics)' },
        { label: 'Monitoring', value: 'ATC SCM110ASL Pro Mains + Genelec 8351B' },
      ],
      stems: [
        { id: 'master', name: 'Full Analog Master', type: 'Stereo Print', frequencyNote: '48-channel SSL Bus' },
        { id: 'vocal', name: 'Sax & Lead Melody', type: 'Ribbon Stem', frequencyNote: 'Coles 4038 -> Neve 1073' },
        { id: 'drums', name: 'Talking Drum & Bata', type: 'Percussion Bed', frequencyNote: 'Phase-aligned room mics' },
        { id: 'bass', name: 'Moog Sub Bass Line', type: 'Analog Synth', frequencyNote: 'Moog Subsequent 37 DI' },
      ],
      galleryImages: [controlRoomImg, recordingRoomImg, productionLabImg],
    },
  },
  {
    id: 'proj-02',
    title: 'Analog Solitude',
    artist: 'Tomiwa & The Vault Quartet',
    category: 'Mix & Master',
    categorySlug: 'mix-master',
    duration: '4:15',
    year: '2026',
    bpm: 92,
    key: 'C major',
    image: masterSuiteImg,
    desktopSpan: 'col-span-12 lg:col-span-5',
    description: 'Direct-to-tape acoustic tracking captured on Studer A800 2-inch machine with pure outboard equalization.',
    caseStudy: {
      heroQuote: '"Every harmonic breath intact. Zero digital brickwalling. An homage to high-fidelity mastering."',
      overview: 'Mastering an intimate four-piece acoustic ensemble recorded in Lagos. The client requested a pristine, high-resolution master that sounds as lifelike on consumer airbuds as it does through reference mastering monitors.',
      creativeChallenge: 'Preserving the micro-dynamics of delicate nylon-string acoustic guitar while maintaining commercial loudness without harsh transient clipping.',
      studioRoom: 'Studio B · Analog Mastering Suite',
      signalChain: [
        { stage: 'D/A Conversion', hardware: 'Lavry Gold DA924', role: 'Ultra-linear analog reconstruction' },
        { stage: 'Mastering EQ', hardware: 'Manley Massive Passive Mastering Version', role: 'Air band boost at 27kHz and high-pass 22Hz' },
        { stage: 'Mastering Bus', hardware: 'Shadow Hills Mastering Compressor', role: 'Dual discrete & optical compression' },
        { stage: 'A/D Final Print', hardware: 'Lavry Quintessence AD122-96 MX', role: 'Pristine 96kHz archive digitization' },
      ],
      sessionLog: [
        '14:00 — Critical acoustic listening in the tuned mastering suite; identifying 240Hz boominess.',
        '15:30 — Discrete transformer stage selected on Shadow Hills for harmonic body.',
        '17:15 — Final M/S balance adjusted to widen natural acoustic room reflections.',
      ],
      technicalSpecs: [
        { label: 'Sample Rate', value: '192 kHz / 32-bit Float Master' },
        { label: 'Target Loudness', value: '-14.0 LUFS Integrated / -1.0 dBTP' },
        { label: 'Acoustic Room', value: 'Northward Acoustics FTB Certified' },
        { label: 'Delivery', value: 'Apple Digital Masters + DDP Image' },
      ],
      stems: [
        { id: 'master', name: 'Master Print (Lavry)', type: 'Master File', frequencyNote: 'Full Band Stereo' },
        { id: 'vocal', name: 'Lead Vocal Pass', type: 'Neumann U87', frequencyNote: 'Optical Tube Compressed' },
        { id: 'drums', name: 'Acoustic String Ensemble', type: 'Stereo Pair', frequencyNote: 'Schoeps Colette pair' },
        { id: 'bass', name: 'Upright Acoustic Bass', type: 'Mic + DI', frequencyNote: 'AKG D12 VR + Avalon U5' },
      ],
      galleryImages: [masterSuiteImg, controlRoomImg, vocalBoothImg],
    },
  },
  {
    id: 'proj-03',
    title: 'Electric Palm Grooves',
    artist: 'Lekki Modular Sessions',
    category: 'Original Productions',
    categorySlug: 'original-productions',
    duration: '3:18',
    year: '2026',
    bpm: 116,
    key: 'F# minor',
    image: productionLabImg,
    desktopSpan: 'col-span-12 lg:col-span-5',
    description: 'Moog One polyphonic synthesizer patches coupled with Akai MPC Live II polyrhythms and Roland Juno chorus.',
    caseStudy: {
      heroQuote: '"Afro-futurism rendered through discrete analog circuits and modular voltage control."',
      overview: 'Created inside the SonicVault Modular Production Lab, this production combines complex West African polyrhythms programmed on vintage drum samplers with sweeping Eurorack analog filters.',
      creativeChallenge: 'Synthesizing polyphonic analog chords that sit effortlessly around rapid-fire shaker rhythms without causing mid-range frequency clutter.',
      studioRoom: 'Studio C · Modular Production Lab',
      signalChain: [
        { stage: 'Synthesis', hardware: 'Moog One 16-Voice Analog Synth', role: 'Tri-timbral lush evolving pads' },
        { stage: 'Rhythm Engine', hardware: 'Akai MPC 3000 & Roland TR-808', role: 'Discrete analog drum hits' },
        { stage: 'Outboard Filter', hardware: 'Mutator Stereo Analog Filter', role: 'Dynamic envelope modulation' },
        { stage: 'Tape Echo', hardware: 'Roland RE-201 Space Echo (1978)', role: 'Spring reverb and tape flutter' },
      ],
      sessionLog: [
        '16:00 — Patch creation on the Moog One: combining saw waves with analog ladder lowpass.',
        '18:30 — Analog clock sync established between Eurorack modular and MPC.',
        '21:00 — Real-time filter sweep captured directly onto SSL stereo channel strip.',
      ],
      technicalSpecs: [
        { label: 'Synthesizers', value: 'Moog One, Prophet-10, Roland Juno-106' },
        { label: 'Clock Source', value: 'Antelope Audio 10MX Atomic Clock' },
        { label: 'Outboard FX', value: 'Eventide H9000 Harmonizer' },
        { label: 'Workflow', value: 'Hybrid Hardware & Ableton Live Suite' },
      ],
      stems: [
        { id: 'master', name: 'Production Stereo Mix', type: 'Full Track', frequencyNote: '116 BPM Sync' },
        { id: 'synth', name: 'Moog One Pad & Lead', type: 'Analog Poly', frequencyNote: 'Mutator Filtered' },
        { id: 'drums', name: '808 & MPC Polyrhythms', type: 'Drum Machine', frequencyNote: 'Punchy Transient' },
        { id: 'fx', name: 'Space Echo Reverb Tails', type: 'Analog Tape FX', frequencyNote: 'Tape Flutter 15 IPS' },
      ],
      galleryImages: [productionLabImg, controlRoomImg, recordingRoomImg],
    },
  },
  {
    id: 'proj-04',
    title: 'Silhouettes in Velvet',
    artist: 'Vault Chamber Sessions',
    category: 'Artist Sessions',
    categorySlug: 'artist-sessions',
    duration: '5:02',
    year: '2026',
    bpm: 88,
    key: 'A minor',
    image: artistMasterImg,
    desktopSpan: 'col-span-12 lg:col-span-7',
    description: '36-track multi-layered vocal arrangement tracked with Neumann U87 Ai and BAE 1073 preamplification.',
    caseStudy: {
      heroQuote: '"Intimacy so dense you can hear the moisture in the room and the silver shimmer of the capsule."',
      overview: 'An elaborate vocal showcase capturing an eight-member choir stacked across 36 individual vocal tracks in Vocal Booth 02. The focus was unmatched spatial depth, zero harsh sibilance, and creamy analog body.',
      creativeChallenge: 'Stacking dozens of vocal takes without accumulating digital harshness in the 3kHz–5kHz region or building up muddy lower-mid resonance.',
      studioRoom: 'Studio A · Floating Vocal Chamber 02',
      signalChain: [
        { stage: 'Microphone', hardware: 'Neumann U87 Ai (Gold Sputtered)', role: 'Cardioid vocal capsule precision' },
        { stage: 'Preamplifier', hardware: 'BAE 1073 Mic Preamp / EQ', role: 'Warm class-A transformer saturation' },
        { stage: 'Vocal Leveling', hardware: 'Teletronix LA-2A Vintage Optical', role: 'Smooth 2.5dB gain reduction' },
        { stage: 'De-Esser', hardware: 'BSS DPR-402 Dual Compressor/De-Esser', role: 'Frequency-selective sibilance tame' },
      ],
      sessionLog: [
        '11:00 — Capsule positioning test: 6 inches off-axis with dual-mesh Stedman pop filter.',
        '13:30 — Multi-part harmonies tracked in layers of four for stereo chorus spread.',
        '16:00 — Final composite vocal comp printed through the LA-2A leveling amplifier.',
      ],
      technicalSpecs: [
        { label: 'Vocal Tracks', value: '36 Tracks (Main, Doubles, 6-Part Harmony)' },
        { label: 'Room Acoustic', value: 'Floating Timber Floor, 0.22s RT60' },
        { label: 'Conversion', value: 'Burl Mothership B80 Dante' },
        { label: 'Mix Environment', value: 'Dolby Atmos 7.1.4 Immersive Bed' },
      ],
      stems: [
        { id: 'master', name: 'Immersive Vocal Mix', type: 'Stereo Bed', frequencyNote: '36 Tracks Summed' },
        { id: 'lead', name: 'Lead Solo Vocal (Dry)', type: 'Neumann U87', frequencyNote: 'LA-2A Leveled' },
        { id: 'choir', name: 'Harmonic Stack Beds', type: 'Stereo Spread', frequencyNote: 'L-R Panned 100%' },
        { id: 'room', name: 'Chamber Room Reflections', type: 'Binaural', frequencyNote: 'Natural RT60' },
      ],
      galleryImages: [artistMasterImg, vocalBoothImg, controlRoomImg],
    },
  },
  {
    id: 'proj-05',
    title: 'Obsidian Horizon',
    artist: 'Lagos Cinema & Kinetic Sound',
    category: 'Sound in Motion',
    categorySlug: 'sound-in-motion',
    duration: '2:45',
    year: '2026',
    bpm: 78,
    key: 'D minor',
    image: recordingRoomImg,
    desktopSpan: 'col-span-12 lg:col-span-6',
    description: 'Spatial audio branding, granular synthesis, and bespoke architectural foley for an international luxury campaign.',
    caseStudy: {
      heroQuote: '"Sound that defines physical architecture. Low-end weight that commands physical presence."',
      overview: 'Commissioned original sound design and audio logo for a luxury architectural firm. Recorded on location in Lekki and finished in our Dolby Atmos calibrated suite.',
      creativeChallenge: 'Designing sub-bass impacts that trigger tactile emotion on small mobile screens while shaking commercial theatre subwoofers cleanly.',
      studioRoom: 'Studio A & Dolby Atmos Mixing Suite',
      signalChain: [
        { stage: 'Field Foley', hardware: 'Sennheiser MKH 416 & Ambisonic Mic', role: 'High SPL concrete and metal textures' },
        { stage: 'Granular Engine', hardware: 'Tasty Chips GR-1 Hardware Synthesizer', role: 'Time-stretched kinetic clouds' },
        { stage: 'Sub Harmonic', hardware: 'dbx 120A Subharmonic Synthesizer', role: 'Tuned 30Hz architectural foundation' },
        { stage: 'Spatial Panning', hardware: 'Dolby Atmos Production Suite', role: 'Object-based 3D sound positioning' },
      ],
      sessionLog: [
        '09:00 — Ambisonic binaural capture of natural ocean breeze and concrete acoustic reverb.',
        '12:00 — Granular resynthesis using custom metallic sample libraries.',
        '15:30 — Multi-speaker calibration for spatial panning trajectory verification.',
      ],
      technicalSpecs: [
        { label: 'Format', value: 'Dolby Atmos ADM BWF + 5.1 Surround + Binaural' },
        { label: 'LFE Channel', value: 'Calibrated to 28Hz (-3dB point)' },
        { label: 'Spatial Objects', value: '24 Discrete Sound Objects' },
        { label: 'Compliance', value: 'EBU R128 & ATSC A/85 Compliant' },
      ],
      stems: [
        { id: 'master', name: 'Spatial Atmos Mixdown', type: 'Stereo Binaural', frequencyNote: 'Full 3D Soundfield' },
        { id: 'foley', name: 'Architectural Foley Bed', type: 'Ambisonic', frequencyNote: 'Concrete & Metal' },
        { id: 'sub', name: '30Hz Sub Impact Drone', type: 'LFE Channel', frequencyNote: 'dbx 120A Boosted' },
        { id: 'pads', name: 'Granular Atmosphere', type: 'Hardware Synth', frequencyNote: 'GR-1 Resynthesized' },
      ],
      galleryImages: [recordingRoomImg, productionLabImg, masterSuiteImg],
    },
  },
  {
    id: 'proj-06',
    title: 'Neon Lagos Pulse',
    artist: 'Afro-Electronic Sound Lab',
    category: 'Original Productions',
    categorySlug: 'original-productions',
    duration: '3:50',
    year: '2026',
    bpm: 124,
    key: 'G minor',
    image: vocalBoothImg,
    desktopSpan: 'col-span-12 lg:col-span-6',
    description: 'Stem mixing and hybrid analog summing combining syncopated highlife brass with punchy club low-end.',
    caseStudy: {
      heroQuote: '"The sweet spot where vintage Lagos highlife arrangements meet 2026 electronic festival sound."',
      overview: 'A high-energy club track featuring live trumpet, kalimba, and dual synth leads. Mastered using analog stem summing across eight stereo stems to preserve separation and headroom.',
      creativeChallenge: 'Maintaining the punchy transient response of modern 124 BPM club kicks while letting organic brass dynamics flourish without being pushed back in the mix.',
      studioRoom: 'Studio A & C Hybrid Workflow',
      signalChain: [
        { stage: 'Stem Processing', hardware: 'Dangerous 2-BUS+ 16-Channel Summing', role: 'Analog headroom and spatial width' },
        { stage: 'Bus EQ', hardware: 'Pultec EQP-1A Tube Equalizers (Matched Pair)', role: 'Low-end low-shelf boost at 60Hz' },
        { stage: 'VCA Limiting', hardware: 'Smart Research C2 Stereo Compressor', role: '"Crush" mode subtle parallel excitement' },
        { stage: 'Stereo Imaging', hardware: 'Dangerous BAX EQ', role: 'Smooth 70kHz broad shelf clarity' },
      ],
      sessionLog: [
        '10:30 — Brass stem cleanup and phase correlation check across stereo overheads.',
        '14:00 — Pultec 60Hz trick applied to round out electronic 808 kick drum.',
        '16:45 — Analog print to 1/2-inch tape at +6 over 185 nWb/m.',
      ],
      technicalSpecs: [
        { label: 'Summing', value: 'Dangerous 2-BUS+ 16-Ch Discrete' },
        { label: 'Clarity', value: 'Total Harmonic Distortion < 0.002%' },
        { label: 'Max Peak', value: '-0.3 dB True Peak' },
        { label: 'Master Bus', value: 'Smart Research C2 + Pultec Pair' },
      ],
      stems: [
        { id: 'master', name: 'Full Club Master', type: 'Stem Summed', frequencyNote: 'Analog Glued' },
        { id: 'brass', name: 'Live Highlife Brass', type: 'Ribbon Stereo', frequencyNote: 'Pultec Air Boost' },
        { id: 'kick', name: '808 Kick & Sub Punch', type: 'Low End Stem', frequencyNote: 'Tight 60Hz Curve' },
        { id: 'chords', name: 'Kalimba & Synth Arps', type: 'Mid Harmonics', frequencyNote: 'Dangerous BAX EQ' },
      ],
      galleryImages: [vocalBoothImg, masterSuiteImg, controlRoomImg],
    },
  },
];

interface SelectedWorkProps {
  onOpenBooking?: (service?: string) => void;
}

export default function SelectedWork({ onOpenBooking }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectRecord | null>(null);

  // Audio Playback State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Scroll parallax for section floating sonic geometry
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  const geomY1 = useTransform(smoothProgress, [0, 1], [-40, 60]);
  const geomY2 = useTransform(smoothProgress, [0, 1], [30, -50]);
  const waveformPhase = useTransform(smoothProgress, [0, 1], [0, 120]);

  // Audio toggle helper
  const handlePlayToggle = (project: ProjectRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (playingId === project.id) {
      setPlayingId(null);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setPlayingId(project.id);
      setPlaybackProgress(0);
      audioEngine.playClick();
      // Musical frequency chord matching project's key & tempo
      audioEngine.playTone(project.bpm * 2.2, 'sine', 1.8, 0.15);
      setTimeout(() => {
        audioEngine.playTone(project.bpm * 3.3, 'triangle', 2.2, 0.1);
      }, 140);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            setPlayingId(null);
            return 0;
          }
          return prev + 1;
        });
      }, 240);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Filter projects
  const filteredProjects = activeCategory === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.categorySlug === activeCategory);

  const categories = [
    { id: 'all', label: 'All Work', count: PROJECTS_DATA.length },
    { id: 'artist-sessions', label: 'Artist Sessions', count: PROJECTS_DATA.filter(p => p.categorySlug === 'artist-sessions').length },
    { id: 'original-productions', label: 'Original Productions', count: PROJECTS_DATA.filter(p => p.categorySlug === 'original-productions').length },
    { id: 'mix-master', label: 'Mix & Master', count: PROJECTS_DATA.filter(p => p.categorySlug === 'mix-master').length },
    { id: 'sound-in-motion', label: 'Sound in Motion', count: PROJECTS_DATA.filter(p => p.categorySlug === 'sound-in-motion').length },
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative py-28 sm:py-40 bg-[#0A0A0A] text-[#F5F5F3] overflow-hidden border-t border-white/10"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* 1. FLOATING SONIC GEOMETRY & SECTION OPENING */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Floating Geometric Squares (Field of 8 small geometric squares with parallax and vertical bobbing) */}
        <div className="relative h-24 sm:h-32 w-full pointer-events-none mb-6 overflow-hidden">
          {/* Fine Electric-Blue Waveform Line Moving Through Composition */}
          <svg className="absolute inset-0 w-full h-full stroke-[#4E85BF]/40" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <defs>
              <linearGradient id="sonicWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#89AACC" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#4E85BF" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#89AACC" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4E85BF" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,60 Q150,15 300,60 T600,60 T900,60 T1200,60"
              fill="none"
              stroke="url(#sonicWaveGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              style={{ x: waveformPhase }}
            />
            {/* Waveform Nodes / Sample Beats */}
            <circle cx="300" cy="60" r="3" fill="#89AACC" className="animate-ping opacity-75" />
            <circle cx="600" cy="60" r="4" fill="#4E85BF" />
            <circle cx="900" cy="60" r="3.5" fill="#89AACC" />
          </svg>

          {/* Square 1 */}
          <motion.div
            style={{ y: geomY1 }}
            className="absolute left-[8%] top-[20%] w-6 h-6 border border-[#89AACC]/40 bg-[#141414]/80 backdrop-blur-sm rotate-12 shadow-[0_0_15px_rgba(78,133,191,0.2)] animate-pulse"
          />
          {/* Square 2 */}
          <motion.div
            style={{ y: geomY2 }}
            className="absolute left-[24%] top-[55%] w-4 h-4 bg-[#89AACC]/30 border border-white/20 -rotate-6"
          />
          {/* Square 3 - Node on timeline */}
          <motion.div
            style={{ y: geomY1 }}
            className="absolute left-[38%] top-[38%] w-8 h-8 border border-[#4E85BF]/60 bg-black/60 rotate-45 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-[#89AACC] rounded-full" />
          </motion.div>
          {/* Square 4 */}
          <motion.div
            style={{ y: geomY2 }}
            className="absolute left-[54%] top-[15%] w-5 h-5 bg-[#141414] border border-white/15 rotate-12"
          />
          {/* Square 5 */}
          <motion.div
            style={{ y: geomY1 }}
            className="absolute left-[68%] top-[50%] w-7 h-7 border border-[#89AACC]/50 bg-[#141414]/90 -rotate-12 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-[#4E85BF]" />
          </motion.div>
          {/* Square 6 */}
          <motion.div
            style={{ y: geomY2 }}
            className="absolute left-[80%] top-[25%] w-4 h-4 bg-[#89AACC]/20 border border-white/25 rotate-6"
          />
          {/* Square 7 */}
          <motion.div
            style={{ y: geomY1 }}
            className="absolute left-[92%] top-[45%] w-6 h-6 border border-[#4E85BF]/40 bg-black/70 rotate-45"
          />
          {/* Square 8 */}
          <motion.div
            style={{ y: geomY2 }}
            className="absolute left-[48%] top-[70%] w-3 h-3 bg-[#4E85BF]/60 rounded-[1px]"
          />
        </div>

        {/* Section Heading & Editorial Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 pb-12 border-b border-white/10"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-[0.28em] text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>SELECTED WORK · SONICVAULT STUDIOS</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            {/* Main Editorial Heading */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.92] text-white">
              SOUND MADE <br />
              <span className="font-editorial normal-case font-normal text-[#89AACC] tracking-normal inline-block pr-2">
                into something
              </span> <br />
              TIMELESS.
            </h2>

            {/* Supporting Editorial Paragraph */}
            <div className="max-w-md space-y-4">
              <p className="text-sm sm:text-base text-[#858585] font-sans leading-relaxed">
                A look inside the recordings, productions, and creative processes that bring ideas to life inside our Lekki Phase 1 tracking and mixing rooms.
              </p>
              <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MASTER AUDIO READY</span>
                </span>
                <span className="text-white/20">|</span>
                <span>48-CH SSL & STUDER A800</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. CATEGORY FILTER TABS */}
        <div className="py-8 sm:py-10 flex flex-wrap items-center gap-2 sm:gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveCategory(cat.id as ProjectCategory);
                }}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/10 border border-[#89AACC]/60 shadow-[0_0_20px_rgba(78,133,191,0.25)]'
                    : 'text-[#858585] hover:text-white bg-white/[0.02] border border-white/5 hover:border-white/15'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#4E85BF] text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. CINEMATIC ASYMMETRICAL BENTO GRID */}
        <div className="grid grid-cols-12 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                isPlaying={playingId === project.id}
                playbackProgress={playbackProgress}
                onPlayToggle={(e) => handlePlayToggle(project, e)}
                onOpenCaseStudy={() => setSelectedCaseStudy(project)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. EXPANDABLE PROJECT CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <CaseStudyModal
            project={selectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
            onOpenBooking={(service) => {
              setSelectedCaseStudy(null);
              if (onOpenBooking) onOpenBooking(service);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ==========================================
// INDIVIDUAL PROJECT CARD WITH PIXEL-DISSOLVE & MAGNETIC SQUARES
// ==========================================
interface ProjectCardProps {
  project: ProjectRecord;
  index: number;
  isPlaying: boolean;
  playbackProgress: number;
  onPlayToggle: (e: React.MouseEvent) => void;
  onOpenCaseStudy: () => void;
}

function ProjectCard({
  project,
  index,
  isPlaying,
  playbackProgress,
  onPlayToggle,
  onOpenCaseStudy,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic geometric squares physics (Stiffness: 80, Damping: 18, Mass: 0.6)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 80, damping: 18, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Discrete magnetic square transforms
  const sq1X = useTransform(smoothX, [-150, 150], [-18, 18]);
  const sq1Y = useTransform(smoothY, [-150, 150], [-18, 18]);

  const sq2X = useTransform(smoothX, [-150, 150], [14, -14]);
  const sq2Y = useTransform(smoothY, [-150, 150], [14, -14]);

  const sq3X = useTransform(smoothX, [-150, 150], [-22, 22]);
  const sq3Y = useTransform(smoothY, [-150, 150], [10, -10]);

  const sq4X = useTransform(smoothX, [-150, 150], [16, -16]);
  const sq4Y = useTransform(smoothY, [-150, 150], [-12, 12]);

  const sq5X = useTransform(smoothX, [-150, 150], [-10, 10]);
  const sq5Y = useTransform(smoothY, [-150, 150], [18, -18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onOpenCaseStudy}
      className={`${project.desktopSpan} group relative rounded-3xl overflow-hidden border border-white/10 bg-[#141414]/90 hover:border-[#89AACC]/50 transition-all duration-500 flex flex-col justify-between cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.6)]`}
    >
      {/* Background Media Container */}
      <div className="relative aspect-[16/10] sm:aspect-auto sm:h-80 lg:h-96 w-full overflow-hidden bg-black">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter brightness-[0.78] contrast-[1.08] saturate-[1.05]"
        />

        {/* Film grain / dark vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/30 pointer-events-none" />

        {/* PIXEL-DISSOLVE HOVER EFFECT (12 Columns x 8 Rows = 96 Blocks) */}
        <div
          className="absolute inset-0 grid grid-cols-12 grid-rows-8 pointer-events-none z-10 p-1 gap-1"
          aria-hidden="true"
        >
          {Array.from({ length: 96 }).map((_, blockIdx) => {
            const row = Math.floor(blockIdx / 12);
            const col = blockIdx % 12;
            const diagonalScore = row + col; // 0 to 18
            const delayMs = diagonalScore * 14;

            return (
              <div
                key={blockIdx}
                style={{
                  transitionDelay: isHovered ? `${delayMs}ms` : `${(18 - diagonalScore) * 10}ms`,
                }}
                className={`w-full h-full rounded-[2px] transition-all duration-300 ease-out border ${
                  isHovered
                    ? 'opacity-85 scale-100 bg-[#0A0A0A]/95 border-[#89AACC]/30 shadow-[0_0_8px_rgba(78,133,191,0.2)]'
                    : 'opacity-0 scale-50 bg-transparent border-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Hidden Layer Revealed by Pixel Dissolve: Subtle Waveform Radar Visual */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 z-10 pointer-events-none ${
            isHovered ? 'opacity-90' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-[#89AACC]/40 text-[#89AACC] font-mono text-xs uppercase tracking-widest">
            <Maximize2 className="w-3.5 h-3.5 text-[#4E85BF] animate-pulse" />
            <span>EXPLORE CASE STUDY</span>
          </div>
        </div>

        {/* MAGNETIC GEOMETRIC SQUARES (5 Cursor-Reactive Floating Elements) */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {/* Square 1: Top Left Graphite */}
          <motion.div
            style={{ x: sq1X, y: sq1Y }}
            className="absolute top-8 left-8 w-5 h-5 bg-[#141414]/90 border border-white/20 rotate-12 backdrop-blur-sm transition-opacity duration-300"
          />
          {/* Square 2: Top Right Electric Blue Detail */}
          <motion.div
            style={{ x: sq2X, y: sq2Y }}
            className="absolute top-16 right-20 w-3.5 h-3.5 bg-[#4E85BF]/80 border border-[#89AACC] -rotate-6 shadow-[0_0_12px_rgba(78,133,191,0.5)]"
          />
          {/* Square 3: Center Node */}
          <motion.div
            style={{ x: sq3X, y: sq3Y }}
            className="absolute bottom-16 left-16 w-6 h-6 border border-[#89AACC]/60 bg-black/60 rotate-45 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-[#89AACC] rounded-full" />
          </motion.div>
          {/* Square 4: Bottom Right Soft Translucent */}
          <motion.div
            style={{ x: sq4X, y: sq4Y }}
            className="absolute bottom-12 right-14 w-4 h-4 bg-white/10 border border-white/25 rotate-12"
          />
          {/* Square 5: Muted Blue Node */}
          <motion.div
            style={{ x: sq5X, y: sq5Y }}
            className="absolute top-1/2 left-10 w-2.5 h-2.5 bg-[#89AACC]/70"
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between text-[11px] font-mono z-30 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[#89AACC] tracking-wider uppercase font-medium">
            {project.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-slate-300">
            {project.year}
          </span>
        </div>

        {/* Upper-Right Project Action Control Button */}
        <div className="absolute top-5 right-5 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCaseStudy();
            }}
            aria-label={`Open case study for ${project.title}`}
            className="w-11 h-11 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 hover:border-[#89AACC] hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 shadow-xl group/btn cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>

        {/* Floating Quick Play / Pause Button in Center */}
        <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
          <button
            type="button"
            onClick={onPlayToggle}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            className={`pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
              isPlaying
                ? 'accent-gradient text-white scale-110 shadow-[0_0_35px_rgba(78,133,191,0.6)]'
                : 'bg-black/80 hover:bg-white hover:text-black text-white border border-white/25 group-hover:scale-105'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Project Details & Integrated Waveform Bar */}
      <div className="p-6 sm:p-8 space-y-5 bg-[#0A0A0A] relative z-20 border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-[#858585] uppercase">
              {project.artist}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight group-hover:text-[#89AACC] transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#858585]">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{project.key}</span>
            <span>{project.bpm} BPM</span>
            <span>·</span>
            <span>{project.duration}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#858585] font-sans leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Waveform Scrubber & Session Bar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#858585]">
            <span className="flex items-center gap-2">
              <Disc3 className={`w-3.5 h-3.5 text-[#4E85BF] ${isPlaying ? 'animate-spin' : ''}`} />
              <span className={isPlaying ? 'text-[#89AACC] font-semibold' : ''}>
                {isPlaying ? 'PLAYING SESSION STEM' : 'STUDIO PREVIEW'}
              </span>
            </span>
            <span>{isPlaying ? `${playbackProgress}%` : project.duration}</span>
          </div>

          {/* Interactive Procedural Waveform Bars */}
          <div
            onClick={onPlayToggle}
            className="h-8 w-full bg-white/[0.03] rounded-lg p-1.5 flex items-end gap-1 cursor-pointer overflow-hidden border border-white/10 hover:border-[#89AACC]/40 transition-colors"
            title="Click to play studio preview"
          >
            {Array.from({ length: 36 }).map((_, barIdx) => {
              const baseHeight = 22 + Math.sin(barIdx * 0.45 + project.bpm * 0.05) * 50 + (barIdx % 4) * 10;
              const isBarActive = isPlaying && (barIdx / 36) * 100 <= playbackProgress;

              return (
                <div
                  key={barIdx}
                  style={{ height: `${Math.max(16, Math.min(100, baseHeight))}%` }}
                  className={`flex-1 rounded-sm transition-all duration-150 ${
                    isBarActive
                      ? 'accent-gradient'
                      : 'bg-[#141414] group-hover:bg-slate-700/60'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// FULL-FEATURED PROJECT CASE STUDY MODAL
// ==========================================
interface CaseStudyModalProps {
  project: ProjectRecord;
  onClose: () => void;
  onOpenBooking: (service?: string) => void;
}

function CaseStudyModal({ project, onClose, onOpenBooking }: CaseStudyModalProps) {
  const [activeStem, setActiveStem] = useState<string>('master');
  const [isStemPlaying, setIsStemPlaying] = useState<boolean>(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleStemSelect = (stemId: string) => {
    setActiveStem(stemId);
    audioEngine.playClick();
    audioEngine.playTone(project.bpm * 2.8, 'sine', 0.8, 0.12);
  };

  const handleToggleStemPlay = () => {
    setIsStemPlaying(!isStemPlaying);
    audioEngine.playClick();
    if (!isStemPlaying) {
      audioEngine.playTone(project.bpm * 2.2, 'triangle', 2.5, 0.15);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl z-40"
      />

      {/* Modal Container */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-50 w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0A0A0A] border border-white/15 text-[#F5F5F3] shadow-[0_25px_80px_rgba(0,0,0,0.9)] custom-scrollbar"
      >
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Case Study"
          className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:border-white text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-black">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

          {/* Hero Overlay Meta */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-[#4E85BF] text-white font-medium">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#89AACC]">
                {project.year} · {project.caseStudy.studioRoom}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-slate-300">
                {project.key} · {project.bpm} BPM
              </span>
            </div>

            <h1 id="case-study-title" className="text-3xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base font-mono text-[#89AACC]">
              Artist / Project: {project.artist}
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-10 space-y-12">
          {/* Hero Quote */}
          <blockquote className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-l-4 border-[#4E85BF] text-lg sm:text-2xl font-editorial text-white leading-relaxed">
            {project.caseStudy.heroQuote}
          </blockquote>

          {/* Overview & Creative Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#4E85BF]" />
                <span>SESSION OVERVIEW</span>
              </h4>
              <p className="text-sm text-[#858585] leading-relaxed font-sans">
                {project.caseStudy.overview}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#4E85BF]" />
                <span>THE CREATIVE CHALLENGE</span>
              </h4>
              <p className="text-sm text-[#858585] leading-relaxed font-sans">
                {project.caseStudy.creativeChallenge}
              </p>
            </div>
          </div>

          {/* Interactive Studio Stem Player */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-[#89AACC] flex items-center gap-2">
                  <AudioWaveform className="w-4 h-4 text-[#4E85BF]" />
                  <span>INTERACTIVE STEM BREAKDOWN</span>
                </span>
                <h4 className="text-xl font-bold text-white font-display">
                  Listen to the Acoustic Layers
                </h4>
              </div>
              <button
                onClick={handleToggleStemPlay}
                className="px-5 py-2.5 rounded-xl accent-gradient text-white text-xs font-mono font-semibold tracking-wider uppercase flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
              >
                {isStemPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isStemPlaying ? 'PAUSE STEM' : 'PLAY ACTIVE STEM'}</span>
              </button>
            </div>

            {/* Stem Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.caseStudy.stems.map((stem) => {
                const isSelected = activeStem === stem.id;
                return (
                  <button
                    key={stem.id}
                    onClick={() => handleStemSelect(stem.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-[#89AACC] shadow-[0_0_15px_rgba(78,133,191,0.3)]'
                        : 'bg-black/40 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#89AACC] block uppercase">
                      {stem.type}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white block truncate">
                      {stem.name}
                    </span>
                    <span className="text-[10px] text-[#858585] block mt-1">
                      {stem.frequencyNote}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* The Vault Signal Chain & Studio Gear Flow */}
          <div className="space-y-6 pt-4 border-t border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#89AACC] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#4E85BF]" />
                <span>THE VAULT SIGNAL CHAIN</span>
              </span>
              <h4 className="text-2xl font-bold text-white font-display">
                Analog Hardware & Processing Stages
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.caseStudy.signalChain.map((chain, cIdx) => (
                <div
                  key={cIdx}
                  className="p-4 rounded-xl bg-[#141414] border border-white/10 space-y-2 hover:border-[#89AACC]/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#89AACC]">
                    <span>STAGE 0{cIdx + 1}</span>
                    <span className="uppercase">{chain.stage}</span>
                  </div>
                  <h5 className="text-sm font-bold text-white font-sans">
                    {chain.hardware}
                  </h5>
                  <p className="text-xs text-[#858585] leading-relaxed">
                    {chain.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#89AACC]">
              TECHNICAL SPECIFICATIONS & DELIVERY
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.caseStudy.technicalSpecs.map((spec, sIdx) => (
                <div key={sIdx} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#858585] block">
                    {spec.label}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white block">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Log */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#89AACC]">
              CONTROL ROOM SESSION LOG
            </h4>
            <div className="space-y-2 font-mono text-xs text-[#858585]">
              {project.caseStudy.sessionLog.map((log, lIdx) => (
                <div key={lIdx} className="p-3 rounded-lg bg-[#141414] border border-white/5 flex items-start gap-3">
                  <Clock className="w-3.5 h-3.5 text-[#4E85BF] shrink-0 mt-0.5" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Footer inside Modal */}
          <div className="p-6 sm:p-8 rounded-2xl accent-gradient text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-2xl font-black font-display uppercase tracking-tight">
                CREATE YOUR SOUND AT SONICVAULT
              </h4>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg">
                Book a tracking, mixing, or production session in our Lekki Phase 1 studio with this exact analog workflow.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenBooking(project.category)}
                className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs sm:text-sm font-mono tracking-wider uppercase hover:bg-black hover:text-white transition-all cursor-pointer shadow-lg"
              >
                BOOK A SESSION LIKE THIS
              </button>
              <a
                href={`https://wa.me/2349015104502?text=Hello%20SonicVault%20Studios,%20I%20am%20interested%20in%20a%20session%20similar%20to%20your%20case%20study:%20${encodeURIComponent(project.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/30 text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                WHATSAPP ENQUIRY
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
