import { MapPin, Phone, MessageCircle, ArrowUpRight, ArrowUp } from 'lucide-react';
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
    <footer className="studio-footer-container bg-[#030508] border-t border-white/10 text-slate-400 py-16 sm:py-20 px-4 sm:px-6 lg:px-12 text-xs font-mono select-none">
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

          {/* Genuine Availability Status Indicator — Enforced on a single line */}
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-mono whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">STUDIO STATUS: SESSIONS ACTIVE · LEKKI PHASE 1</span>
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
              <MapPin className="w-4 h-4 text-[#EA4335] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#2563EB] shrink-0" />
              <a href="tel:09015104502" className="hover:text-white transition-colors font-mono font-bold text-slate-300">
                09015104502
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
              <a
                href="https://wa.me/2349015104502"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline transition-colors font-mono font-bold text-[#25D366]"
              >
                +234 901 510 4502 (WhatsApp)
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Official Google Gmail Icon */}
              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                <svg viewBox="52 42 88 66" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" aria-label="Official Gmail">
                  <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                  <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                  <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                  <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
                  <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                </svg>
              </div>
              <a href="mailto:Sonicvaultstudios@gmail.com" className="studio-email-link hover:text-white transition-colors font-mono font-bold">
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
                  className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm shadow-[#dc2743]/20 hover:scale-110 transition-all group"
                  aria-label="Follow SonicVault Studios on Instagram (opens in new tab)"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-label="Official Instagram">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/sonicvaultstudios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studio-footer-social-btn w-8 h-8 rounded-xl bg-black border border-white/20 hover:border-white/50 hover:bg-neutral-900 flex items-center justify-center text-white shadow-sm hover:scale-110 transition-all group"
                  aria-label="Follow SonicVault Studios on X (opens in new tab)"
                >
                  <svg className="w-3.5 h-3.5 fill-white text-white" viewBox="0 0 24 24" aria-label="Official X Logo">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/sonicvault-studios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="studio-footer-social-btn w-8 h-8 rounded-xl bg-[#0A66C2] hover:bg-[#004182] flex items-center justify-center text-white shadow-sm shadow-[#0A66C2]/25 hover:scale-110 transition-all group"
                  aria-label="Connect with SonicVault Studios on LinkedIn (opens in new tab)"
                >
                  <svg className="w-3.5 h-3.5 fill-white text-white" viewBox="0 0 24 24" aria-label="Official LinkedIn Logo">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.32a1.63 1.63 0 1 0 1.63 1.63c0-.9-.73-1.63-1.63-1.63z"/>
                  </svg>
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
