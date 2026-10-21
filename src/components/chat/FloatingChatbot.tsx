import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ExternalLink, Sparkles, PhoneCall } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SonicVaultEmblemBadge } from '../common/BrandLogo';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  suggestions?: string[];
  timestamp: string;
  whatsappUrl?: string;
}

const INITIAL_WELCOME_MESSAGE =
  'Welcome to SONICVAULT STUDIOS — where sound becomes art. 🎙️ Are you here to book a session, explore our services, discover our equipment, or listen to our work?';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: INITIAL_WELCOME_MESSAGE,
      suggestions: ['Book a Session', 'View Services', 'Studio Equipment', 'Lekki Studio Location', 'Speak on WhatsApp'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const { currentTrack } = useAudioPlayer();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Keyboard accessibility: ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error('Query failed');
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.answer,
        suggestions: data.suggestions || ['Book a Session', 'Services', 'Speak on WhatsApp'],
        whatsappUrl: data.whatsappUrl,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: 'SONICVAULT STUDIOS is located at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos. For live assistance or bespoke session booking, reach our team on WhatsApp at +2349015104502.',
        suggestions: ['Book a Session', 'Speak on WhatsApp'],
        whatsappUrl: 'https://wa.me/2349015104502',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const bottomClass = currentTrack
    ? 'bottom-28 sm:bottom-24'
    : 'bottom-4 sm:bottom-6';

  return (
    <>
      {/* Floating Launcher Button */}
      <div className={`fixed ${bottomClass} right-3 sm:right-6 z-40 flex items-center gap-3 transition-all duration-300`}>
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-[#0e121b]/95 border border-[#4E85BF]/40 text-white shadow-[0_8px_32px_rgba(78,133,191,0.3)] hover:border-[#4E85BF] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
            aria-label="Open SonicVault AI Concierge"
          >
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89AACC] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#4E85BF]"></span>
            </span>
            <SonicVaultEmblemBadge size={22} className="group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-display text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-slate-200 whitespace-nowrap">
              <span className="hidden sm:inline">VAULT CONCIERGE</span>
              <span className="sm:hidden">CONCIERGE</span>
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="concierge-dialog-title"
          className="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[410px] h-[560px] max-h-[85vh] bg-[#0a0d14] border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 bg-[#0e131e] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <SonicVaultEmblemBadge size={32} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="concierge-dialog-title" className="font-display text-sm font-bold tracking-wide text-white">
                    SONICVAULT CONCIERGE
                  </h3>
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    AUTOMATED
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans">
                  Grounded in verified Lagos studio records
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#4E85BF] text-white rounded-tr-none shadow-md'
                      : 'bg-[#141924] text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Optional WhatsApp Human Escalation Link */}
                  {m.whatsappUrl && (
                    <a
                      href={m.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-medium hover:bg-emerald-600/30 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Chat with Studio Team on WhatsApp</span>
                    </a>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>

                {/* Quick Action Suggestion Chips */}
                {m.suggestions && m.suggestions.length > 0 && m.sender === 'bot' && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {m.suggestions.map((sug) => (
                      <button
                        key={sug}
                        onClick={() => {
                          if (sug === 'Book a Session') {
                            setIsOpen(false);
                            navigate('/book-session');
                          } else if (sug === 'Speak on WhatsApp') {
                            window.open('https://wa.me/2349015104502', '_blank', 'noopener,noreferrer');
                          } else if (sug === 'View Services') {
                            setIsOpen(false);
                            navigate('/services');
                          } else if (sug === 'Studio Equipment') {
                            setIsOpen(false);
                            navigate('/equipment');
                          } else if (sug === 'Lekki Studio Location') {
                            setIsOpen(false);
                            navigate('/contact');
                          } else {
                            handleSend(sug);
                          }
                        }}
                        className="text-[10px] font-sans px-2.5 py-1 rounded-full bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:border-[#89AACC] hover:bg-[#4E85BF]/10 transition-all cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Sparkles className="w-3.5 h-3.5 text-[#89AACC] animate-spin" />
                <span>Checking Vault knowledge base...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-4 py-2 bg-[#0a0d14] border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <Link
              to="/book-session"
              onClick={() => setIsOpen(false)}
              className="text-[#89AACC] hover:underline flex items-center gap-1"
            >
              <span>Instant Booking</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <a
              href="https://wa.me/2349015104502"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>WhatsApp Concierge</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#0e131e] border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about rates, microphones, booking..."
              className="flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4E85BF] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl accent-gradient text-white disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
