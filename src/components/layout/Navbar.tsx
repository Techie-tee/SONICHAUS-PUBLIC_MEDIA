import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import ThemeToggle from '../common/ThemeToggle';

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

const MOBILE_NAV_ITEMS = [
  { name: 'HOME', to: '/' },
  { name: 'SERVICES', to: '/services' },
  { name: 'OUR WORK', to: '/our-work' },
  { name: 'ABOUT', to: '/about' },
  { name: 'CONTACT', to: '/contact' },
];

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      {/* Fixed Top Header Container with Permanent Visual Consistency across Mobile, Tablet, Desktop */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center px-2 pt-2 pb-1 sm:px-4 sm:py-3 md:px-5 md:py-3.5 lg:px-6 lg:py-4 pointer-events-none transition-all duration-300">
        {/* Top Viewport Shroud: Prevents underlying scroll text/cards from peeking into the top gap */}
        <div
          className={`navbar-top-shroud absolute top-0 inset-x-0 h-20 sm:h-24 bg-gradient-to-b from-[#040609] via-[#040609]/70 to-transparent pointer-events-none transition-opacity duration-300 ${
            isScrolled ? 'opacity-90' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Floating Consistent Header Pill — Precision Aligned for Mobile, Tablet, and Desktop */}
        <nav
          className={`navbar-pill relative pointer-events-auto flex items-center justify-between gap-1.5 sm:gap-3 md:gap-3 lg:gap-5 px-2 min-[360px]:px-2.5 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full border shadow-[0_12px_40px_rgba(0,0,0,0.85)] w-full max-w-[calc(100vw-12px)] sm:max-w-7xl transition-all duration-300 ${
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

          {/* Tablet & Desktop Navigation Links — Direct Navigation Visible on Tablet & Desktop */}
          <div className="hidden md:flex items-center gap-0.5 md:gap-1 lg:gap-1.5 xl:gap-2 font-sans shrink-0">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium tracking-wide whitespace-nowrap text-[10.5px] lg:text-[11.5px] xl:text-xs ${
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

          {/* Right Action Controls: Atmosphere Switch, Book Session CTA & Mobile Trigger */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4 shrink-0">
            {/* Classy Architectural Atmosphere Toggle Switch */}
            <ThemeToggle variant="navbar" />

            {/* Primary Action Button with subtle ripple glow / scale-up on hover (Active on Mobile, Tablet & Desktop) */}
            <div className="relative group inline-flex shrink-0">
              <span
                className="absolute -inset-1 rounded-full bg-[#4E85BF]/20 animate-ping pointer-events-none group-hover:scale-125 group-hover:opacity-40 group-hover:bg-[#4E85BF]/40 group-hover:shadow-[0_0_15px_rgba(78,133,191,0.5)] transition-all duration-500 blur-[1px]"
                style={{ animationDuration: '3.5s', animationIterationCount: 'infinite' }}
                aria-hidden="true"
              />
              <button
                onClick={handleBookClick}
                className="relative inline-flex items-center justify-center gap-0.5 sm:gap-2 px-2 min-[360px]:px-2.5 sm:px-5 md:px-6 lg:px-7 py-1 min-[360px]:py-1.5 sm:py-2 md:py-2.5 text-[10px] min-[360px]:text-[10.5px] sm:text-xs md:text-sm font-bold tracking-wider text-white accent-gradient hover:opacity-95 active:scale-95 transition-all duration-300 rounded-full shadow-[0_4px_20px_rgba(78,133,191,0.4)] hover:shadow-[0_6px_25px_rgba(78,133,191,0.6)] whitespace-nowrap cursor-pointer shrink-0 uppercase"
              >
                <span className="sm:hidden">BOOK</span>
                <span className="hidden sm:inline">BOOK A SESSION</span>
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>

            {/* Mobile Menu Hamburger (Visible on mobile screens < 768px, hidden on tablet & desktop) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="navbar-hamburger-btn md:hidden p-1 min-[360px]:p-1.5 sm:p-2 rounded-full transition-all cursor-pointer shrink-0 flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
            >
              {isMobileMenuOpen ? <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> : <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
            </button>
          </div>
        </nav>

        {/* Mobile Horizontal Navigation Header Bar — Placed directly below the top header pill in mobile preview */}
        <div className="md:hidden mt-1 sm:mt-1.5 w-full max-w-[calc(100vw-12px)] pointer-events-auto flex justify-center">
          <nav
            className="mobile-headers-bar flex items-center justify-between sm:justify-center gap-0.5 min-[360px]:gap-1 px-1.5 min-[360px]:px-2.5 py-0.5 min-[360px]:py-1 rounded-full w-full max-w-[440px] backdrop-blur-xl"
            aria-label="Mobile Studio Navigation"
          >
            {MOBILE_NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mobile-header-link flex-1 text-center px-1 min-[350px]:px-1.5 min-[380px]:px-2.5 py-0.5 min-[360px]:py-1 rounded-full text-[8.5px] min-[350px]:text-[9px] min-[380px]:text-[10px] min-[410px]:text-[10.5px] font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                    isActive ? 'active-header' : ''
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Animated Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-panel fixed inset-0 z-[60] bg-black/98 backdrop-blur-3xl md:hidden flex flex-col justify-between p-5 min-[380px]:p-6 pt-5 min-[380px]:pt-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-4 min-[380px]:space-y-5">
            <div className="pb-3 min-[380px]:pb-4 border-b border-white/10 flex items-center justify-between">
              <BrandLogo variant="horizontal" size="md" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-drawer-close-btn p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Close Mobile Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest text-[#89AACC] uppercase block">
                STUDIO DESTINATIONS
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                07 SECTIONS
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-left py-2 px-2.5 rounded-lg text-lg min-[380px]:text-xl font-display font-bold transition-all border-b border-white/5 flex items-center justify-between ${
                      isActive
                        ? 'text-cyan-400 bg-white/10 border-white/10'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      {item.name}
                    </span>
                    <ArrowUpRight className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-4 min-[380px]:pt-5 space-y-3.5 border-t border-white/10">
            {/* Theme Toggle within Mobile Navigation */}
            <ThemeToggle variant="drawer" />

            <button
              onClick={handleBookClick}
              className="w-full py-3 min-[380px]:py-3.5 text-xs min-[380px]:text-sm font-bold text-white accent-gradient rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider active:scale-95 transition-all"
            >
              <span>BOOK A SESSION NOW</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
              <span>LEKKI PHASE 1, LAGOS</span>
              <span className="text-[#89AACC]">AVAILABLE 24/7</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
