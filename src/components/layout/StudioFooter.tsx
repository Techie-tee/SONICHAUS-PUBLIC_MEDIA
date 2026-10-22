import { MapPin, Mail, Phone, MessageCircle, ArrowUpRight, ArrowUp, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';

interface StudioFooterProps {
  onOpenBooking?: (service?: string) => void;
}

export default function StudioFooter({ onOpenBooking }: StudioFooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030508] border-t border-white/10 text-slate-400 py-16 sm:py-20 px-4 sm:px-6 lg:px-12 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 border-b border-white/10 pb-12 sm:pb-16">
        {/* Col 1 & 2: Brand Identity & Monogram */}
        <div className="space-y-5 lg:col-span-2">
          <Link to="/" className="inline-flex items-center tracking-tight group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4E85BF] rounded-lg">
            <BrandLogo variant="horizontal" size="lg" showTagline={false} />
          </Link>

          <p className="text-slate-300 text-sm font-editorial italic max-w-sm leading-relaxed">
            WHERE SOUND BECOMES ART.
          </p>

          <p className="text-slate-400 text-xs font-sans leading-relaxed max-w-md">
            A flagship architectural music recording, production, mixing, and mastering studio located in Lekki Phase 1, Lagos, Nigeria. Built for artists shaping global sonic culture.
          </p>

          {/* Genuine Availability Status Indicator */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>STUDIO STATUS: SESSIONS ACTIVE · LEKKI PHASE 1</span>
          </div>
        </div>

        {/* Col 3: Navigation Destinations */}
        <div className="space-y-3.5">
          <span className="text-xs uppercase tracking-widest text-white font-semibold block font-display">
            Explore Studio
          </span>
          <ul className="space-y-2 text-slate-400 font-sans text-xs">
            <li>
              <Link to="/studio" className="hover:text-white transition-colors">Studio Tour</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition-colors">Studio Services</Link>
            </li>
            <li>
              <Link to="/equipment" className="hover:text-white transition-colors">Equipment Locker</Link>
            </li>
            <li>
              <Link to="/our-work" className="hover:text-white transition-colors">Our Work & Case Studies</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">About Us & Team</Link>
            </li>
            <li>
              <a href="/#faq" className="hover:text-white transition-colors">Studio FAQs</a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">Contact & Directions</Link>
            </li>
            <li>
              <Link to="/book-session" className="hover:text-[#89AACC] transition-colors font-semibold">Book a Session</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Verified Services & Production */}
        <div className="space-y-3.5">
          <span className="text-xs uppercase tracking-widest text-white font-semibold block font-display">
            Sonic Disciplines
          </span>
          <ul className="space-y-2 text-slate-400 font-sans text-xs">
            <li>Vocal Recording (Sony C-800G / U87)</li>
            <li>Afrobeats & Custom Production</li>
            <li>Analog SSL Hybrid Mixing</li>
            <li>Stereo & Dolby Atmos Mastering</li>
            <li>Vocal Tuning & Comping</li>
            <li>Broadcast Podcast Tracking</li>
            <li>Commercial Voice-Over</li>
          </ul>
        </div>

        {/* Col 5: Verified Studio Contact Details */}
        <div className="space-y-3.5">
          <span className="text-xs uppercase tracking-widest text-white font-semibold block font-display">
            Contact & Location
          </span>
          <div className="space-y-3 text-slate-400 font-sans text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#89AACC] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#89AACC] shrink-0" />
              <a href="tel:09015104502" className="hover:text-white transition-colors font-mono">
                09015104502
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
              <a
                href="https://wa.me/2349015104502"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-mono text-[#25D366]"
              >
                +234 901 510 4502 (WhatsApp)
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#89AACC] shrink-0" />
              <a href="mailto:Sonicvaultstudios@gmail.com" className="hover:text-white transition-colors font-mono">
                Sonicvaultstudios@gmail.com
              </a>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono block mb-2">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/sonicvaultstudio38"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all group"
                  aria-label="Follow SonicVault Studios on Instagram (opens in new tab)"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://twitter.com/sonicvaultstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all group"
                  aria-label="Follow SonicVault Studios on Twitter (opens in new tab)"
                >
                  <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://linkedin.com/company/sonicvault-studios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all group"
                  aria-label="Connect with SonicVault Studios on LinkedIn (opens in new tab)"
                >
                  <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Policies Row */}
      <div className="max-w-7xl mx-auto py-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
          <Link to="/booking-policy" className="hover:text-slate-300 transition-colors">Booking & Cancellation Policy</Link>
          <Link to="/payment-policy" className="hover:text-slate-300 transition-colors">Payment Policy</Link>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          aria-label="Back to top"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Bar: Copyright & Actions */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] text-center sm:text-left">
        <div>
          © {currentYear} SONICVAULT STUDIOS. ALL RIGHTS RESERVED. · LEKKI PHASE 1, LAGOS
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => onOpenBooking && onOpenBooking()}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-mono"
          >
            <span>BOOK A SESSION</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <a
            href="https://wa.me/2349015104502"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#25D366] transition-colors flex items-center gap-1 font-mono"
          >
            <span>WHATSAPP CONCIERGE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
