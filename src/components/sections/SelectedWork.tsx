import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Sparkles,
  ArrowUpRight,
  Disc3,
  Sliders,
  Maximize2,
  X,
  CheckCircle2,
  Radio,
  Music2,
  Mic,
  ArrowRight
} from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export type ProjectCategory = 'all' | 'artist-sessions' | 'original-productions' | 'mix-master' | 'sound-in-motion';

export interface ProjectRecord {
  id: string;
  title: string;
  artist: string;
  category: string;
  categorySlug: 'artist-sessions' | 'original-productions' | 'mix-master' | 'sound-in-motion';
  genre: string;
  type: string;
  duration: string;
  year: string;
  bpm: number;
  key: string;
  image: string;
  description: string;
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    audiomack?: string;
    boomplay?: string;
  };
  caseStudy: {
    heroQuote: string;
    overview: string;
    creativeChallenge: string;
    studioRoom: string;
    signalChain: { stage: string; hardware: string; role: string }[];
    sessionLog: string[];
    technicalSpecs: { label: string; value: string }[];
    stems: { id: string; name: string; type: string; frequencyNote: string }[];
  };
}

// 12 Authentic Genre Productions & Beat Instrumentals Synchronized with /api/portfolio & PortfolioPage
const PROJECTS_DATA: ProjectRecord[] = [
  {
    id: 'prj_afrobeats_sunrise',
    title: 'Lagos Sunrise (Afrobeats Anthem)',
    artist: 'Femi & The Groove Collective',
    category: 'Artist Sessions',
    categorySlug: 'artist-sessions',
    genre: 'Afrobeats',
    type: 'Recorded Song Demo',
    duration: '3:30',
    year: '2026',
    bpm: 106,
    key: 'E minor',
    image: '/assets/images/afrobeats_art_1792664025566.jpg',
    description: 'Uplifting 106 BPM Afrobeats anthem tracked through the Sony C-800G into Neve 1073 and Tube-Tech CL 1B. Resonant African log drum bounce, Kalimba plucks, and live Lagos brass section.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
      boomplay: 'https://boomplay.com',
    },
    caseStudy: {
      heroQuote: '"Capturing the kinetic bounce of modern Lagos through the silky precision of Sony C-800G and Neve saturation."',
      overview: 'Tracked in our vocal chamber and live room, pairing live African log percussion with stacked lead vocals and syncopated brass. Balanced for effortless translation across mobile earbuds and club sound systems.',
      creativeChallenge: 'Balancing resonant percussive log drums with high-presence lead vocal stacks while maintaining punchy 4-on-the-floor sub-bass.',
      studioRoom: 'The Vocal Booth & Analog Control Room',
      signalChain: [
        { stage: 'Vocal Tracking', hardware: 'Sony C-800G Tube Microphone', role: 'Silky modern top-end clarity' },
        { stage: 'Preamplification', hardware: 'Neve 1073SPX Discrete Preamp', role: 'Warm Class A harmonic saturation' },
        { stage: 'Vocal Leveling', hardware: 'Tube-Tech CL 1B Optical Compressor', role: 'Transparent peak leveling' },
        { stage: 'Console Summing', hardware: 'SSL AWS 948 Delta Console', role: 'SuperAnalogue bus glue & punch' },
        { stage: 'Master Print', hardware: 'Studer A800 2-Inch Tape', role: 'Subtle 15 IPS magnetic warmth' },
      ],
      sessionLog: [
        '14:00 — Sony C-800G placement with Stedman pop filter, gain staging through Neve 1073 at +45dB.',
        '16:30 — Live bata and talking drum tracking with matched Coles 4038 ribbon mics.',
        '19:45 — SSL G-Master bus pass with 2:1 ratio for punchy low-end glue.',
      ],
      technicalSpecs: [
        { label: 'Sample Rate', value: '96 kHz / 24-bit PCM' },
        { label: 'Dynamic Range', value: 'DR11 (Vibrant Modern Dynamics)' },
        { label: 'Summing', value: 'Solid State Logic AWS 948 Delta' },
        { label: 'Master Format', value: 'Stereo WAV + Apple Digital Master' },
      ],
      stems: [
        { id: 'master', name: 'Full Afrobeats Master', type: 'Stereo Print', frequencyNote: 'SSL 48-Ch Summed' },
        { id: 'vocal', name: 'Lead & Stacked Harmonies', type: 'Sony C-800G Stem', frequencyNote: 'Tube-Tech Leveled' },
        { id: 'drums', name: 'Log Drum & Afro Kick', type: 'Percussion Bed', frequencyNote: '106 BPM Bounce' },
        { id: 'brass', name: 'Live Horn Section', type: 'Ribbon Stereo', frequencyNote: 'Neve Saturated' },
      ],
    },
  },
  {
    id: 'prj_amapiano_kairo',
    title: 'Kairo Nights (Amapiano Heavyweight Beat)',
    artist: 'Nkosi & The Vault Sound System',
    category: 'Original Productions',
    categorySlug: 'original-productions',
    genre: 'Amapiano',
    type: 'Beat Instrumental',
    duration: '3:45',
    year: '2026',
    bpm: 112,
    key: 'D minor',
    image: '/assets/images/amapiano_art_1792664025996.jpg',
    description: 'South African Amapiano heavyweight production featuring deep resonant FM log-drum pitch glides, rolling triplet shakers, atmospheric Fender Rhodes 9th chords, and club-shaking sub-bass low-end translation.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
      audiomack: 'https://audiomack.com',
    },
    caseStudy: {
      heroQuote: '"A deep-rooted bass architecture where FM synthesis and acoustic shaker grooves command the dancefloor."',
      overview: 'Programmed inside The Production Lab using our Akai MPC Live II and Moog Subsequent 37. Designed with custom log drum pitch curves and wide Rhodes harmonies.',
      creativeChallenge: 'Sculpting pitch-gliding log drums that hit cleanly without masking low-mid keyboard chords or rumbling below 35Hz.',
      studioRoom: 'The Production Lab & Control Room',
      signalChain: [
        { stage: 'Groove Engine', hardware: 'Akai MPC Live II & Moog Subsequent 37', role: 'Rolling triplet swing & sub-bass' },
        { stage: 'Log Drum Sculpt', hardware: 'Custom FM Engine + Pultec EQP-1A', role: 'Low-end resonant weight boost at 60Hz' },
        { stage: 'Harmonic Coloring', hardware: 'Rupert Neve Designs MBT', role: 'Super Silk Red harmonics on keys' },
        { stage: 'Bus Dynamics', hardware: 'Shadow Hills Mastering Compressor', role: 'Dual discrete & optical glue' },
      ],
      sessionLog: [
        '15:00 — Log drum envelope shaping: tuned pitch-envelope decay at 112 BPM.',
        '17:30 — Fender Rhodes major 9th voicing layered with Roland Juno analog chorus.',
        '20:00 — Analog stem summing into SSL AWS 948 Delta console.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Key', value: '112 BPM · D minor' },
        { label: 'Sub-Bass Ext.', value: 'Flat down to 28 Hz' },
        { label: 'Summing Bus', value: 'Dangerous 2-BUS+ Discrete' },
        { label: 'Monitoring', value: 'Genelec 8351B SAM + 7380A Sub' },
      ],
      stems: [
        { id: 'master', name: 'Master Beat Print', type: 'Full Track', frequencyNote: 'Club Calibrated' },
        { id: 'logdrum', name: 'Amapiano Log Drums', type: 'Pitch Glides', frequencyNote: '35Hz - 180Hz Resonance' },
        { id: 'shakers', name: 'Rolling Triplet Shakers', type: 'Groove Bed', frequencyNote: 'Air Band Sparkle' },
        { id: 'chords', name: 'Rhodes & Juno Pads', type: 'Analog Poly', frequencyNote: 'Lush 9th Chords' },
      ],
    },
  },
  {
    id: 'prj_trap_phantom',
    title: 'Phantom Sub (Hip-Hop & Trap 808 Instrumental)',
    artist: 'Damian Pulse & The Trap Cell',
    category: 'Original Productions',
    categorySlug: 'original-productions',
    genre: 'Hip-Hop / Trap',
    type: 'Beat Instrumental',
    duration: '3:10',
    year: '2026',
    bpm: 140,
    key: 'A minor',
    image: '/assets/images/trap_808_art_1792664028250.jpg',
    description: 'Hard-hitting 140 BPM Trap instrumental sculpted with thunderous sliding 808 sub-bass glides, rapid 32nd hi-hat rolls, snapping trap snares, and dark minor analog bell chord progressions.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
      audiomack: 'https://audiomack.com',
    },
    caseStudy: {
      heroQuote: '"Aggressive 808 glides with analog punch that stays audible on phone speakers and tectonic in club rigs."',
      overview: 'Sculpted with the Moog Subsequent 37 paraphonic synth patched into a Tube-Tech CL 1B. Featuring rapid hat rolls and hard claps calibrated for vocal headroom.',
      creativeChallenge: 'Retaining sub-bass power down to 30Hz while ensuring 2nd and 3rd harmonic saturation for smaller mobile devices.',
      studioRoom: 'The Production Lab',
      signalChain: [
        { stage: '808 Synthesis', hardware: 'Moog Subsequent 37 Analog Synth', role: 'Analog pitch slides & sub tone' },
        { stage: 'Distortion & Grit', hardware: 'Thermionic Culture Vulture', role: 'Triode harmonic overtones' },
        { stage: 'Transients', hardware: 'Empirical Labs Distressor (1:1 Clean)', role: 'Snapping snare attack' },
        { stage: 'Limiting', hardware: 'Weiss DS1-MK3 Digital Limiter', role: 'True peak transparent loudness' },
      ],
      sessionLog: [
        '13:00 — Moog Subsequent 37 glide calibration for 140 BPM octave leaps.',
        '16:00 — Hi-hat roll programming with subtle humanized velocity swing.',
        '18:30 — True peak limiter test ensuring -0.5 dBTP compliance.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Key', value: '140 BPM · A minor' },
        { label: 'Sub Saturation', value: 'Thermionic Culture Vulture' },
        { label: 'Loudness Target', value: '-8.5 LUFS Integrated' },
        { label: 'Channel Frame', value: 'Discrete Analog Stems' },
      ],
      stems: [
        { id: 'master', name: 'Master Beat Mix', type: 'Stereo Master', frequencyNote: '140 BPM Hard Trap' },
        { id: 'bass', name: 'Sliding 808 Sub-Bass', type: 'Moog Synth', frequencyNote: 'Harmonic Enriched' },
        { id: 'drums', name: 'Trap Snares & 32nd Hats', type: 'Drum Machine', frequencyNote: 'Distressor Punch' },
        { id: 'melody', name: 'Dark Bell Arpeggio', type: 'Analog Lead', frequencyNote: 'Space Echo Reverb' },
      ],
    },
  },
  {
    id: 'prj_reggae_heatwave',
    title: 'Kingston Heatwave (Reggae Dancehall & Dub)',
    artist: 'High Pressure Sound System',
    category: 'Mix & Master',
    categorySlug: 'mix-master',
    genre: 'Reggae Dancehall',
    type: 'Recorded Song Demo',
    duration: '3:50',
    year: '2026',
    bpm: 96,
    key: 'G minor',
    image: '/assets/images/reggae_dub_art_1792664027104.jpg',
    description: 'Authentic 96 BPM Kingston-style Reggae Dancehall dub session. Authentic one-drop drums, sharp staccato offbeat guitar and organ skanks, deep dub sub-bass, and analog spring reverb tape echo throws.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
      audiomack: 'https://audiomack.com',
    },
    caseStudy: {
      heroQuote: '"One-drop roots drums and vintage Roland tape echo creating an hypnotic, chest-rattling dub expanse."',
      overview: 'Recorded live in the main recording room with Shure SM7B on guitar amplifiers and Coles 4038 ribbon mics on drums. Summed through vintage Roland RE-201 tape echoes and spring reverbs.',
      creativeChallenge: 'Creating lush space and deep sub-bass without muddling the sharp offbeat rhythm chop essential to dancehall.',
      studioRoom: 'The Live Recording Room & Mastering Suite',
      signalChain: [
        { stage: 'Acoustic Capture', hardware: 'Coles 4038 & Royer R-121 Ribbons', role: 'Warm drum and organ tracking' },
        { stage: 'Dub FX Send', hardware: 'Roland RE-201 Space Echo (1978)', role: 'Analog tape delay feedback & spring' },
        { stage: 'Sub Sculpting', hardware: 'Pultec EQP-1A Tube EQ Pair', role: 'Low shelf warm boost at 60Hz' },
        { stage: 'Tape Summing', hardware: 'Studer A800 2-Inch 24-Track Tape', role: 'Natural tape compression at 15 IPS' },
      ],
      sessionLog: [
        '11:00 — Live one-drop drum tuning: deadened snare with vintage tea towel.',
        '14:30 — Live dub mixing: manually riding RE-201 echo feedback sends on the SSL faders.',
        '17:00 — Print to 1/2-inch ATR master tape at +6 over 185 nWb/m.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Style', value: '96 BPM · One-Drop Reggae Dub' },
        { label: 'Tape Format', value: 'Studer A800 2" 24-Track' },
        { label: 'Dub Effects', value: 'Roland RE-201 + AKG BX20 Spring' },
        { label: 'Dynamic Range', value: 'DR12 Uncompressed Punch' },
      ],
      stems: [
        { id: 'master', name: 'Master Dub Version', type: 'Tape Master', frequencyNote: 'Studer A800 Print' },
        { id: 'drums', name: 'One-Drop Acoustic Kit', type: 'Ribbon Stem', frequencyNote: 'Deadened Snare' },
        { id: 'bass', name: 'Deep Dub Electric Bass', type: 'DI & Tube Amp', frequencyNote: 'Sub-Harmonic Foundation' },
        { id: 'skank', name: 'Guitar & Organ Skanks', type: 'Offbeat Chop', frequencyNote: 'Space Echo Fed' },
      ],
    },
  },
  {
    id: 'prj_jazz_bluenote',
    title: 'Blue Note Lekki (Acoustic Jazz Quartet)',
    artist: 'The Authentics Jazz Quartet',
    category: 'Sound in Motion',
    categorySlug: 'sound-in-motion',
    genre: 'Jazz',
    type: 'Recorded Song Demo',
    duration: '4:20',
    year: '2026',
    bpm: 120,
    key: 'C major / D minor',
    image: '/assets/images/jazz_blue_art_1792664042317.jpg',
    description: 'Recorded live in our acoustically tuned live room with Coles 4038 ribbon microphones. Features acoustic upright walking double bass, classic swung ride cymbal tap, warm Rhodes II-V-I chords, and muted saxophone phrasing.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
    },
    caseStudy: {
      heroQuote: '"Every harmonic breath, upright bass pluck, and ride cymbal ping captured with pure acoustic intimacy."',
      overview: 'Four-piece jazz ensemble recorded simultaneously in the live room with zero headphones to encourage natural musical communication and acoustic bleed.',
      creativeChallenge: 'Balancing bleed across live microphones into a coherent, gorgeous stereo soundstage with pinpoint spatial imaging.',
      studioRoom: 'The Live Recording Room',
      signalChain: [
        { stage: 'Blumlein Room Pair', hardware: 'Coles 4038 Matched Ribbon Pair', role: 'Acoustic ensemble room stereo' },
        { stage: 'Upright Bass', hardware: 'Neumann U87 Ai + Avalon U5 DI', role: 'Deep acoustic body and string click' },
        { stage: 'Saxophone', hardware: 'Royer R-121 Studio Ribbon', role: 'Warm, non-fatiguing brass tone' },
        { stage: 'Master Capture', hardware: 'Lavry Gold DA924 & AD122-96 MX', role: 'Pristine 192kHz digitization' },
      ],
      sessionLog: [
        '10:00 — Room acoustic laser alignment to nullify phase interference.',
        '12:30 — Live take 3 selected for master cut after spontaneous muted sax solo.',
        '15:00 — Pure passive mastering EQ with Manley Massive Passive.',
      ],
      technicalSpecs: [
        { label: 'Sample Rate', value: '192 kHz / 32-bit Float' },
        { label: 'Microphones', value: 'Coles 4038, Neumann U87, Royer R-121' },
        { label: 'Room Acoustic', value: '0.24s RT60 Tuned Live Room' },
        { label: 'Mastering', value: 'Manley Massive Passive + Lavry Gold' },
      ],
      stems: [
        { id: 'master', name: 'Master Acoustic Cut', type: 'Live Stereo', frequencyNote: 'Natural RT60 Room' },
        { id: 'sax', name: 'Tenor Saxophone (Muted)', type: 'Royer Ribbon', frequencyNote: 'Silky Warmth' },
        { id: 'bass', name: 'Upright Walking Bass', type: 'Acoustic Mic+DI', frequencyNote: 'Warm Wood Tone' },
        { id: 'drums', name: 'Swung Ride & Brushes', type: 'Overhead Pair', frequencyNote: 'Air Dynamics' },
      ],
    },
  },
  {
    id: 'prj_funk_groove',
    title: 'Golden Groove (1970s Slap Funk Production)',
    artist: 'The Golden Groove Orchestra',
    category: 'Original Productions',
    categorySlug: 'original-productions',
    genre: 'Funk',
    type: 'Beat & Recorded Jam',
    duration: '3:35',
    year: '2026',
    bpm: 108,
    key: 'E Dorian',
    image: '/assets/images/funk_groove_art_1792664043953.jpg',
    description: 'High-octane 1970s slap funk production driven by syncopated thumb-slap bass and string pops, rhythmic wah-style guitar chops, crisp acoustic snare on 2 and 4, and dynamic brass horn stabs.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
    },
    caseStudy: {
      heroQuote: '"Vintage 1970s American funk grit engineered through modern SSL precision and 1176 peak limiting."',
      overview: 'Conceived in The Production Lab and cut in the live room, pairing slap bass with wah-wah rhythm guitars and punchy analog brass.',
      creativeChallenge: 'Keeping rapid-fire slap bass transients punchy without overloading the analog mix bus.',
      studioRoom: 'The Production Lab & Control Room',
      signalChain: [
        { stage: 'Slap Bass Tracking', hardware: 'Universal Audio 1176LN Rev D', role: 'Fast 20-microsecond peak catch' },
        { stage: 'Funk Guitars', hardware: 'Neve 1073SPX + Crybaby Wah', role: 'Cutting funk rhythm bite' },
        { stage: 'Drum Punch', hardware: 'Empirical Labs Distressor', role: 'Crisp acoustic snare slap' },
        { stage: 'Console Mix', hardware: 'SSL AWS 948 Delta Console', role: 'Tight VCA bus compression' },
      ],
      sessionLog: [
        '14:00 — Bass gain staging: dual DI + Ampeg tube amp tracking.',
        '16:30 — Live horn section tracking: trumpet & tenor sax double-tracked.',
        '19:00 — SSL console mixdown with 4:1 bus compressor setting.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Groove', value: '108 BPM · E Dorian Funk' },
        { label: 'Bass Chain', value: '1176LN Rev D -> Pultec EQP-1A' },
        { label: 'Console', value: 'SSL AWS 948 Delta SuperAnalogue' },
        { label: 'Master Format', value: '96 kHz / 24-bit Stereo Master' },
      ],
      stems: [
        { id: 'master', name: 'Master Funk Print', type: 'Full Track', frequencyNote: 'SSL Glued' },
        { id: 'bass', name: 'Thumb Slap & Pop Bass', type: '1176 Compressed', frequencyNote: 'Punchy Transients' },
        { id: 'guitar', name: 'Wah Guitar Chops', type: 'Class A DI', frequencyNote: 'Syncopated Chops' },
        { id: 'horns', name: 'Funk Horn Stabs', type: 'Brass Section', frequencyNote: 'Neve Saturated' },
      ],
    },
  },
  {
    id: 'prj_soul_velvet',
    title: 'Velvet Heartstrings (Classic Motown Soul)',
    artist: 'Ashley Monique & Soul Keys',
    category: 'Artist Sessions',
    categorySlug: 'artist-sessions',
    genre: 'Soul',
    type: 'Recorded Song Demo',
    duration: '4:05',
    year: '2026',
    bpm: 76,
    key: 'B♭ major',
    image: '/assets/images/soul_motown_art_1792664052822.jpg',
    description: 'Deep Motown soul session captured on the Neumann U87 Ai through vintage Teletronix LA-2A optical compression. Features warm flat-wound electric bass, vintage Fender Rhodes vibrato, lush string pads, and emotive vocal runs.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
    },
    caseStudy: {
      heroQuote: '"Intimate vocal warmth that puts the listener right next to the microphone in our floating chamber."',
      overview: 'Recorded in our acoustic vocal chamber, capturing silky vocal timbres across four octaves accompanied by vintage Rhodes piano.',
      creativeChallenge: 'Maintaining intimacy on whisper vocals while smoothly handling powerful climactic belted notes without harshness.',
      studioRoom: 'The Vocal Booth & Mastering Suite',
      signalChain: [
        { stage: 'Vocal Mic', hardware: 'Neumann U87 Ai (Gold Sputtered)', role: 'Pristine vocal fidelity' },
        { stage: 'Preamplifier', hardware: 'Neve 1073SPX Discrete Preamp', role: 'Velvety lower-mid body' },
        { stage: 'Leveling', hardware: 'Teletronix LA-2A Vintage Opto', role: 'Effortless 3dB optical smoothing' },
        { stage: 'Mastering EQ', hardware: 'Manley Massive Passive Tube EQ', role: 'Silky air band boost at 20kHz' },
      ],
      sessionLog: [
        '11:00 — Vocalist mic positioning: 8 inches off-axis for intimate proximity effect.',
        '14:00 — 4-part vocal harmonies stacked across 16 tracks.',
        '16:30 — LA-2A optical leveling applied for buttery vocal dynamics.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Key', value: '76 BPM · B♭ major' },
        { label: 'Vocal Chain', value: 'Neumann U87 -> Neve 1073 -> LA-2A' },
        { label: 'Reverb Space', value: 'Bricasti M7 True Stereo Reverb' },
        { label: 'Target Loudness', value: '-14 LUFS Integrated' },
      ],
      stems: [
        { id: 'master', name: 'Master Soul Mix', type: 'Full Master', frequencyNote: 'Analog Warmth' },
        { id: 'vocal', name: 'Lead Emotive Vocal', type: 'Neumann U87', frequencyNote: 'LA-2A Leveled' },
        { id: 'keys', name: 'Fender Rhodes Mk I', type: 'Suitcase Vib.', frequencyNote: 'Stereo Tremolo' },
        { id: 'bass', name: 'Flatwound Motown Bass', type: 'P-Bass DI', frequencyNote: 'Warm Low End' },
      ],
    },
  },
  {
    id: 'prj_drill_brixton',
    title: 'Brixton Nocturne (UK Drill Rap Type Beat)',
    artist: 'SonicVault Beat Lab',
    category: 'Original Productions',
    categorySlug: 'original-productions',
    genre: 'UK Drill',
    type: 'Beat Instrumental',
    duration: '3:05',
    year: '2026',
    bpm: 142,
    key: 'C minor',
    image: '/assets/images/uk_drill_art_1792664053119.jpg',
    description: 'Gritty 142 BPM UK Drill rap type beat built around signature sliding octave pitch-glide 808 basslines, syncopated triplet hi-hat skips, hard offbeat counter-snares, and dark gothic minor piano stabs.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
    },
    caseStudy: {
      heroQuote: '"Sliding pitch octaves and dark minor piano stabs engineered for razor-sharp vocal flow."',
      overview: 'Engineered specifically for hard drill flows with aggressive sliding 808 bass octaves, counter-snare syncopation, and eerie piano loops.',
      creativeChallenge: 'Balancing extreme 808 pitch glides across two octaves without losing punch or interfering with vocal frequencies.',
      studioRoom: 'The Production Lab',
      signalChain: [
        { stage: '808 Pitch Glides', hardware: 'Moog Subsequent 37 + DSP Pitch Glide', role: 'Extreme octave slide curves' },
        { stage: 'Percussion Punch', hardware: 'SSL 4000 G+ Channel Dynamics', role: 'Cracked counter-snares & rims' },
        { stage: 'Gothic Piano', hardware: 'Steinway Model D Grand Sample -> Tape', role: 'Detuned tape flutter texture' },
        { stage: 'Master Bus', hardware: 'SSL AWS 948 VCA Compressor', role: 'VCA clamp with fast recovery' },
      ],
      sessionLog: [
        '16:00 — Octave glide tuning: fine-tuning portamento time at 142 BPM.',
        '18:30 — Counter-snare pocket alignment and subtle stereo widening.',
        '21:00 — Master print with high-frequency drill crispness.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Key', value: '142 BPM · C minor' },
        { label: 'Hi-Hat Style', value: 'Triplet skips & pitch drops' },
        { label: 'Sub-Bass Range', value: 'Moog 808 Glide 32Hz - 130Hz' },
        { label: 'Loudness Target', value: '-8.0 LUFS Competitive Beat' },
      ],
      stems: [
        { id: 'master', name: 'Master Drill Beat', type: 'Full Beat', frequencyNote: '142 BPM Hard Drill' },
        { id: '808', name: 'Sliding Octave 808s', type: 'Moog Glide', frequencyNote: 'Aggressive Slides' },
        { id: 'percs', name: 'Counter-Snares & Hats', type: 'Drill Drum Bed', frequencyNote: 'Triplet Skips' },
        { id: 'piano', name: 'Gothic Minor Piano', type: 'Detuned Tape', frequencyNote: 'C Minor Stabs' },
      ],
    },
  },
  {
    id: 'prj_highlife_palmwine',
    title: 'Palmwine Serenade (West African Highlife)',
    artist: 'The African Sound Makers',
    category: 'Artist Sessions',
    categorySlug: 'artist-sessions',
    genre: 'Highlife',
    type: 'Recorded Song Demo',
    duration: '3:48',
    year: '2026',
    bpm: 114,
    key: 'F major',
    image: '/assets/images/highlife_art_1792664079837.jpg',
    description: 'Timeless West African highlife celebration tracking dual clean interlocking guitars, traditional talking drums with real-time pitch bends, joyful live brass section harmonies, and buoyant melodic bass.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
      boomplay: 'https://boomplay.com',
    },
    caseStudy: {
      heroQuote: '"Interlocking clean guitar lines and joyous live brass capturing the spirit of classic Nigerian highlife."',
      overview: 'Recorded live in Studio A, showcasing the intricate call-and-response between lead guitar, rhythm guitar, talking drums, and brass.',
      creativeChallenge: 'Maintaining phase coherence across multiple guitar microphones and live percussion while preserving acoustic sparkle.',
      studioRoom: 'The Live Recording Room',
      signalChain: [
        { stage: 'Highlife Guitars', hardware: 'Shure SM7B + Royer R-121 Pair', role: 'Crisp, bell-like clean chime' },
        { stage: 'Talking Drums', hardware: 'Neve 1073SPX Preamplifier', role: 'Warm pitch-bending resonance' },
        { stage: 'Brass Section', hardware: 'Coles 4038 Ribbon Blumlein', role: 'Classic warm horn body' },
        { stage: 'Tape Glue', hardware: 'Studer A800 2-Inch Tape Machine', role: 'Silky analog highlife warmth' },
      ],
      sessionLog: [
        '10:30 — Dual guitar phase alignment using stereo vectorscope.',
        '13:00 — Talking drum pitch bend takes captured live with artist eye contact.',
        '16:00 — Studer tape pass at 15 IPS for warm low-end saturation.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Key', value: '114 BPM · F major' },
        { label: 'Instrumentation', value: 'Dual Guitars, Talking Drum, Brass, Bass' },
        { label: 'Tape Format', value: 'Studer A800 2" Tape Master' },
        { label: 'Dynamic Range', value: 'DR12 Acoustic Translation' },
      ],
      stems: [
        { id: 'master', name: 'Master Highlife Cut', type: 'Tape Master', frequencyNote: 'Studer Tape Print' },
        { id: 'guitars', name: 'Interlocking Guitars', type: 'Clean Stereo Pair', frequencyNote: 'Chime & Sparkle' },
        { id: 'percs', name: 'Talking Drums & Claves', type: 'Live Percussion', frequencyNote: 'Pitch Bends' },
        { id: 'brass', name: 'Joyful Brass Harmonies', type: 'Ribbon Stem', frequencyNote: 'Warm Horns' },
      ],
    },
  },
  {
    id: 'prj_rock_overdrive',
    title: 'Overdrive Anthem (Modern Alt-Rock Production)',
    artist: 'The High Voltage Recordings',
    category: 'Mix & Master',
    categorySlug: 'mix-master',
    genre: 'Rock',
    type: 'Recorded Song Demo',
    duration: '3:32',
    year: '2026',
    bpm: 128,
    key: 'D major',
    image: '/assets/images/rock_overdrive_art_1792664080054.jpg',
    description: 'Energetic modern rock production featuring overdriven Marshall tube power chords, driving acoustic drum kit, crash cymbal wash, aggressive picked bassline, and soaring alternative rock vocals.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
    },
    caseStudy: {
      heroQuote: '"Wall-of-sound Marshall tube power chords paired with punchy acoustic drums that crack like thunder."',
      overview: 'Tracked in our live room with high SPL microphones on guitar cabinets and drum room mics, then mixed with aggressive analog compression.',
      creativeChallenge: 'Preserving drum punch and clarity through dense walls of distorted electric guitars.',
      studioRoom: 'The Live Recording Room & Control Room',
      signalChain: [
        { stage: 'Amp Tracking', hardware: 'Shure SM7B + Royer R-121 on Marshall 4x12', role: 'Crushing rock guitar roar' },
        { stage: 'Drum Rooms', hardware: 'Coles 4038 Ribbon Blumlein Pair', role: 'Massive acoustic room wash' },
        { stage: 'Bass Slam', hardware: 'Empirical Labs Distressor (10:1 Opto)', role: 'Aggressive picked bass grind' },
        { stage: 'Mix Bus', hardware: 'Smart Research C2 Stereo Compressor', role: 'Crush mode punch & bite' },
      ],
      sessionLog: [
        '14:00 — Marshall JCM800 tube amp bias check and mic phase verification.',
        '16:30 — Live drum tracking with heavy rimshots on Dunnett snare.',
        '19:30 — Smart C2 bus compressor applied for cohesive rock glue.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Key', value: '128 BPM · D major' },
        { label: 'Guitar Amplifiers', value: 'Marshall JCM800 + Vox AC30' },
        { label: 'Mix Bus', value: 'Smart Research C2 + Neve MBT' },
        { label: 'Mastering Target', value: '-9.5 LUFS Integrated Rock' },
      ],
      stems: [
        { id: 'master', name: 'Full Rock Master', type: 'Stereo Master', frequencyNote: 'High Voltage Rock' },
        { id: 'guitars', name: 'Overdriven Power Chords', type: 'Marshall Wall', frequencyNote: 'SM7B + Royer Pair' },
        { id: 'drums', name: 'Acoustic Rock Drums', type: 'Live Room Kit', frequencyNote: 'Distressor Smashed' },
        { id: 'vocals', name: 'Soaring Rock Lead', type: 'Vocal Stem', frequencyNote: '1176 Slammed' },
      ],
    },
  },
  {
    id: 'prj_pop_neon',
    title: 'Neon Starlight (Synthpop & Pop Radio Single)',
    artist: 'Luna Velocity',
    category: 'Mix & Master',
    categorySlug: 'mix-master',
    genre: 'Pop',
    type: 'Beat & Vocal Master',
    duration: '3:15',
    year: '2026',
    bpm: 122,
    key: 'F# minor / A major',
    image: '/assets/images/pop_synth_art_1792664081110.jpg',
    description: 'Polished radio-ready commercial pop anthem featuring four-on-the-floor dance kick, sidechained pumping synth bass, shimmering saw-synth poly-chords, crisp digital handclaps, and infectious synthpop arpeggios.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
      boomplay: 'https://boomplay.com',
    },
    caseStudy: {
      heroQuote: '"Crystal-clear radio sheen: sidechained pumping analog basslines and glittering 1980s synth hooks."',
      overview: 'Collaborative commercial pop production pairing 122 BPM dance grooves with modern vocal tuning and wide stereo spatial effects.',
      creativeChallenge: 'Creating aggressive sidechain pump without sacrificing vocal clarity or causing low-end pumping artifacts.',
      studioRoom: 'The Vocal Booth & Mastering Suite',
      signalChain: [
        { stage: 'Pop Vocal Lead', hardware: 'Sony C-800G PAC Tube Microphone', role: 'Ultra-crisp radio pop vocal' },
        { stage: 'Synthesizers', hardware: 'Sequential Prophet-10 & Moog Subsequent', role: 'Analog saw chords & arps' },
        { stage: 'Mix Summing', hardware: 'SSL AWS 948 Delta Console', role: 'Commercial separation & sheen' },
        { stage: 'Master Bus', hardware: 'Rupert Neve Designs MBT + Weiss Limiter', role: 'Super Silk Blue stereo width' },
      ],
      sessionLog: [
        '13:30 — Vocal tracking: 24-track pop vocal stack comped to perfection.',
        '16:00 — Sidechain envelope calibration for pump vs transient punch.',
        '18:30 — Neve MBT Super Silk pass for modern radio high-end air.',
      ],
      technicalSpecs: [
        { label: 'Tempo & Key', value: '122 BPM · F# minor / A major' },
        { label: 'Vocal Chain', value: 'Sony C-800G -> Neve 1073 -> CL 1B' },
        { label: 'Analog Synthesizers', value: 'Prophet-10, Roland Juno, Moog' },
        { label: 'Loudness Target', value: '-8.0 LUFS Radio Master' },
      ],
      stems: [
        { id: 'master', name: 'Commercial Pop Master', type: 'Radio Print', frequencyNote: 'SSL SuperAnalogue' },
        { id: 'vocals', name: 'Pop Vocal Lead & Stacks', type: 'Sony C-800G', frequencyNote: 'Tuned & Polished' },
        { id: 'synths', name: 'Saw Chords & Arpeggio', type: 'Prophet-10', frequencyNote: 'Lush Stereo Spread' },
        { id: 'drums', name: 'Pop Dance Kick & Claps', type: 'Drum Machine', frequencyNote: 'Sidechained Pumping' },
      ],
    },
  },
  {
    id: 'prj_rnb_midnight',
    title: 'Midnight Satin (Intimate R&B & Neo-Soul Session)',
    artist: 'Ashley Monique & K-Sonic',
    category: 'Sound in Motion',
    categorySlug: 'sound-in-motion',
    genre: 'R&B / Neo-Soul',
    type: 'Recorded Song Demo',
    duration: '3:45',
    year: '2026',
    bpm: 82,
    key: 'D♭ major 9',
    image: '/assets/images/rnb_neosoul_art_1792664081553.jpg',
    description: 'Sensual 82 BPM R&B / Neo-Soul showcase tracked in Dolby Atmos. Features Fender Rhodes major 9th chords, unhurried pocket drums with rim clicks, warm sub-bass, and silky smooth multi-track vocal harmonies.',
    streamingLinks: {
      spotify: 'https://open.spotify.com',
      appleMusic: 'https://music.apple.com',
    },
    caseStudy: {
      heroQuote: '"Sensual, unhurried pocket drums and lush major 9th chord movements enveloped in 7.1.4 spatial audio."',
      overview: 'Conceived in our Dolby Atmos mixing suite, crafting an immersive vocal tapestry with subtle binaural movement and silky neo-soul chords.',
      creativeChallenge: 'Balancing deep 808 sub-bass warmth with delicate acoustic vocal harmonies in a spatial 3D audio soundfield.',
      studioRoom: 'Dolby Atmos 7.1.4 Certified Mix Suite',
      signalChain: [
        { stage: 'Spatial Vocal', hardware: 'Sennheiser AMBEO VR & Sony C-800G', role: 'Binaural 3D vocal intimacy' },
        { stage: 'Keys & Pads', hardware: 'Fender Rhodes Mk I + Prophet-10', role: 'Warm neo-soul 9th chords' },
        { stage: 'Low End', hardware: 'Moog Subsequent 37 DI', role: 'Warm analog sub-bass foundation' },
        { stage: 'Atmos Authoring', hardware: 'Dolby Atmos Mastering Suite RMU', role: '7.1.4 object-based immersive bed' },
      ],
      sessionLog: [
        '15:00 — Binaural microphone calibration for 3D spatial vocal intimacy.',
        '17:30 — Fender Rhodes major 9th chord progression tracked through LA-2A.',
        '20:00 — Dolby Atmos 7.1.4 speaker alignment and binaural headphone render check.',
      ],
      technicalSpecs: [
        { label: 'Format', value: 'Dolby Atmos ADM BWF 96kHz / 24-bit + Stereo' },
        { label: 'Tempo & Key', value: '82 BPM · D♭ major 9' },
        { label: 'Monitoring', value: 'Genelec SAM 7.1.4 Immersive Array' },
        { label: 'Headphone Render', value: 'Binaural with Spatial Head Tracking' },
      ],
      stems: [
        { id: 'master', name: 'Dolby Atmos Spatial Print', type: 'Atmos ADM Bed', frequencyNote: '7.1.4 Spatial Mix' },
        { id: 'vocals', name: 'Multi-Track Neo-Soul Stacks', type: 'Binaural Stem', frequencyNote: 'Silky Harmonies' },
        { id: 'rhodes', name: 'Fender Rhodes Major 9ths', type: 'Vintage Keys', frequencyNote: 'Analog Tremolo' },
        { id: 'pocket', name: 'Unhurried Rim & Sub Kick', type: 'Acoustic Pocket', frequencyNote: '82 BPM Swing' },
      ],
    },
  },
];

