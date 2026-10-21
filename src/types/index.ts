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

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'super_admin' | 'studio_manager' | 'sound_engineer';
  createdAt: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  durationHours: number;
  priceNgn: number;
  depositNgn: number;
  isApproved: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: 'recording' | 'production' | 'mixing_mastering' | 'vocal_production' | 'creative_audio';
  tagline: string;
  description: string;
  deliverables: string[];
  processSteps: string[];
  preparationReqs: string[];
  verifiedRoom: string;
  defaultDurationHours: number;
  pricingType: 'hourly' | 'per_track' | 'custom_quote';
  draftPriceNgn: number;
  approvedPriceNgn: number;
  isPriceApproved: boolean;
  isPublished: boolean;
  packages: ServicePackage[];
}

export interface Booking {
  reference: string;
  serviceId: string;
  serviceName: string;
  packageName: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectDetails: string;
  durationHours: number;
  priceNgn: number;
  depositNgn: number;
  bookingStatus: 'pending_review' | 'pending_payment' | 'confirmed' | 'cancelled' | 'rescheduled' | 'completed';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded';
  paymentReference?: string;
  notes?: string;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  reference: string;
  bookingReference: string;
  amountNgn: number;
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'success' | 'failed' | 'abandoned' | 'refunded';
  paystackReference: string;
  channel?: string;
  paidAt?: string;
  isTestMode: boolean;
  idempotencyKey?: string;
  createdAt: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  category: 'microphones' | 'outboard_gear' | 'consoles' | 'monitors_headphones' | 'instruments' | 'acoustics';
  room: string;
  description: string;
  specs: Record<string, string>;
  applications: string[];
  imageUrl: string;
  isPublished: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  credits: string[];
  imageUrl: string;
  isFounder?: boolean;
  isPublished: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  artist: string;
  category: 'Artist Sessions' | 'Original Productions' | 'Mix & Master' | 'Sound in Motion';
  year: string;
  coverImage: string;
  audioUrl?: string;
  streamingLinks: {
    spotify?: string;
    appleMusic?: string;
    audiomack?: string;
    boomplay?: string;
    youtubeMusic?: string;
  };
  credits: {
    recordedBy?: string;
    mixedBy?: string;
    masteredBy?: string;
    producedBy?: string;
    studioRoom?: string;
  };
  caseStudyOverview: string;
  isPublished: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface ChatbotKnowledge {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  category: 'services' | 'pricing' | 'equipment' | 'location' | 'booking' | 'policies';
  isPublished: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
}
