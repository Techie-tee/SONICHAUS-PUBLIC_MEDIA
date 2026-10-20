import { Music, MapPin, Mail, Phone, MessageCircle, ArrowUpRight, ShieldCheck, Instagram } from 'lucide-react';

interface StudioFooterProps {
  onOpenBooking?: (service?: string) => void;
}

export default function StudioFooter({ onOpenBooking }: StudioFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#030508] border-t border-white/10 text-slate-400 py-16 sm:py-20 px-4 sm:px-6 lg:px-12 text-xs font-mono select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 border-b border-white/10 pb-12 sm:pb-16">
        {/* Col 1 & 2: Brand Identity & Monogram */}
        <div className="space-y-5 lg:col-span-2">
          <div className="flex items-center gap-3 text-white text-base font-bold tracking-tight">
            <span className="w-8 h-8 rounded-full accent-gradient flex items-center justify-center text-white shadow-sm">
              <Music className="w-4 h-4" />
            </span>
            <span className="font-display tracking-wider text-base uppercase">
              SONICVAULT <span className="text-[#89AACC] font-light">STUDIOS</span>
            </span>
          </div>

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
              <a href="#tour" className="hover:text-white transition-colors">Immersive Tour</a>
            </li>
            <li>
              <a href="#spaces" className="hover:text-white transition-colors">Studio Spaces</a>
            </li>
            <li>
              <a href="#services" className="hover:text-white transition-colors">Services</a>
            </li>
            <li>
              <a href="#equipment" className="hover:text-white transition-colors">Equipment Locker</a>
            </li>
            <li>
              <a href="#work" className="hover:text-white transition-colors">Selected Work</a>
            </li>
            <li>
              <a href="#journal" className="hover:text-white transition-colors">Studio Journal</a>
            </li>
            <li>
              <a href="#explorations" className="hover:text-white transition-colors">Visual Explorations</a>
            </li>
          </ul>
        </div>

        {/* Col 4: Verified Services */}
        <div className="space-y-3.5">
          <span className="text-xs uppercase tracking-widest text-white font-semibold block font-display">
            Studio Services
          </span>
          <ul className="space-y-2 text-slate-400 font-sans text-xs">
            <li>Vocal Recording</li>
            <li>Music Production</li>
            <li>Analog & Digital Mixing</li>
            <li>Stereo & Stem Mastering</li>
            <li>Vocal Editing & Tuning</li>
            <li>Full Music Production</li>
            <li>Podcast & Voice-Over</li>
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

            <div className="pt-1 flex items-center gap-2 text-slate-400">
              <Instagram className="w-4 h-4 text-[#89AACC] shrink-0" />
              <span className="font-mono text-[11px]">@SONICVAULTSTUDIO38</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Actions */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] text-center sm:text-left">
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