const GENRE_FILTERS = [
  'ALL GENRES',
  'Afrobeats',
  'Amapiano',
  'Hip-Hop / Trap',
  'Reggae Dancehall',
  'Jazz',
  'Funk',
  'Soul',
  'UK Drill',
  'Highlife',
  'Rock',
  'Pop',
  'R&B / Neo-Soul',
];

interface SelectedWorkProps {
  onOpenBooking?: (service?: string) => void;
}

export default function SelectedWork({ onOpenBooking }: SelectedWorkProps) {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [activeGenre, setActiveGenre] = useState<string>('ALL GENRES');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectRecord | null>(null);

  // Audio Playback State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudioPlayer();

  // Audio toggle helper
  const handlePlayToggle = (project: ProjectRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (playingId === project.id || (currentTrack?.id === project.id && isPlaying)) {
      setPlayingId(null);
      pauseTrack();
      audioEngine.stopTrackPreview();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setPlayingId(project.id);
      setPlaybackProgress(0);

      // Trigger high-fidelity synthesis engine and global audio player
      audioEngine.playTrackPreview(project.id);
      playTrack({
        id: project.id,
        title: project.title,
        artist: project.artist,
        category: project.category,
        artwork: project.image,
        durationSeconds: 215,
        studioRoom: project.caseStudy.studioRoom,
        spotifyUrl: project.streamingLinks?.spotify,
        appleMusicUrl: project.streamingLinks?.appleMusic,
      });

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            setPlayingId(null);
            audioEngine.stopTrackPreview();
            return 0;
          }
          return prev + 1;
        });
      }, 215);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Filter projects by category and genre
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
      const matchCat = activeCategory === 'all' || p.categorySlug === activeCategory;
      const matchGenre =
        activeGenre === 'ALL GENRES' ||
        p.genre.toLowerCase() === activeGenre.toLowerCase() ||
        p.title.toLowerCase().includes(activeGenre.toLowerCase());
      return matchCat && matchGenre;
    });
  }, [activeCategory, activeGenre]);

  const categories = [
    { id: 'all', label: 'All Work', count: PROJECTS_DATA.length },
    { id: 'artist-sessions', label: 'Artist Sessions', count: PROJECTS_DATA.filter((p) => p.categorySlug === 'artist-sessions').length },
    { id: 'original-productions', label: 'Original Productions', count: PROJECTS_DATA.filter((p) => p.categorySlug === 'original-productions').length },
    { id: 'mix-master', label: 'Mix & Master', count: PROJECTS_DATA.filter((p) => p.categorySlug === 'mix-master').length },
    { id: 'sound-in-motion', label: 'Sound in Motion', count: PROJECTS_DATA.filter((p) => p.categorySlug === 'sound-in-motion').length },
  ];

  return (
    <section
      id="work"
      className="relative py-24 sm:py-36 bg-[#070a12] text-[#F5F5F3] overflow-hidden border-t border-white/10"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10 sm:space-y-14">
        {/* Subtle Waveform Accent */}
        <div className="relative h-10 w-full pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full stroke-[#4E85BF]/40" preserveAspectRatio="none" viewBox="0 0 1200 40">
            <defs>
              <linearGradient id="sonicWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#89AACC" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#4E85BF" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#89AACC" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4E85BF" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20"
              fill="none"
              stroke="url(#sonicWaveGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx="300" cy="20" r="3" fill="#89AACC" className="animate-ping opacity-75" />
            <circle cx="600" cy="20" r="4" fill="#4E85BF" />
            <circle cx="900" cy="20" r="3.5" fill="#89AACC" />
          </svg>
        </div>

        {/* Section Heading & Editorial Introduction */}
        <div className="space-y-6 pb-8 border-b border-white/10">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono uppercase tracking-[0.28em] text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>SELECTED WORK · MASTER PRODUCTIONS & BEATS</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] text-white font-display">
              SOUND MADE <br />
              <span className="font-editorial normal-case font-normal text-[#89AACC] tracking-normal inline-block pr-2">
                into something
              </span> <br />
              TIMELESS.
            </h2>

            <div className="max-w-md space-y-4">
              <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
                Authentic beat productions, recorded song demos, and billboard mixes spanning 12 distinct genres crafted inside our Lekki Phase 1 tracking sanctuary.
              </p>
              <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>MASTER AUDIO READY</span>
                </span>
                <span className="text-white/20">|</span>
                <span>12 AUTHENTIC GENRES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category & Genre Filtering Controls */}
        <div className="space-y-3">
          {/* Primary Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    audioEngine.playClick();
                    setActiveCategory(cat.id as ProjectCategory);
                    setActiveGenre('ALL GENRES');
                  }}
                  className={`relative px-4 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/15 border border-[#89AACC] shadow-[0_0_20px_rgba(78,133,191,0.3)] scale-[1.02]'
                      : 'text-slate-400 hover:text-white bg-white/[0.03] border border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                      isActive ? 'bg-[#4E85BF] text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Genre Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-2 shrink-0">
              GENRES:
            </span>
            {GENRE_FILTERS.map((g) => (
              <button
                key={g}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveGenre(g);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  activeGenre === g
                    ? 'bg-[#4E85BF] text-white font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Perfectly Even 50/50 Symmetrical 2-Column Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activeGenre}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch"
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                isPlaying={playingId === project.id || (currentTrack?.id === project.id && isPlaying)}
                playbackProgress={playingId === project.id ? playbackProgress : (currentTrack?.id === project.id && isPlaying ? 50 : 0)}
                onPlayToggle={(e) => handlePlayToggle(project, e)}
                onOpenCaseStudy={() => setSelectedCaseStudy(project)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View Full Discography Action */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-slate-400">
            SHOWING {filteredProjects.length} OF 12 VERIFIED MASTER PRODUCTIONS & BEATS
          </p>
          <Link
            to="/our-work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white hover:text-sky-300 transition-all cursor-pointer shadow-sm group"
          >
            <span>EXPLORE FULL PRODUCTION CATALOGUE (12 MASTER TRACKS)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Expandable Project Case Study Modal */}
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
// INDIVIDUAL PROJECT CARD (EVEN 50/50 PROPORTION)
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
  const isBeat = project.type.toLowerCase().includes('beat');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
      onClick={onOpenCaseStudy}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0b0f19] hover:border-[#4E85BF]/70 transition-all duration-500 flex flex-col h-full cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(78,133,191,0.22)]"
    >
      {/* Top Half: Visual Media Container with Album Cover Art (Even 50% Visual Proportion) */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:h-80 w-full overflow-hidden bg-black shrink-0">
        <img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.8] contrast-[1.1] saturate-[1.1]"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/30 to-black/40 pointer-events-none" />

        {/* Top Badges (Preserving right-16 clearance for mobile action button) */}
        <div className="absolute top-4 left-4 right-16 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-mono z-20 pointer-events-none">
          <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#4E85BF]/50 text-sky-300 uppercase font-bold tracking-wider shadow-sm truncate">
            {project.genre}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold backdrop-blur-md border ${
              isBeat
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}
          >
            {isBeat ? <Music2 className="w-3 h-3 text-cyan-400" /> : <Mic className="w-3 h-3 text-amber-400" />}
            <span>{project.type}</span>
          </span>
          <span className="px-2 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-slate-300 shrink-0 hidden sm:inline-block">
            {project.year}
          </span>
        </div>

        {/* Upper-Right Project Action Trigger */}
        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCaseStudy();
            }}
            aria-label={`Open case study for ${project.title}`}
            className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:border-[#89AACC] hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-300 shadow-xl group/btn cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </button>
        </div>

        {/* Floating Play / Pause Trigger in Center */}
        <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
          <button
            type="button"
            onClick={onPlayToggle}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            className={`pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
              isPlaying
                ? 'accent-gradient text-white scale-110 shadow-[0_0_35px_rgba(78,133,191,0.7)] animate-pulse'
                : 'bg-black/80 hover:bg-[#4E85BF] text-white border border-white/25 group-hover:scale-105 group-hover:border-[#89AACC]'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Hover Cue */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          <span className="px-4 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#89AACC]/40 text-[#89AACC] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
            <Maximize2 className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>EXPLORE CASE STUDY & STEMS</span>
          </span>
        </div>
      </div>

      {/* Bottom Half: Editorial Content & Integrated Waveform Bar */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4 bg-[#0b0f19] border-t border-white/5">
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
            <span className="text-[11px] font-mono tracking-widest text-[#89AACC] uppercase block font-semibold truncate mr-2">
              {project.artist}
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">{project.key}</span>
              <span>{project.bpm} BPM</span>
              <span>·</span>
              <span>{project.duration}</span>
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight group-hover:text-sky-300 transition-colors">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Hardware Signal Stage Hint */}
          <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-slate-400 truncate">
            <Sliders className="w-3 h-3 text-[#4E85BF] shrink-0" />
            <span className="truncate">{project.caseStudy.studioRoom}</span>
          </div>
        </div>

        {/* Waveform Scrubber & Session Bar (Evenly Pinned to Bottom) */}
        <div className="space-y-2 pt-3 border-t border-white/10 mt-auto">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <Disc3 className={`w-3.5 h-3.5 text-[#4E85BF] ${isPlaying ? 'animate-spin' : ''}`} />
              <span className={isPlaying ? 'text-[#89AACC] font-semibold' : ''}>
                {isPlaying ? `PLAYING ${project.genre.toUpperCase()} DEMO` : 'STUDIO PREVIEW'}
              </span>
            </span>
            <span>{isPlaying ? `${playbackProgress}%` : project.duration}</span>
          </div>

          {/* Interactive Procedural Waveform Bars */}
          <div
            onClick={onPlayToggle}
            className="h-8 w-full bg-white/[0.03] rounded-lg p-1.5 flex items-end gap-1 cursor-pointer overflow-hidden border border-white/10 hover:border-[#89AACC]/40 transition-colors"
            title="Click to play audio production demo"
          >
            {Array.from({ length: 36 }).map((_, barIdx) => {
              const baseHeight = 20 + Math.sin(barIdx * 0.45 + project.bpm * 0.05) * 50 + (barIdx % 4) * 10;
              const isBarActive = isPlaying && (barIdx / 36) * 100 <= playbackProgress;

              return (
                <div
                  key={barIdx}
                  style={{ height: `${Math.max(16, Math.min(100, baseHeight))}%` }}
                  className={`flex-1 rounded-sm transition-all duration-150 ${
                    isBarActive
                      ? 'accent-gradient'
                      : 'bg-slate-800 group-hover:bg-slate-700/80'
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
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 lg:p-10 overflow-y-auto">
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
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

          {/* Hero Overlay Meta */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-[#4E85BF] text-white font-medium">
                {project.genre} · {project.category}
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
        <div className="p-6 sm:p-10 space-y-10">
          {/* Hero Quote */}
          <blockquote className="p-6 sm:p-8 rounded-2xl bg-[#141414] border-l-4 border-[#4E85BF] text-lg sm:text-2xl font-editorial text-white leading-relaxed">
            {project.caseStudy.heroQuote}
          </blockquote>

          {/* Stems Inspection Deck */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-[#89AACC] uppercase tracking-wider block font-semibold">
                  INTERACTIVE STEM PLAYBACK
                </span>
                <p className="text-xs text-slate-400">
                  Select and preview the individual tracking stems from this production session.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleStemPlay}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full accent-gradient text-white text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer shadow-md"
              >
                {isStemPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isStemPlaying ? 'PAUSE STEM' : 'PLAY ACTIVE STEM'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {project.caseStudy.stems.map((stem) => (
                <button
                  key={stem.id}
                  onClick={() => handleStemSelect(stem.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeStem === stem.id
                      ? 'border-[#4E85BF] bg-[#4E85BF]/15 text-white'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#89AACC]">
                    <span>{stem.type}</span>
                    {activeStem === stem.id && <Radio className="w-3 h-3 text-[#4E85BF] animate-pulse" />}
                  </div>
                  <div className="font-bold text-xs mt-1 text-white">{stem.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{stem.frequencyNote}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Overview & Creative Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base leading-relaxed text-slate-300">
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#89AACC] font-semibold">
                SESSION OVERVIEW
              </h4>
              <p>{project.caseStudy.overview}</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#89AACC] font-semibold">
                CREATIVE CHALLENGE
              </h4>
              <p>{project.caseStudy.creativeChallenge}</p>
            </div>
          </div>

          {/* Verified Signal Chain */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#89AACC] font-semibold">
              VERIFIED SIGNAL PATH & ANALOG HARDWARE
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.caseStudy.signalChain.map((chain, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-wider block">
                    {chain.stage}
                  </span>
                  <div className="text-xs font-bold text-white font-mono">{chain.hardware}</div>
                  <div className="text-[11px] text-slate-400">{chain.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications & Session Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#89AACC] font-semibold">
                TECHNICAL SPECIFICATIONS
              </h4>
              <div className="space-y-2">
                {project.caseStudy.technicalSpecs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-white/5 text-xs">
                    <span className="text-slate-400 font-mono">{spec.label}</span>
                    <span className="text-white font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#89AACC] font-semibold">
                CONTROL ROOM SESSION LOG
              </h4>
              <div className="space-y-2">
                {project.caseStudy.sessionLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer CTAs */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.streamingLinks?.spotify && (
                <a
                  href={project.streamingLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors"
                >
                  Stream on Spotify
                </a>
              )}
              {project.streamingLinks?.appleMusic && (
                <a
                  href={project.streamingLinks.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors"
                >
                  Apple Music
                </a>
              )}
            </div>

            <button
              onClick={() => onOpenBooking(project.category)}
              className="py-3 px-8 rounded-full accent-gradient text-white text-xs font-mono tracking-wider uppercase font-bold shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              BOOK A SESSION FOR THIS GENRE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
