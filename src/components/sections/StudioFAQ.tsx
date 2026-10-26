import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Calendar,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Music2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StudioFAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords?: string[];
  actionType?: 'booking' | 'whatsapp' | 'equipment' | 'services';
}

const FALLBACK_FAQS: StudioFAQItem[] = [
  {
    id: 'cb_welcome',
    question: 'What is SonicVault Studios?',
    answer: 'SONICVAULT STUDIOS is a premier music recording, production, mixing, and mastering studio situated at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos, Nigeria. Our mission is Where Sound Becomes Art — pairing world-class analog hardware with acoustics engineered for pristine fidelity.',
    category: 'location',
    actionType: 'services',
  },
  {
    id: 'cb_location',
    question: 'Where are you located and what are your opening hours?',
    answer: 'We are located at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria. We operate 24/7 strictly by appointment to guarantee artists complete privacy, unhurried time in our chambers, and unbroken creative flow.',
    category: 'location',
    actionType: 'whatsapp',
  },
  {
    id: 'cb_services',
    question: 'What services do you offer at SonicVault?',
    answer: 'We provide Vocal Recording, Music Production & Beatmaking, Analog & Hybrid Mixing, Precision Mastering, Vocal Tuning & Comping, and Broadcast Podcast/Voice-over recording across our 4 acoustically decoupled chambers (Studio A Control Room, Vocal Booth, Production Lab, and Master Suite).',
    category: 'services',
    actionType: 'services',
  },
  {
    id: 'cb_pricing',
    question: 'How much are your studio rates and session prices?',
    answer: 'Our proposed rates begin at ₦35,000 for a 1-hour vocal recording session and scale with lockout packages and multi-track production bundles. All final rates are calculated dynamically during booking and confirmed with our studio director.',
    category: 'pricing',
    actionType: 'booking',
  },
  {
    id: 'cb_booking',
    question: 'How do I book a session and make payment?',
    answer: 'You can book directly through our online booking portal or click "Book a Session". We accept secure payments and deposits via Paystack (card, bank transfer, USSD). A deposit secures your exclusive room time.',
    category: 'booking',
    actionType: 'booking',
  },
  {
    id: 'cb_equipment',
    question: 'What gear and microphones do you have in the studio?',
    answer: 'The Vault is equipped with reference instruments and analog hardware including the Sony C-800G tube microphone, Neumann U87 Ai, Tube-Tech CL 1B compressor, Neve 1073SPX, SSL AWS 948 Delta console, Studer A800 tape transport, and Genelec 8351B coaxial point-source monitors.',
    category: 'equipment',
    actionType: 'equipment',
  },
  {
    id: 'cb_external_engineer',
    question: 'Can I bring my own external sound engineer or producer?',
    answer: 'Yes! Guest engineers and outside producers are welcome. A SonicVault staff technician will be on standby throughout your session to handle console routing, patchbays, microphone setup, and hardware recalls at zero extra charge.',
    category: 'sessions',
    actionType: 'booking',
  },
  {
    id: 'cb_file_prep',
    question: 'How should I prepare stems and files for mixing or mastering?',
    answer: 'Please export 24-bit or 32-bit float WAV/AIFF stems at 44.1kHz or 48kHz, all starting from timecode 0:00:00. Remove master bus limiters and dithering. Include rough demo mixes and BPM/key information in your zip archive.',
    category: 'services',
    actionType: 'whatsapp',
  },
  {
    id: 'cb_lockouts',
    question: 'Do you offer full-day lockouts or multi-day album production packages?',
    answer: 'Yes. We offer 12-hour full facility lockouts and multi-day production residencies. Lockouts include private lounge privileges, unmetered access to all analog outboard chains, and dedicated sound engineers.',
    category: 'booking',
    actionType: 'booking',
  },
  {
    id: 'cb_cancellation',
    question: 'What is your session rescheduling and cancellation policy?',
    answer: 'Sessions can be rescheduled without penalty up to 48 hours prior to your booked slot. Your deposit will be seamlessly credited toward your rescheduled date.',
    category: 'policies',
    actionType: 'whatsapp',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Questions',
  booking: 'Booking & Rates',
  pricing: 'Pricing',
  services: 'Services & Stems',
  equipment: 'Gear & Outboard',
  sessions: 'Sessions & Engineers',
  location: 'Location & Hours',
  policies: 'Studio Policies',
};

interface StudioFAQProps {
  onOpenBooking?: (serviceOrRoom?: string) => void;
}

export default function StudioFAQ({ onOpenBooking }: StudioFAQProps) {
  const [faqs, setFaqs] = useState<StudioFAQItem[]>(FALLBACK_FAQS);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['cb_booking', 'cb_pricing']);

  // Fetch live FAQ data dynamically from /api/faqs
  useEffect(() => {
    let isMounted = true;
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.faqs) && data.faqs.length > 0) {
            setFaqs(data.faqs);
          }
        }
      } catch (err) {
        // Fallback already pre-seeded
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        faq.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'booking' && (faq.category === 'booking' || faq.category === 'pricing'));

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchQ = faq.question.toLowerCase().includes(q);
      const matchA = faq.answer.toLowerCase().includes(q);
      const matchKeywords = faq.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;

      return matchQ || matchA || matchKeywords;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    if (openIds.length === filteredFaqs.length) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredFaqs.map((f) => f.id));
    }
  };

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#040609] border-t border-white/10 relative overflow-hidden">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#4E85BF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#89AACC]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 relative z-10">
        {/* Section Header with subtle fade-in-up entrance */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
            <HelpCircle className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>KNOWLEDGE & CONCIERGE FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
            COMMON STUDIO INQUIRIES.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about booking sessions, our analog signal chains, outside engineers, stem delivery, and studio policies.
          </p>
        </motion.div>

        {/* Search Bar & Category Controls with fade-in-up entrance */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword (e.g., deposit, Neumann, engineer, stems, 24/7, lockout)..."
              className="w-full pl-11 pr-16 py-3.5 rounded-2xl bg-[#090d16] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#4E85BF] transition-all font-sans shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Category Filter Pills & Toggle All Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none sm:flex-wrap">
              {['all', 'booking', 'services', 'equipment', 'sessions', 'policies'].map((catKey) => {
                const isActive = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#4E85BF] border-[#4E85BF] text-white shadow-md shadow-[#4E85BF]/25'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {CATEGORY_LABELS[catKey] || catKey}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleExpandAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 self-end sm:self-auto sm:ml-auto"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#4E85BF]" />
              <span>{openIds.length === filteredFaqs.length ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>
        </motion.div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-3">
              <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-mono text-slate-300">No questions matched your search query.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-mono text-[#89AACC] hover:text-white underline underline-offset-4"
              >
                Reset filters to view all studio FAQs
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isOpen = openIds.includes(item.id);
              const numStr = String(index + 1).padStart(2, '0');

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.08 }}
                  transition={{
                    duration: 0.42,
                    delay: Math.min(index * 0.05, 0.35),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#090d16] border-[#4E85BF]/50 shadow-xl shadow-[#4E85BF]/5'
                      : 'bg-[#070a12]/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Accordion Trigger */}
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4E85BF] bg-transparent"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className="text-xs font-mono font-bold text-[#89AACC] tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 shrink-0">
                        {numStr}
                      </span>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white font-display uppercase tracking-tight line-clamp-2 faq-question-title">
                        {item.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-[#89AACC] px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-1 border-t border-white/5 space-y-4">
                          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                            {item.answer}
                          </p>

                          {/* Quick Interactive Actions */}
                          <div className="pt-2 flex flex-wrap items-center gap-3">
                            {(item.category === 'booking' || item.category === 'pricing' || item.actionType === 'booking') && onOpenBooking && (
                              <button
                                onClick={() => onOpenBooking()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4E85BF] hover:bg-[#3D6E9F] text-white text-xs font-mono font-medium transition-colors shadow-md"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Book Session Now</span>
                              </button>
                            )}

                            {item.category === 'equipment' && (
                              <Link
                                to="/equipment"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-medium transition-colors"
                              >
                                <Music2 className="w-3.5 h-3.5 text-[#4E85BF]" />
                                <span>Explore Gear Locker</span>
                              </Link>
                            )}

                            {item.category === 'services' && (
                              <Link
                                to="/services"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-medium transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
                                <span>View Full Services</span>
                              </Link>
                            )}

                            <a
                              href="https://wa.me/2349015104502?text=Hello%20SonicVault%20Studios%2C%20I%20have%20an%20inquiry%20regarding%3A%20"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-medium transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Ask on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Studio Concierge Callout Banner */}
        <div className="faq-concierge-banner max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#090d16] via-[#0d1424] to-[#090d16] border border-[#4E85BF]/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#89AACC]">
                <ShieldCheck className="w-4 h-4 text-[#4E85BF]" />
                <span style={{ color: '#89AACC' }}>CONFIDENTIAL ARTIST CONCIERGE</span>
              </div>
              <h3
                style={{ color: '#FFFFFF' }}
                className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-tight drop-shadow-md"
              >
                HAVE A BESPOKE PROJECT OR ALBUM LOCKOUT?
              </h3>
              <p
                style={{ color: '#E2E8F0' }}
                className="text-xs sm:text-sm text-slate-200 font-sans max-w-xl drop-shadow-sm"
              >
                Our studio manager and chief acoustician are available 24/7 on WhatsApp for custom session riders, multi-day bookings, and equipment inquiries.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="https://wa.me/2349015104502?text=Hello%20SonicVault%2C%20I%20would%20like%20to%20discuss%20a%20bespoke%20session%20or%20album%20lockout"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow-lg hover:shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              {onOpenBooking && (
                <button
                  onClick={() => onOpenBooking()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#4E85BF]" />
                  <span>Book Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
