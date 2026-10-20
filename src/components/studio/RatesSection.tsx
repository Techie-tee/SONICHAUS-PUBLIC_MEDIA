import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface RatesSectionProps {
  onOpenBooking: (roomId?: string) => void;
}

export const RATES_PACKAGES = [
  {
    name: 'Standard Tracking Day',
    hours: '10 Hours',
    price: '$1,850',
    description: 'Perfect for full band live tracking, vocal tracking, or rhythm section capture.',
    features: [
      'Studio A Live Recording Hall or Control Room',
      'Resident Staff Recording Engineer included',
      'Access to Steinway Model D & Gretsch Custom Kit',
      'All microphones & preamps included',
      'Dedicated Studio Assistant',
      'Lounge & Refreshments',
    ],
    popular: false,
    roomId: 'recording-room',
  },
  {
    name: 'Album Production Residency',
    hours: '3-Day Lockout',
    price: '$5,200',
    description: 'Immersive creative residency for producers, songwriters, and recording artists.',
    features: [
      '24-Hour continuous facility lockout',
      'Studio A, Vocal Booth & Production Lab',
      'Senior Mix & Tracking Engineer',
      'Studer 2" 24-Track Tape Reel Tracking',
      'Private Master Producer Suite & Chef Lounge',
      'Dolby Atmos 9.1.4 Reference Playback',
    ],
    popular: true,
    roomId: 'lockout',
  },
  {
    name: 'Analog Master Suite',
    hours: 'Full Day',
    price: '$1,650',
    description: 'Audiophile tape mastering, surgical analog equalization, and stereo bus stem mastering.',
    features: [
      'Master Control Suite with SSL 4000 G+',
      'Fairchild 670 & Manley Massive Passive Tube EQ',
      'Burl Mothership 192kHz AD/DA Converters',
      'Mastering Engineer with 15+ years credits',
      'DDP & High-Res 24-bit/96kHz Release Masters',
      'Apple Digital Masters Certification',
    ],
    popular: false,
    roomId: 'control-room',
  },
];

export default function RatesSection({ onOpenBooking }: RatesSectionProps) {
  return (
    <section id="rates" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-2 sm:space-y-3">
            <div className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-sky-400">
              TRANSPARENT STUDIO RATES
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
              Residency & Session Packages
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
            All session bookings include calibrated room tuning, assistant engineer prep, zero equipment rental upcharges, and private lounge access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {RATES_PACKAGES.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between space-y-6 sm:space-y-8 ${
                pkg.popular
                  ? 'bg-gradient-to-b from-sky-950/30 via-slate-900/60 to-slate-950/80 border-sky-400/40 shadow-[0_0_35px_rgba(56,189,248,0.15)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sky-400 text-black text-[11px] font-mono font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Requested Residency</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{pkg.hours}</span>
                  <h3 className="text-2xl font-bold text-white font-display">{pkg.name}</h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">{pkg.price}</span>
                  <span className="text-xs font-mono text-slate-400">/ package</span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {pkg.description}
                </p>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                    What's Included:
                  </span>
                  <ul className="space-y-2.5">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking(pkg.roomId)}
                className={`w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  pkg.popular
                    ? 'bg-sky-400 hover:bg-sky-300 text-black shadow-lg shadow-sky-400/20'
                    : 'bg-white hover:bg-sky-400 text-black'
                }`}
              >
                <span>Book This Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
