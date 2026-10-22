import { motion } from 'motion/react';
import {
  MapPin,
  Clock,
  Zap,
  Wifi,
  ShieldCheck,
  Car,
  Coffee,
  VolumeX,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudioLocationSectionProps {
  onOpenBooking: () => void;
}

export default function StudioLocationSection({ onOpenBooking }: StudioLocationSectionProps) {
  const whatsappUrl =
    'https://wa.me/2349015104502?text=' +
    encodeURIComponent('Hello SonicVault Studios, I would like to enquire about visiting the studio in Lekki Phase 1.');

  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos, Nigeria');

  const facilityHighlights = [
    {
      icon: Zap,
      title: 'Uninterrupted 24/7 Power',
      description:
        'Dual industrial diesel generators backed by automated solar inverter battery arrays with zero-second transfer time. Zero lost takes.',
    },
    {
      icon: VolumeX,
      title: '-80dB Acoustic Isolation',
      description:
        'Fully decoupled floating concrete floors, dual-leaf acoustic glazing, and room-within-a-room construction for absolute silence.',
    },
    {
      icon: Wifi,
      title: 'High-Speed Starlink Connectivity',
      description:
        'Ultra-low-latency satellite uplink for lightning-fast multi-gigabyte stem deliveries to international labels and overseas collaborators.',
    },
    {
      icon: ShieldCheck,
      title: 'Private Gated Perimeter',
      description:
        'Discreet, 24-hour guarded security compound with secure on-site parking for artists, executive management, and entourage.',
    },
    {
      icon: Coffee,
      title: 'VIP Artist Lounge & Green Room',
      description:
        'Private green room, en-suite executive washroom, premium refreshments, and secluded writing zones between tracking passes.',
    },
    {
      icon: Clock,
      title: '24/7 By Appointment Only',
      description:
        'Strict advance reservation policy ensuring each artist has exclusive, uninterrupted access to their booked chamber without crossover.',
    },
  ];

  return (
    <section id="location-facility" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 bg-[#05070d] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>THE SANCTUARY · LEKKI PHASE 1</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
              STUDIO LOCATION & AMENITIES.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              Engineered from the ground up for privacy, flawless reliability, and uncompromised creative immersion in the heart of Lagos.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-4 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-wider text-white transition-colors"
            >
              Contact & Directions
            </Link>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-full bg-[#4E85BF] hover:bg-[#3d6ca1] text-xs font-mono font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(78,133,191,0.35)] transition-all cursor-pointer"
            >
              Book Session
            </button>
          </div>
        </div>

        {/* 2-Column Split: Left = Location Dossier, Right = Facility Invariants */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (5 cols): Exact Address & Direct Contact Dossier */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 rounded-3xl bg-[#090d16] border border-white/10 p-6 sm:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#89AACC] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#4E85BF]" />
                <span>PHYSICAL RESIDENCY</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight uppercase">
                  38 Olanrewaju Ninalowo Crescent
                </h3>
                <p className="text-sm text-slate-400 font-sans mt-1">
                  Lekki Phase 1, Lagos State, Nigeria
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#4E85BF] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-white font-semibold block uppercase">
                      OPERATING HOURS
                    </span>
                    <span className="text-xs text-slate-400">
                      Monday – Sunday: 24/7 strictly by confirmed appointment
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                  <ShieldCheck className="w-4 h-4 text-[#4E85BF] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-white font-semibold block uppercase">
                      ACCESS PROTOCOL
                    </span>
                    <span className="text-xs text-slate-400">
                      Private gated entrance with prior security clearance
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 block">
                  DIRECT CONCIERGE CHANNELS
                </span>

                <a
                  href="tel:09015104502"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-xs font-mono text-white">
                    <Phone className="w-4 h-4 text-[#4E85BF]" />
                    <span>09015104502</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors">
                    Studio Line →
                  </span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-xs font-mono text-emerald-300">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>+234 901 510 4502</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Instant WhatsApp →
                  </span>
                </a>

                <a
                  href="mailto:Sonicvaultstudios@gmail.com"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-xs font-mono text-white">
                    <Mail className="w-4 h-4 text-[#4E85BF]" />
                    <span>Sonicvaultstudios@gmail.com</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors">
                    Email Desk →
                  </span>
                </a>
              </div>
            </div>

            {/* Driving Directions & Map Button */}
            <div className="pt-4 border-t border-white/10">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-mono uppercase tracking-wider text-white transition-all"
              >
                <MapPin className="w-4 h-4 text-[#89AACC]" />
                <span>Open in Google Maps / Get Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Column (7 cols): Studio Invariants & Infrastructure Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facilityHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-white/10 flex flex-col justify-between space-y-3 hover:border-[#4E85BF]/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#4E85BF] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold font-display text-white tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
