import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Music } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
}

const NAV_LINKS = [
  { name: 'Home', href: '#tour' },
  { name: 'Studio', href: '#spaces' },
  { name: 'Services', href: '#services' },
  { name: 'Equipment', href: '#equipment' },
  { name: 'Our Work', href: '#work' },
  { name: 'Journal', href: '#journal' },
  { name: 'Contact', href: '#booking' },
];

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('tour');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Scroll listener for sticky pill appearance & active section detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);

      // Detect active section based on scroll position
      const sections = ['tour', 'spaces', 'services', 'equipment', 'work', 'journal', 'booking'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioToggle = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleNavLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Pill-Shaped Fixed Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-2 sm:gap-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-[#0e121b]/85 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.65)] max-w-5xl w-full'
              : 'bg-black/45 backdrop-blur-md border border-white/10 w-full max-w-7xl'
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand Wordmark & Monogram */}
          <a
            href="#tour"
            onClick={(e) => {
              e.preventDefault();
              handleNavLinkClick('#tour');
            }}
            className="flex items-center gap-2.5 text-white tracking-tight shrink-0 group"
          >
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full accent-gradient flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Music className="w-3.5 h-3.5" />
            </span>
            <span className="font-display tracking-wider text-xs sm:text-sm font-bold uppercase">
              SONICVAULT <span className="text-[#89AACC] font-light">STUDIOS</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 font-sans text-xs">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavLinkClick(link.href)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                    isActive
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Right Action Controls: Audio Toggle & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Audio Engine Toggle */}
            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono border transition-all whitespace-nowrap cursor-pointer ${
                isAudioMuted
                  ? 'border-white/15 text-slate-400 hover:text-white hover:border-white/30 bg-black/40'
                  : 'border-[#4E85BF] text-[#89AACC] bg-[#4E85BF]/15 shadow-[0_0_15px_rgba(78,133,191,0.35)]'
              }`}
              title={isAudioMuted ? 'Turn Sound ON' : 'Mute Sound'}
              aria-label="Toggle Studio Audio"
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#89AACC] animate-pulse" />
              )}
              <span className="hidden md:inline">{isAudioMuted ? 'SOUND: OFF' : 'SOUND: LIVE'}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenBooking()}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white accent-gradient hover:opacity-90 transition-opacity rounded-full shadow-md whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>BOOK A SESSION</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-2xl lg:hidden flex flex-col justify-between p-6 pt-24 animate-fade-in">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#89AACC] uppercase block">
              STUDIO DESTINATIONS
            </span>
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavLinkClick(link.href)}
                  className="text-left py-2.5 text-2xl font-display font-bold text-slate-200 hover:text-white transition-colors border-b border-white/5 flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3.5 rounded-xl accent-gradient text-white font-bold text-sm tracking-wider uppercase shadow-xl"
            >
              BOOK A SESSION NOW
            </button>

            <div className="text-center text-[11px] font-mono text-slate-400">
              38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos
            </div>
          </div>
        </div>
      )}
    </>
  );
}
