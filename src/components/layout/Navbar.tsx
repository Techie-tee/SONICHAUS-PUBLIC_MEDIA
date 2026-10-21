import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { audioEngine } from '../../services/audioEngine';
import BrandLogo from '../common/BrandLogo';

interface NavbarProps {
  onOpenBooking?: (serviceId?: string) => void;
}

const NAV_ITEMS = [
  { name: 'HOME', to: '/' },
  { name: 'STUDIO', to: '/studio' },
  { name: 'SERVICES', to: '/services' },
  { name: 'EQUIPMENT', to: '/equipment' },
  { name: 'OUR WORK', to: '/our-work' },
  { name: 'ABOUT', to: '/about' },
  { name: 'CONTACT', to: '/contact' },
];

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(() => (typeof audioEngine?.isMuted === 'function' ? audioEngine.isMuted() : typeof audioEngine?.getMuted === 'function' ? audioEngine.getMuted() : true));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync mute state if audio engine changes externally
  useEffect(() => {
    const syncMute = () => {
      const muted = typeof audioEngine?.isMuted === 'function' ? audioEngine.isMuted() : typeof audioEngine?.getMuted === 'function' ? audioEngine.getMuted() : true;
      setIsAudioMuted(muted);
    };
    const interval = setInterval(syncMute, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleBookClick = () => {
    setIsMobileMenuOpen(false);
    if (onOpenBooking) {
      onOpenBooking();
    } else {
      navigate('/book-session');
    }
  };

  return (
    <>
      {/* Fixed Top Header Container with Permanent Visual Consistency */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-5 pointer-events-none transition-all duration-300">
        {/* Top Viewport Shroud: Prevents underlying scroll text/cards from peeking into the top gap */}
        <div
          className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#040609] via-[#040609]/80 to-transparent pointer-events-none transition-opacity duration-300 ${
            isScrolled ? 'opacity-100' : 'opacity-70'
          }`}
          aria-hidden="true"
        />

        {/* Floating Consistent Header Pill */}
        <nav
          className={`relative pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 px-3.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full border shadow-[0_12px_40px_rgba(0,0,0,0.85)] w-full max-w-7xl transition-all duration-300 ${
            isScrolled
              ? 'bg-[#060913]/98 backdrop-blur-2xl border-white/20 shadow-[0_16px_50px_rgba(0,0,0,0.95)]'
              : 'bg-[#070a13]/95 backdrop-blur-2xl border-white/15'
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand Logo & Sonic Vault Emblem — 100% Solid & Stable Across All Viewports */}
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center tracking-tight shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4E85BF] rounded-lg"
          >
            <BrandLogo variant="horizontal" size="md" />
          </Link>

          {/* Desktop Navigation Links — Strict Whitespace & Zero Wrap */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 font-sans text-xs shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`px-2.5 xl:px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium tracking-wide whitespace-nowrap text-[11px] xl:text-xs ${
                    isActive
                      ? 'text-white bg-white/15 font-semibold shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls: Audio Toggle & Primary CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Live Audio Engine Toggle */}
            <button
              onClick={handleAudioToggle}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono border transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isAudioMuted
                  ? 'border-white/15 text-slate-300 hover:text-white hover:border-white/30 bg-black/50'
                  : 'border-[#4E85BF] text-[#89AACC] bg-[#4E85BF]/20 shadow-[0_0_15px_rgba(78,133,191,0.35)]'
              }`}
              title={isAudioMuted ? 'Turn Sound ON' : 'Mute Sound'}
              aria-label="Toggle Studio Audio"
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#89AACC] animate-pulse shrink-0" />
              )}
              <span className="hidden md:inline">{isAudioMuted ? 'SOUND: OFF' : 'SOUND: LIVE'}</span>
            </button>

            {/* Primary Action Button - Hidden on mobile (<640px) to prevent layout cramping; visible on sm+ */}
            <button
              onClick={handleBookClick}
              className="hidden sm:inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-white accent-gradient hover:opacity-95 active:scale-95 transition-all rounded-full shadow-md whitespace-nowrap cursor-pointer shrink-0"
            >
              <span>BOOK A SESSION</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Animated Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/98 backdrop-blur-3xl lg:hidden flex flex-col justify-between p-6 pt-20 overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/10 flex items-center justify-between">
              <BrandLogo variant="horizontal" size="md" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close Mobile Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#89AACC] uppercase block">
              STUDIO DESTINATIONS
            </span>
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-left py-2.5 text-xl sm:text-2xl font-display font-bold text-slate-200 hover:text-white transition-colors border-b border-white/5 flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 space-y-4 border-t border-white/10">
            <button
              onClick={handleBookClick}
              className="w-full py-3.5 text-sm font-bold text-white accent-gradient rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BOOK A SESSION NOW</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>LEKKI PHASE 1, LAGOS</span>
              <span className="text-[#89AACC]">AVAILABLE 24/7</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
