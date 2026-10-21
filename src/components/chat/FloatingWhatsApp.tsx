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

  return (
    <div
      className={`fixed ${bottomClass} left-3 sm:left-6 z-40 transition-all duration-300`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#128C7E] text-white shadow-[0_8px_30px_rgba(18,140,126,0.35)] hover:bg-[#075E54] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
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
  );
}
