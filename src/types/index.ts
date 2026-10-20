export interface StudioSceneData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  caption: string;
  roomName: string;
  dimensions: string;
  reverbTime: string;
  highlightGear: string[];
  ambientColor: string;
  imagePath: string;
}

export interface GearItem {
  id: string;
  category: 'microphones' | 'preamps' | 'outboard' | 'monitoring' | 'instruments';
  name: string;
  make: string;
  description: string;
  year?: string;
  iconType: string;
}

export interface BookingPlan {
  roomId: string;
  roomName: string;
  sessionType: string;
  durationHours: number;
  date: string;
  timeSlot: string;
  engineerTier: 'self' | 'staff' | 'senior';
  tapeAddon: boolean;
  videoAddon: boolean;
  hospitalityAddon: boolean;
  clientName: string;
  clientEmail: string;
  clientNotes: string;
  totalCost: number;
}
