import { MessageCircle } from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

export default function FloatingWhatsApp() {
  const { currentTrack } = useAudioPlayer();
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
    });
  };

  return (
    <div
      className={`fixed ${bottomClass} left-3 sm:left-6 z-40 transition-all duration-300`}
    >
      <div className="relative group">
        {/* Subtle, non-distracting ping / ripple aura that catches the eye with hover glow and scale-up transition */}
        <span
          className="absolute -inset-1 rounded-full bg-[#25D366]/35 animate-ping pointer-events-none group-hover:scale-125 group-hover:opacity-75 group-hover:bg-[#25D366]/55 group-hover:shadow-[0_0_22px_rgba(37,211,102,0.85)] transition-all duration-300"
          style={{ animationDuration: '3s', animationIterationCount: 'infinite' }}
          aria-hidden="true"
        />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#128C7E] text-white shadow-[0_8px_30px_rgba(18,140,126,0.35)] hover:bg-[#075E54] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Chat with SonicVault on WhatsApp (+234 901 510 4502)"
          title="Direct WhatsApp Concierge: +234 901 510 4502"
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
