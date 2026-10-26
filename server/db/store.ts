import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { DatabaseSchema, AdminUser, ServiceItem, Booking, PaymentTransaction, EquipmentItem, TeamMember, ProjectItem, Enquiry, ChatbotKnowledge, AuditLog, SiteSettings } from './types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_sv_salt_2026').digest('hex');
}

// Initial safe seed data
const initialSeedData: DatabaseSchema = {
  adminUsers: [
    {
      id: 'usr_admin_01',
      email: 'admin@sonicvault.com',
      passwordHash: hashPassword('SonicVault2026!'),
      name: 'Studio Director',
      role: 'super_admin',
      createdAt: '2026-10-20T00:00:00.000Z',
    },
  ],
  siteSettings: {
    studioName: 'SONICVAULT STUDIOS',
    address: '38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria',
    phone: '09015104502',
    internationalWhatsApp: '2349015104502',
    email: 'Sonicvaultstudios@gmail.com',
    socialHandle: 'SONICVAULTSTUDIO38',
    openingHours: 'Monday – Sunday: 24/7 By Appointment Only',
    paystackTestMode: true,
    paystackPublicKey: 'pk_test_sonicvault_public_demo_key',
  },
  services: [
    {
      id: 'srv_vocal_recording',
      slug: 'vocal-recording',
      title: 'Vocal Recording',
      category: 'recording',
      tagline: 'Flawless vocal captures through reference tube & FET microphones in a zero-noise acoustic vault.',
      description: 'Step into an acoustically tuned isolation chamber engineered for total clarity, dynamic intimacy, and vocal punch. Captured through our vintage Neumann U87 Ai and Sony C-800G chain with Tube-Tech CL 1B optical leveling.',
      deliverables: ['Raw multi-mic recordings (24-bit / 96kHz WAV)', 'Vocal comp track', 'High-res rough playback mix'],
      processSteps: ['Mic pairing & preamp gain staging', 'Headphone foldback mix tuning', 'Vocal tracking with punch-ins & comping', 'Stem export & backup'],
      preparationReqs: ['Instrumental stem or stereo backing track', 'Tempo / BPM & Key information', 'Draft lyrics / scratch track'],
      verifiedRoom: 'The Vocal Booth',
      defaultDurationHours: 2,
      pricingType: 'hourly',
      draftPriceNgn: 35000,
      approvedPriceNgn: 35000,
      isPriceApproved: false, // Flagged draft per prompt instruction
      isPublished: true,
      packages: [
        { id: 'pkg_vr_1h', name: 'Vocal recording — 1 hour', durationHours: 1, priceNgn: 35000, depositNgn: 15000, isApproved: false },
        { id: 'pkg_vr_2h', name: 'Vocal recording — 2 hours', durationHours: 2, priceNgn: 65000, depositNgn: 30000, isApproved: false },
        { id: 'pkg_vr_4h', name: 'Vocal recording — 4 hours', durationHours: 4, priceNgn: 125000, depositNgn: 50000, isApproved: false },
        { id: 'pkg_vr_8h', name: 'Vocal recording — 8 hours (Lockout)', durationHours: 8, priceNgn: 240000, depositNgn: 100000, isApproved: false },
      ],
    },
    {
      id: 'srv_beat_production',
      slug: 'beat-production',
      title: 'Music Production & Beat-Making',
      category: 'production',
      tagline: 'Custom production, modern Afrobeats grooves, cinematic textures, and bespoke chord progressions.',
      description: 'Collaborate with our in-house multi-instrumentalists and production architects. We sculpt custom sonics from scratch or build around your melody loops using hybrid analog synthesizers and pristine drums.',
      deliverables: ['Full Track Stems (Dry & Wet WAV)', 'Master stereo playback mix', 'MIDI data & project session bundle'],
      processSteps: ['Creative brief & harmonic discovery', 'Rhythm architecture & sound design', 'Melody arrangement & vocal guide tracking', 'Final arrangement arrangement'],
      preparationReqs: ['Reference tracks & artist vision', 'Tempo / mood references', 'Acapella or chords (if any)'],
      verifiedRoom: 'The Production Lab',
      defaultDurationHours: 4,
      pricingType: 'per_track',
      draftPriceNgn: 150000,
      approvedPriceNgn: 150000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_bp_single', name: 'Custom Beat Production', durationHours: 4, priceNgn: 150000, depositNgn: 75000, isApproved: false },
      ],
    },
    {
      id: 'srv_mixing',
      slug: 'mixing',
      title: 'Analog & Hybrid Mixing',
      category: 'mixing_mastering',
      tagline: 'Transform raw multitrack recordings into deep, punchy, commercially competitive records.',
      description: 'Individual track balance, surgical EQ, harmonic saturation, dynamic compression, stereo staging, and spatial reverb placement through our SSL AWS console and boutique outboard rack.',
      deliverables: ['Main Mix (24-bit / 48kHz WAV)', 'Instrumental & TV Track versions', 'Acapella & Performance tracks'],
      processSteps: ['Stem review & gain staging', 'Low-end sculpting & kick/bass alignment', 'Vocal front-and-center treatment', 'Automation, bus compression & stem export'],
      preparationReqs: ['Dry consolidated multitrack WAV stems', 'Rough mix reference', '2-3 commercial reference records'],
      verifiedRoom: 'The Analog Control Room',
      defaultDurationHours: 3,
      pricingType: 'per_track',
      draftPriceNgn: 100000,
      approvedPriceNgn: 100000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_mix_single', name: 'Stereo Multitrack Mix', durationHours: 3, priceNgn: 100000, depositNgn: 50000, isApproved: false },
      ],
    },
    {
      id: 'srv_mastering',
      slug: 'mastering',
      title: 'Precision Stereo & Dolby Atmos Mastering',
      category: 'mixing_mastering',
      tagline: 'The final polish that ensures your music sounds monumental across streaming, radio, and club systems.',
      description: 'Critical acoustic monitoring in our treated mastering suite. Harmonic excitation, dynamic stereo imaging, peak control, and true-peak loudness calibration adhering strictly to Spotify, Apple Music, and club playback specs.',
      deliverables: ['Streaming Master (-14 LUFS 24-bit WAV)', 'Club / DJ Master (-8 LUFS)', 'Apple Digital Masters compliant file'],
      processSteps: ['Critical listening & frequency balance check', 'Analog chain pass (Pultec EQ & Rupert Neve MBT)', 'True-peak limiting & dithering', 'Cross-system playback QA'],
      preparationReqs: ['Final uncompressed stereo mix (-6dB headroom, no limiter on master)', 'Song metadata (ISRC, Artist, Title)'],
      verifiedRoom: 'The Mastering Suite',
      defaultDurationHours: 2,
      pricingType: 'per_track',
      draftPriceNgn: 50000,
      approvedPriceNgn: 50000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_mast_single', name: 'Single Track Master', durationHours: 2, priceNgn: 50000, depositNgn: 25000, isApproved: false },
      ],
    },
    {
      id: 'srv_mix_master_bundle',
      slug: 'mixing-and-mastering',
      title: 'Complete Mixing & Mastering Bundle',
      category: 'mixing_mastering',
      tagline: 'The end-to-end sonic treatment. Full multitrack mix down combined with final competitive mastering.',
      description: 'Seamless synergy between our mixing engineers and mastering suite. Includes 3 free revision rounds, all stem variations, and streaming-ready delivery.',
      deliverables: ['Final Mastered WAV & 320kbps MP3', 'Mastered Instrumental & Acapella', 'Performance & TV tracks'],
      processSteps: ['Stem mix stage', 'Revision review', 'Mastering pass', 'Delivery package'],
      preparationReqs: ['Consolidated WAV stems', 'Artist rough mix', 'Key creative notes'],
      verifiedRoom: 'The Analog Control Room & Mastering Suite',
      defaultDurationHours: 5,
      pricingType: 'per_track',
      draftPriceNgn: 135000,
      approvedPriceNgn: 135000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_mm_bundle', name: 'Mix & Master Bundle', durationHours: 5, priceNgn: 135000, depositNgn: 65000, isApproved: false },
      ],
    },
    {
      id: 'srv_full_production',
      slug: 'full-production',
      title: 'Full Record Production',
      category: 'production',
      tagline: 'From raw melody to finished billboard-ready record: songwriting, beat, tracking, mixing & master.',
      description: 'Comprehensive artist development package. Our head producer and engineering staff partner with you through pre-production, chord styling, vocal directing, full instrumentation, and complete post-production.',
      deliverables: ['Finished Commercial Master', 'All Session Multitracks', 'Instrumental, Clean, Acapella', 'Documentation & Stem Archive'],
      processSteps: ['Pre-production & songwriting', 'Studio instrumentation tracking', 'Vocal production & arrangement', 'Mix & master'],
      preparationReqs: ['Artist profile', 'Concept or voice memo demo'],
      verifiedRoom: 'Full Studio Access',
      defaultDurationHours: 12,
      pricingType: 'per_track',
      draftPriceNgn: 300000,
      approvedPriceNgn: 300000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_fp_single', name: 'Full Production Single', durationHours: 12, priceNgn: 300000, depositNgn: 150000, isApproved: false },
      ],
    },
    {
      id: 'srv_vocal_production_tuning',
      slug: 'vocal-tuning-editing',
      title: 'Vocal Production, Editing & Tuning',
      category: 'vocal_production',
      tagline: 'Transparent pitch correction, manual Melodyne alignment, pocket timing, harmonies & background vocal stacking.',
      description: 'Elevate raw vocal takes into pristine, modern radio perfection. We specialize in natural Melodyne note shaping, tight vocAlign phrase locking, and lush harmonic widening.',
      deliverables: ['Tuned & Aligned Vocal Lead WAV', 'Tuned Stacks & Adlibs', 'Clean vocal stems ready for mixing'],
      processSteps: ['Breath & noise de-clicking', 'Formant-preserved pitch editing', 'Phrase timing & pocket adjustment', 'Stereo spread harmonic processing'],
      preparationReqs: ['Consolidated vocal WAV tracks', 'Backing music track with clear key reference'],
      verifiedRoom: 'The Vocal Booth',
      defaultDurationHours: 2,
      pricingType: 'per_track',
      draftPriceNgn: 60000,
      approvedPriceNgn: 60000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_vt_track', name: 'Vocal Tuning & Comping', durationHours: 2, priceNgn: 60000, depositNgn: 30000, isApproved: false },
      ],
    },
    {
      id: 'srv_podcast_recording',
      slug: 'podcast-recording',
      title: 'Broadcast Podcast Recording',
      category: 'creative_audio',
      tagline: 'Multi-microphone broadcast podcast sessions with real-time monitoring and pristine acoustic isolation.',
      description: 'Accommodates up to 4 hosts and remote guests. Equipped with Shure SM7B broadcast microphones, Cloudlifter preamps, multi-camera lighting setup, and isolated headphone feeds.',
      deliverables: ['Isolated host WAV audio tracks', 'Level-matched broadcast stereo mix', 'Timecode synced backup'],
      processSteps: ['Microphone placement & gain matching', 'Multi-channel live recording', 'Quick noise reduction pass', 'File handover'],
      preparationReqs: ['Show outline / script', 'Guest list & remote call links (if any)'],
      verifiedRoom: 'The Live Recording Room',
      defaultDurationHours: 2,
      pricingType: 'hourly',
      draftPriceNgn: 50000,
      approvedPriceNgn: 50000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_pod_1h', name: 'Podcast Recording — 1 hour', durationHours: 1, priceNgn: 50000, depositNgn: 25000, isApproved: false },
        { id: 'pkg_pod_2h', name: 'Podcast Recording — 2 hours', durationHours: 2, priceNgn: 90000, depositNgn: 45000, isApproved: false },
      ],
    },
    {
      id: 'srv_voiceover_recording',
      slug: 'voiceover-recording',
      title: 'Voice-Over & Commercial Narration',
      category: 'creative_audio',
      tagline: 'Ultra-low noise floor vocal captures for commercials, audiobooks, dubbing, and video game dialogues.',
      description: 'Dedicated sound design and voice-over engineering with real-time producer remote talkback via Source-Connect or Zoom. Broadcast compliant mastering available.',
      deliverables: ['Pristine 24-bit 48kHz WAV takes', 'De-breathed and edited final master audio', 'CSV take sheet'],
      processSteps: ['Script review & pacing calibration', 'Direct mic tracking with pop filtering', 'Comping best takes', 'De-esser & level normalization'],
      preparationReqs: ['Final script text', 'Pronunciation guide for specific brand/character names'],
      verifiedRoom: 'The Vocal Booth',
      defaultDurationHours: 1,
      pricingType: 'hourly',
      draftPriceNgn: 35000,
      approvedPriceNgn: 35000,
      isPriceApproved: false,
      isPublished: true,
      packages: [
        { id: 'pkg_vo_1h', name: 'Voice-over Recording — 1 hour', durationHours: 1, priceNgn: 35000, depositNgn: 17500, isApproved: false },
      ],
    },
  ],
  equipment: [
    {
      id: 'eq_neumann_u87',
      name: 'U87 Ai Large-Diaphragm Condenser',
      manufacturer: 'Neumann Berlin',
      model: 'U87 Ai',
      category: 'microphones',
      room: 'The Vocal Booth',
      description: 'The global standard for vocal clarity and acoustic intimacy. Dual-diaphragm capsule with omni, cardioid, and figure-8 switchable patterns.',
      specs: { 'Acoustical Operating Principle': 'Pressure gradient transducer', 'Directional Patterns': 'Omnidirectional, Cardioid, Figure-8', 'Equivalent Noise Level': '12 dB-A', 'Max SPL': '127 dB' },
      applications: ['Lead vocals', 'Acoustic guitar tracking', 'Voice-over and narrative dialogue'],
      imageUrl: '/assets/images/neumann_u87_mic_1792661940627.jpg',
      isPublished: true,
    },
    {
      id: 'eq_sony_c800g',
      name: 'C-800G Studio Tube Microphone',
      manufacturer: 'Sony Pro Audio',
      model: 'C-800G PAC',
      category: 'microphones',
      room: 'The Vocal Booth',
      description: 'Legendary high-end tube microphone featuring an external Peltier thermoelectric cooling system. Renowned for silky modern highs and present lead vocals.',
      specs: { 'Tube Type': '6AU6 vacuum tube', 'Frequency Response': '20 Hz – 18,000 Hz', 'Dynamic Range': '113 dB or more', 'Cooling': 'Peltier cooling system' },
      applications: ['Modern Afrobeats lead vocals', 'Hip-Hop and R&B vocal stacks'],
      imageUrl: '/assets/images/sony_c800g_mic_1792661940998.jpg',
      isPublished: true,
    },
    {
      id: 'eq_tubetech_cl1b',
      name: 'CL 1B Optical Tube Compressor',
      manufacturer: 'Tube-Tech',
      model: 'CL 1B',
      category: 'outboard_gear',
      room: 'The Analog Control Room',
      description: 'All-tube optical compressor celebrated for effortless, transparent vocal leveling without transient squashing or harsh coloration.',
      specs: { 'Circuitry': 'All-tube design (ECC 82 & ECC 83)', 'Gain Reduction': 'Up to 30 dB', 'Attack Time': '0.5 to 300 ms', 'Release Time': '0.05 to 10 sec' },
      applications: ['Tracking vocal insert', 'Bass smoothing', 'Lead instrument compression'],
      imageUrl: '/assets/images/tubetech_cl1b_comp_1792661942324.jpg',
      isPublished: true,
    },
    {
      id: 'eq_neve_1073',
      name: '1073SPX Discrete Microphone Preamp & EQ',
      manufacturer: 'Rupert Neve Designs',
      model: '1073SPX',
      category: 'outboard_gear',
      room: 'The Analog Control Room',
      description: 'Handcrafted British Class A discrete circuit with Marinair transformers delivering unmistakable punch, thick low-mids, and musical sheen.',
      specs: { 'Topology': 'Class A discrete with transformers', 'Max Gain': '+80 dB', 'EQ Bands': 'High shelf 12kHz, Mid peak with selectable Q, Low shelf' },
      applications: ['Vocal front-end tracking', 'Snare and kick analog tracking', 'Analog master bus warming'],
      imageUrl: '/assets/images/neve_1073_preamp_1792661944145.jpg',
      isPublished: true,
    },
    {
      id: 'eq_ssl_aws948',
      name: 'AWS 948 Delta Hybrid SuperAnalogue Console',
      manufacturer: 'Solid State Logic',
      model: 'AWS 948 Delta',
      category: 'consoles',
      room: 'The Analog Control Room',
      description: '48 inputs of SSL SuperAnalogue summing with dual-channel EQ, G-Series bus compressor, and automated motorized DAW fader integration.',
      specs: { 'Channels': '48 inputs in 24 fader frame', 'Summing': 'SuperAnalogue ultra-wide bandwidth', 'Bus Compression': 'Classic SSL G-Master Bus compressor' },
      applications: ['Summing and analog stems', 'Tracking sessions with instant DAW recall', 'Stereo bus gluing'],
      imageUrl: '/assets/images/ssl_aws948_console_1792661944667.jpg',
      isPublished: true,
    },
    {
      id: 'eq_genelec_8351b',
      name: 'The Ones 8351B Coaxial Active Monitors',
      manufacturer: 'Genelec',
      model: '8351B SAM',
      category: 'monitors_headphones',
      room: 'The Analog Control Room',
      description: 'Three-way point-source coaxial monitors featuring Smart Active Monitor DSP room correction for pinpoint stereo imaging and zero phase distortion.',
      specs: { 'Acoustic Design': 'Coaxial three-way point source', 'SPL': '118 dB', 'Frequency Response': '32 Hz – 43,000 Hz (-6dB)', 'Subwoofer Match': 'Genelec 7380A' },
      applications: ['Critical mixing and spatial balance', 'Phase verification across octaves'],
      imageUrl: '/assets/images/genelec_8351b_monitor_1792661945240.jpg',
      isPublished: true,
    },
    {
      id: 'eq_moog_subsequent',
      name: 'Subsequent 37 Paraphonic Analog Synthesizer',
      manufacturer: 'Moog Music',
      model: 'Subsequent 37',
      category: 'instruments',
      room: 'The Production Lab',
      description: 'Two-note paraphonic analog synthesizer with dual oscillators, sub-oscillator, multidrive saturation, and the legendary Moog ladder filter.',
      specs: { 'Sound Engine': '100% Analog', 'Polyphony': 'Monophonic or 2-Note Paraphonic', 'Keys': '37 semi-weighted with velocity and aftertouch' },
      applications: ['Sub-bass architecture', 'Analog lead synthesis', 'Sonic soundscapes'],
      imageUrl: '/assets/images/moog_subsequent37_synth_1792661946188.jpg',
      isPublished: true,
    },
    {
      id: 'eq_shure_sm7b',
      name: 'SM7B Dynamic Vocal Microphone',
      manufacturer: 'Shure',
      model: 'SM7B',
      category: 'microphones',
      room: 'The Live Recording Room',
      description: 'Smooth, flat, wide-range frequency response suitable for broadcast speech, rock vocals, podcasts, and brass tracking.',
      specs: { 'Type': 'Dynamic', 'Polar Pattern': 'Cardioid', 'Shielding': 'Electromagnetic hum rejection' },
      applications: ['Podcast multi-guest sessions', 'Aggressive vocal performances', 'Snare bottom / guitar cabs'],
      imageUrl: '/assets/images/shure_sm7b_mic_1792661945984.jpg',
      isPublished: true,
    },
  ],
  team: [
    {
      id: 'tm_founder',
      name: 'A. Vektor Sterling',
      role: 'Founder & Executive Creative Director',
      title: 'Visionary & Studio Architect',
      bio: 'Pioneering music technologist and sound architect dedicated to establishing West Africa’s most acoustically honest and artist-centered recording sanctuary in Lekki Phase 1.',
      credits: ['Executive Producer on multiple chart-topping Afrobeats records', 'Acoustic design consultant for premier West African studios'],
      imageUrl: '/assets/images/founder_portrait_1793009543550.jpg',
      isFounder: true,
      isPublished: true,
    },
    {
      id: 'tm_head_engineer',
      name: 'Korede "K-Sonic" Oladipo',
      role: 'Head Recording & Mix Engineer',
      title: 'Senior Analog Specialist',
      bio: 'Over a decade of analog console experience across Lagos and London. Master of the SSL AWS signal path, vocal presence, and punchy drum staging.',
      credits: ['Mixed for top charting Afrobeats, Amapiano and Afro-fusion artists', 'Certified Dolby Atmos Mixing Engineer'],
      imageUrl: '/assets/images/mix_engineer_portrait_1793009545471.jpg',
      isPublished: true,
    },
    {
      id: 'tm_mastering_engineer',
      name: 'Ngozi "The Alchemist" Eze',
      role: 'Mastering Engineer',
      title: 'Chief Acoustician & Stereo Architect',
      bio: 'With an ear honed by thousands of releases, Ngozi ensures SonicVault masters translate with monumental punch, dynamic air, and emotional depth from AirPods to festival stages.',
      credits: ['Over 300+ commercial album and single masters', 'Apple Digital Masters Certified'],
      imageUrl: '/assets/images/mastering_engineer_female_1793009545751.jpg',
      isPublished: true,
    },
    {
      id: 'tm_lead_producer',
      name: 'Damian "Pulse" Okon',
      role: 'Resident Producer & Sound Designer',
      title: 'Modular & Beatmaker Architect',
      bio: 'Synthesizer purist and rhythm innovator combining African percussive foundations with modular synthesis and forward-looking chord movements.',
      credits: ['Produced for breakout Afrobeats and Alte artists', 'Custom audio sound designer for cinematic trailer campaigns'],
      imageUrl: '/assets/images/producer_sound_designer_1793009546482.jpg',
      isPublished: true,
    },
  ],
  projects: [
    {
      id: 'prj_afrobeats_sunrise',
      title: 'Lagos Sunrise (Afrobeats Anthem)',
      artist: 'Femi & The Groove Collective',
      category: 'Artist Sessions',
      genre: 'Afrobeats',
      type: 'Recorded Song Demo',
      year: '2026',
      bpm: 106,
      key: 'E minor',
      coverImage: '/assets/images/afrobeats_art_1792664025566.jpg',
      audioUrl: '/demo_audio_afrobeats.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
        audiomack: 'https://audiomack.com',
        boomplay: 'https://boomplay.com',
      },
      credits: {
        recordedBy: 'Floating Vocal Chamber (Sony C-800G)',
        mixedBy: 'SSL AWS 948 Delta Console (K-Sonic)',
        masteredBy: 'The SonicVault Mastering Suite',
        producedBy: 'K-Sonic & Vektor Sterling',
        studioRoom: 'The Vocal Booth & Analog Control Room',
      },
      caseStudyOverview: 'Uplifting 106 BPM Afrobeats anthem tracked through the Sony C-800G into Neve 1073 and Tube-Tech CL 1B. Featuring driving four-on-the-floor kick, resonant African log drum bounce, Kalimba plucks, and live Lagos brass section.',
      isPublished: true,
    },
    {
      id: 'prj_amapiano_kairo',
      title: 'Kairo Nights (Amapiano Heavyweight Beat)',
      artist: 'Nkosi & The Vault Sound System',
      category: 'Original Productions',
      genre: 'Amapiano',
      type: 'Beat Instrumental',
      year: '2026',
      bpm: 112,
      key: 'D minor',
      coverImage: '/assets/images/amapiano_art_1792664025996.jpg',
      audioUrl: '/demo_audio_amapiano.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
        audiomack: 'https://audiomack.com',
      },
      credits: {
        recordedBy: 'SonicVault Sound Lab (Akai MPC Live II)',
        mixedBy: 'SSL G-Series Master Bus Compressor',
        masteredBy: 'Shadow Hills Mastering Compressor',
        producedBy: 'Pulse & K-Sonic',
        studioRoom: 'The Production Lab',
      },
      caseStudyOverview: 'South African Amapiano heavyweight production featuring deep resonant FM log-drum pitch glides, rolling triplet shakers, atmospheric Fender Rhodes 9th chords, and club-shaking sub-bass low-end translation.',
      isPublished: true,
    },
    {
      id: 'prj_trap_phantom',
      title: 'Phantom Sub (Hip-Hop & Trap 808 Instrumental)',
      artist: 'Damian Pulse & The Trap Cell',
      category: 'Original Productions',
      genre: 'Hip-Hop / Trap',
      type: 'Beat Instrumental',
      year: '2026',
      bpm: 140,
      key: 'A minor',
      coverImage: '/assets/images/trap_808_art_1792664028250.jpg',
      audioUrl: '/demo_audio_trap.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
        audiomack: 'https://audiomack.com',
      },
      credits: {
        recordedBy: 'The Production Lab (Moog Subsequent 37)',
        mixedBy: 'Analog Hybrid Stem Summing',
        masteredBy: 'Weiss DS1-MK3 Digital Limiter',
        producedBy: 'Damian Pulse',
        studioRoom: 'The Production Lab',
      },
      caseStudyOverview: 'Hard-hitting 140 BPM Trap instrumental sculpted with thunderous sliding 808 sub-bass glides, rapid 32nd hi-hat rolls, snapping trap snares, and dark minor analog bell chord progressions.',
      isPublished: true,
    },
    {
      id: 'prj_reggae_heatwave',
      title: 'Kingston Heatwave (Reggae Dancehall & Dub)',
      artist: 'High Pressure Sound System',
      category: 'Mix & Master',
      genre: 'Reggae Dancehall',
      type: 'Recorded Song Demo',
      year: '2026',
      bpm: 96,
      key: 'G minor',
      coverImage: '/assets/images/reggae_dub_art_1792664027104.jpg',
      audioUrl: '/demo_audio_reggae.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
        audiomack: 'https://audiomack.com',
      },
      credits: {
        recordedBy: 'The Live Recording Room & Vocal Chamber',
        mixedBy: 'Space Echo RE-201 & SSL 4000 G+',
        masteredBy: 'Ngozi Eze (Studer A800 2-Inch Tape)',
        producedBy: 'Vektor & High Pressure',
        studioRoom: 'The Live Recording Room & Mastering Suite',
      },
      caseStudyOverview: 'Authentic 96 BPM Kingston-style Reggae Dancehall dub session. Authentic one-drop drums, sharp staccato offbeat guitar and organ skanks, deep dub sub-bass, and analog spring reverb tape echo throws.',
      isPublished: true,
    },
    {
      id: 'prj_jazz_bluenote',
      title: 'Blue Note Lekki (Acoustic Jazz Quartet)',
      artist: 'The Authentics Jazz Quartet',
      category: 'Sound in Motion',
      genre: 'Jazz',
      type: 'Recorded Song Demo',
      year: '2026',
      bpm: 120,
      key: 'C major / D minor',
      coverImage: '/assets/images/jazz_blue_art_1792664042317.jpg',
      audioUrl: '/demo_audio_jazz.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
      },
      credits: {
        recordedBy: 'Coles 4038 Ribbon Blumlein Pair',
        mixedBy: 'Neve 1073 & Pultec EQP-1A Tube EQ',
        masteredBy: 'Ngozi Eze (Lavry Gold DA/AD)',
        producedBy: 'A. Vektor Sterling',
        studioRoom: 'The Live Recording Room',
      },
      caseStudyOverview: 'Recorded live in our acoustically tuned live room with Coles 4038 ribbon microphones. Features acoustic upright walking double bass, classic swung ride cymbal tap, warm Rhodes II-V-I chords, and muted saxophone phrasing.',
      isPublished: true,
    },
    {
      id: 'prj_funk_groove',
      title: 'Golden Groove (1970s Slap Funk Production)',
      artist: 'The Golden Groove Orchestra',
      category: 'Original Productions',
      genre: 'Funk',
      type: 'Beat & Recorded Jam',
      year: '2026',
      bpm: 108,
      key: 'E Dorian',
      coverImage: '/assets/images/funk_groove_art_1792664043953.jpg',
      audioUrl: '/demo_audio_funk.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
      },
      credits: {
        recordedBy: 'The Analog Control Room & Live Room',
        mixedBy: 'SSL AWS 948 Delta Console & 1176LN',
        masteredBy: 'The SonicVault Mastering Suite',
        producedBy: 'K-Sonic & Pulse',
        studioRoom: 'The Production Lab & Control Room',
      },
      caseStudyOverview: 'High-octane 1970s slap funk production driven by syncopated thumb-slap bass and string pops, rhythmic wah-style guitar chops, crisp acoustic snare on 2 and 4, and dynamic brass horn stabs.',
      isPublished: true,
    },
    {
      id: 'prj_soul_velvet',
      title: 'Velvet Heartstrings (Classic Motown Soul)',
      artist: 'Ashley Monique & Soul Keys',
      category: 'Artist Sessions',
      genre: 'Soul',
      type: 'Recorded Song Demo',
      year: '2026',
      bpm: 76,
      key: 'B♭ major',
      coverImage: '/assets/images/soul_motown_art_1792664052822.jpg',
      audioUrl: '/demo_audio_soul.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
      },
      credits: {
        recordedBy: 'Neumann U87 Ai Matched Stereo Pair',
        mixedBy: 'Teletronix LA-2A Vintage Optical Leveler',
        masteredBy: 'Ngozi Eze',
        producedBy: 'A. Vektor Sterling',
        studioRoom: 'The Vocal Booth & Mastering Suite',
      },
      caseStudyOverview: 'Deep Motown soul session captured on the Neumann U87 Ai through vintage Teletronix LA-2A optical compression. Features warm flat-wound electric bass, vintage Fender Rhodes vibrato, lush string pads, and emotive vocal runs.',
      isPublished: true,
    },
    {
      id: 'prj_drill_brixton',
      title: 'Brixton Nocturne (UK Drill Rap Type Beat)',
      artist: 'SonicVault Beat Lab',
      category: 'Original Productions',
      genre: 'UK Drill',
      type: 'Beat Instrumental',
      year: '2026',
      bpm: 142,
      key: 'C minor',
      coverImage: '/assets/images/uk_drill_art_1792664053119.jpg',
      audioUrl: '/demo_audio_drill.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
      },
      credits: {
        recordedBy: 'The Production Lab (Moog Subsequent 37)',
        mixedBy: 'SSL AWS 948 VCA Compressor',
        masteredBy: 'The SonicVault Mastering Suite',
        producedBy: 'Damian Pulse',
        studioRoom: 'The Production Lab',
      },
      caseStudyOverview: 'Gritty 142 BPM UK Drill rap type beat built around signature sliding octave pitch-glide 808 basslines, syncopated triplet hi-hat skips, hard offbeat counter-snares, and dark gothic minor piano stabs.',
      isPublished: true,
    },
    {
      id: 'prj_highlife_palmwine',
      title: 'Palmwine Serenade (West African Highlife)',
      artist: 'The African Sound Makers',
      category: 'Artist Sessions',
      genre: 'Highlife',
      type: 'Recorded Song Demo',
      year: '2026',
      bpm: 114,
      key: 'F major',
      coverImage: '/assets/images/highlife_art_1792664079837.jpg',
      audioUrl: '/demo_audio_highlife.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
        boomplay: 'https://boomplay.com',
      },
      credits: {
        recordedBy: 'The Live Recording Room & Vocal Booth',
        mixedBy: 'SSL 4000 G+ 48-Channel Desk',
        masteredBy: 'Studer A800 2-Inch Tape Master',
        producedBy: 'Vektor & African Sound Makers',
        studioRoom: 'The Live Recording Room',
      },
      caseStudyOverview: 'Timeless West African highlife celebration tracking dual clean interlocking guitars, traditional talking drums with real-time pitch bends, joyful live brass section harmonies, and buoyant melodic bass.',
      isPublished: true,
    },
    {
      id: 'prj_rock_overdrive',
      title: 'Overdrive Anthem (Modern Alt-Rock Production)',
      artist: 'The High Voltage Recordings',
      category: 'Mix & Master',
      genre: 'Rock',
      type: 'Recorded Song Demo',
      year: '2026',
      bpm: 128,
      key: 'D major',
      coverImage: '/assets/images/rock_overdrive_art_1792664080054.jpg',
      audioUrl: '/demo_audio_rock.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
      },
      credits: {
        recordedBy: 'Shure SM7B on Marshall 4x12 Cab & Live Drums',
        mixedBy: 'Empirical Labs Distressor & SSL AWS 948',
        masteredBy: 'Ngozi Eze (Lavry Gold DA/AD)',
        producedBy: 'K-Sonic & High Voltage',
        studioRoom: 'The Live Recording Room & Control Room',
      },
      caseStudyOverview: 'Energetic modern rock production featuring overdriven Marshall tube power chords, driving acoustic drum kit, crash cymbal wash, aggressive picked bassline, and soaring alternative rock vocals.',
      isPublished: true,
    },
    {
      id: 'prj_pop_neon',
      title: 'Neon Starlight (Synthpop & Pop Radio Single)',
      artist: 'Luna Velocity',
      category: 'Mix & Master',
      genre: 'Pop',
      type: 'Beat & Vocal Master',
      year: '2026',
      bpm: 122,
      key: 'F# minor / A major',
      coverImage: '/assets/images/pop_synth_art_1792664081110.jpg',
      audioUrl: '/demo_audio_pop.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
        boomplay: 'https://boomplay.com',
      },
      credits: {
        recordedBy: 'The Vocal Booth (Sony C-800G)',
        mixedBy: 'SSL AWS 948 Delta & Rupert Neve MBT',
        masteredBy: 'The SonicVault Mastering Suite',
        producedBy: 'Pulse & Luna Velocity',
        studioRoom: 'The Vocal Booth & Mastering Suite',
      },
      caseStudyOverview: 'Polished radio-ready commercial pop anthem featuring four-on-the-floor dance kick, sidechained pumping synth bass, shimmering saw-synth poly-chords, crisp digital handclaps, and infectious synthpop arpeggios.',
      isPublished: true,
    },
    {
      id: 'prj_rnb_midnight',
      title: 'Midnight Satin (Intimate R&B & Neo-Soul Session)',
      artist: 'Ashley Monique & K-Sonic',
      category: 'Sound in Motion',
      genre: 'R&B / Neo-Soul',
      type: 'Recorded Song Demo',
      year: '2026',
      bpm: 82,
      key: 'D♭ major 9',
      coverImage: '/assets/images/rnb_neosoul_art_1792664081553.jpg',
      audioUrl: '/demo_audio_rnb.mp3',
      streamingLinks: {
        spotify: 'https://open.spotify.com',
        appleMusic: 'https://music.apple.com',
      },
      credits: {
        recordedBy: 'Sennheiser AMBEO VR & Sony C-800G',
        mixedBy: 'Dolby Atmos Production Suite RMU',
        masteredBy: 'Genelec 7.1.4 Smart Active Monitoring',
        producedBy: 'Vektor & K-Sonic',
        studioRoom: 'Dolby Atmos 7.1.4 Certified Mix Suite',
      },
      caseStudyOverview: 'Sensual 82 BPM R&B / Neo-Soul showcase tracked in Dolby Atmos. Features Fender Rhodes major 9th chords, unhurried pocket drums with rim clicks, warm sub-bass, and silky smooth multi-track vocal harmonies.',
      isPublished: true,
    },
  ],
  bookings: [
    {
      reference: 'SV-202610-8901',
      serviceId: 'srv_vocal_recording',
      serviceName: 'Vocal Recording',
      packageName: 'Vocal recording — 2 hours',
      date: '2026-10-25',
      timeSlot: '14:00 - 16:00',
      clientName: 'Tunde Bakare',
      clientEmail: 'tunde.b@example.com',
      clientPhone: '08023456789',
      projectDetails: 'Lead vocal tracking for upcoming EP single with backing harmonies.',
      durationHours: 2,
      priceNgn: 65000,
      depositNgn: 30000,
      bookingStatus: 'confirmed',
      paymentStatus: 'deposit_paid',
      paymentReference: 'SV_PSTK_TEST_8901',
      notes: 'Client requested Neumann U87 Ai setup prior to arrival.',
      termsAccepted: true,
      createdAt: '2026-10-20T01:00:00.000Z',
      updatedAt: '2026-10-20T01:30:00.000Z',
    },
  ],
  payments: [
    {
      reference: 'SV_PSTK_TEST_8901',
      bookingReference: 'SV-202610-8901',
      amountNgn: 30000,
      customerEmail: 'tunde.b@example.com',
      customerName: 'Tunde Bakare',
      status: 'success',
      paystackReference: 'PSTK_DEMO_2026_8901',
      channel: 'card',
      paidAt: '2026-10-20T01:30:00.000Z',
      isTestMode: true,
      idempotencyKey: 'idemp_8901_initial',
      createdAt: '2026-10-20T01:25:00.000Z',
    },
  ],
  enquiries: [
    {
      id: 'enq_01',
      name: 'Chioma Nwosu',
      email: 'chioma.artist@example.com',
      phone: '09098765432',
      serviceInterest: 'Full Record Production',
      message: 'Hello, looking to book a 5-day album lockout in December for a 7-track Afrosoul project.',
      status: 'unread',
      createdAt: '2026-10-20T02:00:00.000Z',
    },
  ],
  chatbotKnowledge: [
    {
      id: 'cb_welcome',
      question: 'What is SonicVault Studios?',
      keywords: ['about', 'who', 'what is', 'studio', 'overview'],
      answer: 'SONICVAULT STUDIOS is a premier music recording, production, mixing, and mastering studio situated at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos, Nigeria. Our mission is Where Sound Becomes Art.',
      category: 'location',
      isPublished: true,
    },
    {
      id: 'cb_location',
      question: 'Where are you located and what are your opening hours?',
      keywords: ['address', 'location', 'where', 'lekki', 'directions', 'hours', 'open'],
      answer: 'We are located at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria. We operate 24/7 strictly by appointment to guarantee artists complete privacy and unbroken creative flow.',
      category: 'location',
      isPublished: true,
    },
    {
      id: 'cb_services',
      question: 'What services do you offer at SonicVault?',
      keywords: ['services', 'record', 'mix', 'master', 'produce', 'vocal', 'podcast'],
      answer: 'We provide Vocal Recording, Music Production & Beatmaking, Analog & Hybrid Mixing, Precision Mastering, Vocal Tuning & Comping, and Broadcast Podcast/Voice-over recording in our specialized acoustically treated rooms.',
      category: 'services',
      isPublished: true,
    },
    {
      id: 'cb_pricing',
      question: 'How much are your studio rates and session prices?',
      keywords: ['price', 'pricing', 'rates', 'cost', 'how much', 'fee', 'charge'],
      answer: 'Our proposed starting rates begin at ₦35,000 for a 1-hour vocal recording session and scale with lockout packages and multi-track production bundles. All final rates are calculated dynamically during booking and confirmed with our studio director.',
      category: 'pricing',
      isPublished: true,
    },
    {
      id: 'cb_booking',
      question: 'How do I book a session and make payment?',
      keywords: ['book', 'booking', 'reserve', 'pay', 'paystack', 'deposit'],
      answer: 'You can book directly through our online booking portal at /book-session or click "Book a Session". We accept secure payments and deposits via Paystack (card, bank transfer, USSD). A deposit secures your exclusive room time.',
      category: 'booking',
      isPublished: true,
    },
    {
      id: 'cb_equipment',
      question: 'What gear and microphones do you have in the studio?',
      keywords: ['gear', 'microphone', 'mic', 'equipment', 'console', 'ssl', 'neumann', 'tube tech', 'monitors'],
      answer: 'The Vault is equipped with reference instruments and analog hardware including the Sony C-800G tube microphone, Neumann U87 Ai, Tube-Tech CL 1B compressor, Neve 1073SPX, SSL AWS 948 Delta console, and Genelec 8351B point-source monitors.',
      category: 'equipment',
      isPublished: true,
    },
    {
      id: 'cb_contact',
      question: 'How do I speak to a live studio engineer or manager on WhatsApp?',
      keywords: ['human', 'whatsapp', 'phone', 'contact', 'call', 'talk', 'chat'],
      answer: 'You can reach our studio manager immediately on WhatsApp at +2349015104502 or click the floating WhatsApp button on your screen. You can also call 09015104502 or email Sonicvaultstudios@gmail.com.',
      category: 'policies',
      isPublished: true,
    },
    {
      id: 'cb_external_engineer',
      question: 'Can I bring my own external sound engineer or producer?',
      keywords: ['own engineer', 'external producer', 'bring engineer', 'guest engineer', 'patchbay'],
      answer: 'Yes! Guest engineers and outside producers are welcome. A SonicVault staff technician will be on standby throughout your session to handle console routing, patchbays, microphone setup, and hardware recalls at zero extra charge.',
      category: 'services',
      isPublished: true,
    },
    {
      id: 'cb_file_prep',
      question: 'How should I prepare stems and files for mixing or mastering?',
      keywords: ['stem', 'stems', 'files', 'wav', 'prepare', 'mixing prep', 'format', 'sample rate'],
      answer: 'Please export 24-bit or 32-bit float WAV/AIFF stems at 44.1kHz or 48kHz, all starting from timecode 0:00:00. Remove master bus limiters and dithering. Include rough demo mixes and BPM/key information in your zip archive.',
      category: 'services',
      isPublished: true,
    },
    {
      id: 'cb_lockouts',
      question: 'Do you offer full-day lockouts or multi-day album production packages?',
      keywords: ['lockout', 'full day', '12 hours', 'album package', 'residency', 'overnight'],
      answer: 'Yes. We offer 12-hour full facility lockouts and multi-day production residencies. Lockouts include private lounge privileges, unmetered access to all analog outboard chains, and dedicated sound engineers.',
      category: 'booking',
      isPublished: true,
    },
    {
      id: 'cb_cancellation',
      question: 'What is your session rescheduling and cancellation policy?',
      keywords: ['cancel', 'cancellation', 'reschedule', 'refund', 'policy', 'late'],
      answer: 'Sessions can be rescheduled without penalty up to 48 hours prior to your booked slot. Your deposit will be seamlessly credited toward your rescheduled date.',
      category: 'policies',
      isPublished: true,
    },
  ],
  auditLogs: [
    {
      id: 'log_01',
      action: 'SYSTEM_BOOTSTRAP',
      user: 'system',
      details: 'SonicVault Studio platform initialized with verified Lekki Phase 1 configuration and seed database.',
      timestamp: '2026-10-20T00:00:00.000Z',
    },
  ],
};

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = initialSeedData;
    this.ensureDataDir();
    this.loadFromDisk();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge with initial data to ensure all tables exist
        this.data = {
          ...initialSeedData,
          ...parsed,
          siteSettings: { ...initialSeedData.siteSettings, ...(parsed.siteSettings || {}) },
        };
      } else {
        this.saveToDisk();
      }
    } catch (err) {
      console.error('[DB] Failed to load database from disk, using seed data:', err);
      this.data = initialSeedData;
      this.saveToDisk();
    }
  }

  private saveToDisk() {
    try {
      this.ensureDataDir();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('[DB] Failed to persist database to disk:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.saveToDisk();
  }

  public addAuditLog(action: string, user: string, details: string) {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      user,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.saveToDisk();
  }

  // --- Booking helpers ---
  public checkSlotAvailable(date: string, timeSlot: string): boolean {
    const conflict = this.data.bookings.find(
      (b) => b.date === date && b.timeSlot === timeSlot && b.bookingStatus !== 'cancelled'
    );
    return !conflict;
  }

  public createBooking(booking: Omit<Booking, 'reference' | 'createdAt' | 'updatedAt'>): Booking {
    const ref = `SV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newBooking: Booking = {
      ...booking,
      reference: ref,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.bookings.unshift(newBooking);
    this.addAuditLog('BOOKING_CREATED', newBooking.clientEmail, `Booking ${ref} for ${booking.serviceName} on ${booking.date}`);
    this.saveToDisk();
    return newBooking;
  }

  public updateBooking(reference: string, updates: Partial<Booking>): Booking | null {
    const index = this.data.bookings.findIndex((b) => b.reference === reference);
    if (index === -1) return null;
    this.data.bookings[index] = {
      ...this.data.bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.addAuditLog('BOOKING_UPDATED', 'system', `Booking ${reference} updated: ${Object.keys(updates).join(', ')}`);
    this.saveToDisk();
    return this.data.bookings[index];
  }
}

export const db = new DatabaseStore();
