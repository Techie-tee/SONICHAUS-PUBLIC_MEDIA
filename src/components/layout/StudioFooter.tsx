import { Music, MapPin, Mail, Phone, Clock } from 'lucide-react';

export default function StudioFooter() {
  return (
    <footer className="bg-[#04060a] border-t border-white/10 text-slate-400 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 text-xs font-mono">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 border-b border-white/10 pb-8 sm:pb-12">
        {/* Col 1: Brand Wordmark */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3 text-white text-base font-bold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
              <Music className="w-4 h-4" />
            </span>
            <span className="font-display tracking-wider">SONICVAULT <span className="text-sky-400 font-light">STUDIOS</span></span>
          </div>
          <p className="text-slate-400 text-xs font-sans leading-relaxed">
            Where sound becomes art. A flagship architectural recording sanctum built for artists shaping modern sonic culture.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            EST. 2018 · RECORDING · MIXING · MASTERING
          </div>
        </div>

        {/* Col 2: Studio Location & Access */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider text-white font-semibold block font-display">
            Studio Facilities
          </span>
          <div className="space-y-2 text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>280 St. John Street, Clerkenwell Acoustic Quarter, London EC1V 4PB</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0" />
              <span>24/7 Access For Confirmed Lockout Bookings</span>
            </div>
          </div>
        </div>

        {/* Col 3: Direct Contacts */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider text-white font-semibold block font-display">
            Private Bookings
          </span>
          <div className="space-y-2 text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>sessions@sonicvaultstudios.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>+44 (0) 20 7946 0891</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Private gated valet parking & secure artist green room entrance.
            </p>
          </div>
        </div>

        {/* Col 4: Acoustical Certifications */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider text-white font-semibold block font-display">
            Acoustic Accreditation
          </span>
          <ul className="space-y-1.5 text-slate-400">
            <li>· Dolby Atmos 9.1.4 Spatial Mixing Certified</li>
            <li>· Apple Digital Masters Official Facility</li>
            <li>· Audio Engineering Society (AES) Sustaining Member</li>
            <li>· NC-15 Acoustic Noise Rating Verified</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px] text-center sm:text-left">
        <div>
          © 2026 SONICVAULT STUDIOS LTD. ALL RIGHTS RESERVED.
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
          <a href="#tour" className="hover:text-white transition-colors">Studio Tour</a>
          <a href="#spaces" className="hover:text-white transition-colors">Spaces</a>
          <a href="#gear" className="hover:text-white transition-colors">Gear Locker</a>
          <a href="#acoustics" className="hover:text-white transition-colors">Acoustics</a>
          <a href="#rates" className="hover:text-white transition-colors">Residency</a>
        </div>
      </div>
    </footer>
  );
}
