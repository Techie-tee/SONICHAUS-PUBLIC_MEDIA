import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, MessageCircle, Sparkles, Music } from 'lucide-react';

import masterSuiteImg from '../../assets/images/mastering_suite_collaborating_1792679626184.jpg';

interface FinalCinematicCTAProps {
  onOpenBooking: () => void;
}

export default function FinalCinematicCTA({ onOpenBooking }: FinalCinematicCTAProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  // GSAP seamless infinite typography marquee
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -50,
        ease: 'none',
        duration: 24,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  const whatsappUrl = 'https://wa.me/2349015104502?text=Hello%20SONICVAULT%20STUDIOS!%20I%20would%20like%20to%20enquire%20about%20booking%20a%20recording%20session.';

  return (
    <section className="relative py-28 sm:py-40 bg-[#040609] overflow-hidden border-t border-white/10 select-none">
      {/* Background Cinematic Studio Visual with Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <img
          src={masterSuiteImg}
          alt="SonicVault Analog Mastering Suite"
          className="w-full h-full object-cover filter brightness-50 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-[#040609]/80 to-[#040609]" />
      </div>

      {/* Radial Blue Accent Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4E85BF] rounded-full blur-[200px] opacity-20 pointer-events-none" />

      {/* Seamless Continuous GSAP Marquee */}
      <div className="w-full overflow-hidden whitespace-nowrap py-6 border-y border-white/10 bg-black/40 backdrop-blur-md mb-16 sm:mb-24">
        <div ref={marqueeRef} className="inline-flex items-center text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-[#89AACC]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span>YOUR SOUND. YOUR WORLD. YOUR LEGACY.</span>
              <span className="w-1.5 h-1.5 rounded-full accent-gradient inline-block" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 sm:space-y-12">
        {/* Monogram Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
          <Music className="w-3.5 h-3.5 text-[#4E85BF]" />
          <span>SONICVAULT STUDIOS · LEKKI PHASE 1, LAGOS</span>
        </div>

        {/* Closing Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-display uppercase tracking-tight leading-[1.05]">
            YOUR NEXT GREAT RECORD <br className="hidden sm:inline" />
            <span className="accent-gradient-text">STARTS HERE.</span>
          </h2>
          <p className="text-base sm:text-xl md:text-2xl font-light text-slate-300 font-sans max-w-2xl mx-auto">
            Bring the idea. We'll help you shape the sound.
          </p>
        </div>

        {/* Dual Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <div className="relative group w-full sm:w-auto">
            <span
              className="absolute -inset-0.5 rounded-full bg-[#4E85BF]/15 animate-ping pointer-events-none group-hover:scale-125 group-hover:opacity-30 group-hover:bg-[#4E85BF]/30 group-hover:shadow-[0_0_12px_rgba(78,133,191,0.3)] transition-all duration-500 blur-[1px]"
              style={{ animationDuration: '4s', animationIterationCount: 'infinite' }}
              aria-hidden="true"
            />
            <button
              onClick={onOpenBooking}
              className="relative w-full sm:w-auto px-9 py-4 rounded-full accent-gradient text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_35px_rgba(78,133,191,0.45)] hover:opacity-90 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>BOOK A SESSION</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>CHAT ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </section>
  );
}
