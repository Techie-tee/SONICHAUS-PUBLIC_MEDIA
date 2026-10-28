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
      {/* Fixed Top Header Container with Permanent Visual Consistency */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-2.5 sm:p-4 lg:p-5 pointer-events-none transition-all duration-300">
        {/* Top Viewport Shroud: Prevents underlying scroll text/cards from peeking into the top gap */}
        <div
          className={`navbar-top-shroud absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#040609] via-[#040609]/70 to-transparent pointer-events-none transition-opacity duration-300 ${
            isScrolled ? 'opacity-90' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Floating Consistent Header Pill */}
        <nav
          className={`navbar-pill relative pointer-events-auto flex items-center justify-between gap-1.5 min-[360px]:gap-2 sm:gap-4 lg:gap-6 px-2.5 min-[360px]:px-3.5 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full border shadow-[0_12px_40px_rgba(0,0,0,0.85)] w-full max-w-7xl transition-all duration-300 ${
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

          {/* Right Action Controls: Classy Atmosphere Switch & Expanded Book Session CTA */}
          <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-4 shrink-0">
            {/* Classy Architectural Atmosphere Toggle Switch */}
            <ThemeToggle variant="navbar" />

            {/* Expanded Primary Action Button with subtle ripple glow / scale-up on hover */}
            <div className="hidden sm:inline-flex relative group">
              <span
                className="absolute -inset-1 rounded-full bg-[#4E85BF]/20 animate-ping pointer-events-none group-hover:scale-125 group-hover:opacity-40 group-hover:bg-[#4E85BF]/40 group-hover:shadow-[0_0_15px_rgba(78,133,191,0.5)] transition-all duration-500 blur-[1px]"
                style={{ animationDuration: '3.5s', animationIterationCount: 'infinite' }}
                aria-hidden="true"
              />
              <button
                onClick={handleBookClick}
                className="relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 md:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-bold tracking-wider text-white accent-gradient hover:opacity-95 active:scale-95 transition-all duration-300 rounded-full shadow-[0_4px_20px_rgba(78,133,191,0.4)] hover:shadow-[0_6px_25px_rgba(78,133,191,0.6)] whitespace-nowrap cursor-pointer shrink-0 uppercase"
              >
                <span>BOOK A SESSION</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>

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
        <div className="mobile-drawer-panel fixed inset-0 z-50 bg-black/98 backdrop-blur-3xl lg:hidden flex flex-col justify-between p-6 pt-20 overflow-y-auto animate-in fade-in duration-200">
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

          <div className="pt-6 space-y-4 border-t border-white/10">
            {/* Theme Toggle within Mobile Navigation */}
            <ThemeToggle variant="drawer" />

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
