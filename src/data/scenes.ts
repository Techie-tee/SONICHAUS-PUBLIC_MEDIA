import { StudioSceneData } from '../types';
import entranceImg from '../assets/images/studio_01_entrance_1792446831639.jpg';
import vocalBoothImg from '../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../assets/images/mastering_suite_collaborating_1792679626184.jpg';

export const SCENES: StudioSceneData[] = [
  {
    id: 'studio-entrance',
    number: '01',
    title: 'THE STUDIO ENTRANCE',
    subtitle: 'Where great records begin.',
    caption: 'Step through the glass threshold into London’s premier architectural recording sanctuary.',
    roomName: 'Main Architectural Reception',
    dimensions: 'Gated Private Access',
    reverbTime: 'Acoustically Decoupled',
    highlightGear: ['Private Valet Access', 'Artist Green Room', 'Secure Reception'],
    ambientColor: '#38bdf8',
    imagePath: entranceImg
  },
  {
    id: 'vocal-booth',
    number: '02',
    title: 'THE VOCAL BOOTH',
    subtitle: 'Every great record begins with a voice.',
    caption: 'Floating architectural shell engineered for pristine vocal capture and intimate acoustic intimacy.',
    roomName: 'Vault Vocal Chamber',
    dimensions: '180 sq ft · 10.5 ft ceiling',
    reverbTime: 'RT60: 0.16s',
    highlightGear: ['Neumann U87 Vintage 1974', 'BAE 1073 Preamp', 'Tube-Tech CL 1B Compressor', 'Beyerdynamic DT 770 Pro'],
    ambientColor: '#0ea5e9',
    imagePath: vocalBoothImg
  },
  {
    id: 'control-room',
    number: '03',
    title: 'THE CONTROL ROOM & LIVE BOOTH',
    subtitle: 'Precision in every frequency. Emotion in every mix.',
    caption: 'Master control room with 48-channel SSL console overlooking the vocal booth through expansive acoustic glass.',
    roomName: 'Master Control & Tracking Suite',
    dimensions: '650 sq ft · Direct Sightlines',
    reverbTime: 'RT60: 0.22s flat to 20Hz',
    highlightGear: ['Solid State Logic 4000 G+ 48-Ch', 'Direct Booth Glass Sightline', 'ATC SCM110ASL Pro Mains', 'Yamaha NS-10M Studio'],
    ambientColor: '#06b6d4',
    imagePath: controlRoomImg
  },
  {
    id: 'production-lab',
    number: '04',
    title: 'THE PRODUCTION LAB',
    subtitle: 'From a spark of inspiration to a sound of your own.',
    caption: 'Modular synthesizer workshop, velocity drum stations, and multi-display DAW composition matrices.',
    roomName: 'Lab B Synthesis Suite',
    dimensions: '340 sq ft · Spatial Nearfield',
    reverbTime: 'RT60: 0.20s',
    highlightGear: ['Moog One Polyphonic Synth', 'Sequential Prophet-10', 'Akai MPC X Special Edition', 'Genelec 8351B SAM Monitors'],
    ambientColor: '#8b5cf6',
    imagePath: productionLabImg
  },
  {
    id: 'master-suite',
    number: '05',
    title: 'ANALOG MASTERING SUITE',
    subtitle: 'RECORD. PRODUCE. MIX. MASTER. RELEASE.',
    caption: 'Surgical analog equalization, harmonic tape saturation, and pristine 192kHz converter resolution.',
    roomName: 'Analog Mastering Suite',
    dimensions: '420 sq ft · Audiophile Grounding',
    reverbTime: 'RT60: 0.18s calibrated',
    highlightGear: ['Studer A800 2-Inch 24-Track Tape', 'Manley Massive Passive Tube EQ', 'Maselec MEA-2 Precision EQ', 'Burl Mothership B80'],
    ambientColor: '#10b981',
    imagePath: masterSuiteImg
  }
];
