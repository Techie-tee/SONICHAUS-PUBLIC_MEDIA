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
  draftPriceNgn: number; // Proposed starting value
  approvedPriceNgn: number; // Active price only when isPriceApproved = true
  isPriceApproved: boolean; // Explicit administrator approval required
  isPublished: boolean;
  packages: ServicePackage[];
}

export interface Booking {
  reference: string;
  serviceId: string;
  serviceName: string;
  packageName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 - 12:00"
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
  genre?: string;
  type?: string;
  bpm?: number;
  key?: string;
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

export interface SiteSettings {
  studioName: string;
  address: string;
  phone: string;
  internationalWhatsApp: string;
  email: string;
  socialHandle: string;
  openingHours: string;
  paystackTestMode: boolean;
  paystackPublicKey: string;
}

export interface DatabaseSchema {
  adminUsers: AdminUser[];
  services: ServiceItem[];
  bookings: Booking[];
  payments: PaymentTransaction[];
  equipment: EquipmentItem[];
  team: TeamMember[];
  projects: ProjectItem[];
  enquiries: Enquiry[];
  chatbotKnowledge: ChatbotKnowledge[];
  auditLogs: AuditLog[];
  siteSettings: SiteSettings;
}
