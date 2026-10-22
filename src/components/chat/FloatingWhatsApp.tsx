import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

// Studio operating hours as defined in schema metadata & site settings
// (Monday–Sunday: 00:00 - 23:59 / 24/7 by appointment)
const STUDIO_OPERATING_SCHEDULE = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opens: '00:00',
  closes: '23:59',
  label: '24/7 Studio Concierge',
};

function checkIsStudioOpen(): boolean {
  try {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];

    if (!STUDIO_OPERATING_SCHEDULE.days.includes(currentDay)) {
      return false;
    }

    const [openH, openM] = STUDIO_OPERATING_SCHEDULE.opens.split(':').map(Number);
    const [closeH, closeM] = STUDIO_OPERATING_SCHEDULE.closes.split(':').map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } catch {
    return true; // Default to available per 24/7 metadata
  }
}

export default function FloatingWhatsApp() {
  const { currentTrack } = useAudioPlayer();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    setIsAvailable(checkIsStudioOpen());
    // Re-check periodically every minute
    const interval = setInterval(() => {
      setIsAvailable(checkIsStudioOpen());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const whatsappUrl =
    'https://wa.me/2349015104502?text=' +
    encodeURIComponent('Hello SonicVault Studios, I would like to enquire about booking a studio session.');

  const bottomClass = currentTrack
    ? 'bottom-28 sm:bottom-24'
    : 'bottom-4 sm:bottom-6';

  const handleWhatsAppClick = () => {
    console.log('[ENGAGEMENT_TRACKER] WhatsApp Concierge button clicked', {
      timestamp: new Date().toISOString(),
      action: 'whatsapp_concierge_open',
      channel: 'whatsapp',
      phone: '+2349015104502',
      sourceUrl: window.location.href,
      path: window.location.pathname,
      studioAvailable: isAvailable,
    });
  };

  return (
    <div
      className={`fixed ${bottomClass} left-3 sm:left-6 z-40 transition-all duration-300`}
    >
      <div className="relative group">
        {/* Minimally subtle ping / ripple aura with soft hover glow */}
        <span
          className="absolute -inset-0.5 rounded-full bg-[#25D366]/15 animate-ping pointer-events-none group-hover:scale-125 group-hover:opacity-30 group-hover:bg-[#25D366]/30 group-hover:shadow-[0_0_10px_rgba(37,211,102,0.3)] transition-all duration-500 blur-[1px]"
          style={{ animationDuration: '4s', animationIterationCount: 'infinite' }}
          aria-hidden="true"
        />

        {/* Small Live/Available indicator badge reflecting studio's actual operating hours */}
        <div
          className="absolute -top-2.5 right-1 sm:right-2 z-20 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-[#031d13]/95 border border-[#25D366]/60 shadow-[0_2px_10px_rgba(37,211,102,0.4)] backdrop-blur-md pointer-events-none transition-transform group-hover:scale-105"
          title="Studio Operating Hours: Monday – Sunday 24/7 By Appointment"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isAvailable ? 'bg-emerald-400 opacity-75' : 'bg-slate-400 opacity-50'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                isAvailable ? 'bg-[#25D366]' : 'bg-slate-500'
              }`}
            />
          </span>
          <span className="font-mono text-[8px] sm:text-[9px] font-bold text-emerald-300 uppercase tracking-wider">
            {isAvailable ? 'Available' : 'Offline'}
          </span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#128C7E] text-white shadow-[0_8px_30px_rgba(18,140,126,0.35)] hover:bg-[#075E54] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Chat with SonicVault on WhatsApp (+234 901 510 4502)"
          title="Direct WhatsApp Concierge: +234 901 510 4502 (Operating 24/7)"
        >
          <MessageCircle className="w-4 h-4 fill-white text-[#128C7E] group-hover:rotate-12 transition-transform shrink-0" />
          <span className="font-display text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap">
            <span className="hidden sm:inline">WHATSAPP CONCIERGE</span>
            <span className="sm:hidden">WHATSAPP</span>
          </span>
        </a>
      </div>
    </div>
  );
}
