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
  Music2,
  CreditCard,
  Layers,
  Sliders,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StudioFAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'booking' | 'pricing' | 'technical' | 'services' | 'policies' | string;
  keywords?: string[];
  actionType?: 'booking' | 'whatsapp' | 'equipment' | 'services';
}

const FALLBACK_FAQS: StudioFAQItem[] = [
  // 1. BOOKING
  {
    id: 'cb_booking',
    question: 'How do I book a session and confirm my slot?',
    answer: 'You can book directly through our online booking engine by selecting your preferred chamber (Vocal Booth, Live Recording Room, Control Room, Production Lab, or Master Suite), session date, and time. An instant deposit secures your dedicated slot on our calendar.',
    category: 'booking',
    keywords: ['book', 'booking', 'reserve', 'session', 'slot', 'calendar', 'confirm'],
    actionType: 'booking',
  },
  {
    id: 'cb_lockouts',
    question: 'Do you offer full-day lockouts or multi-day album production packages?',
    answer: 'Yes. We offer 12-hour full facility lockouts and multi-day production residencies. Lockouts include private lounge privileges, unmetered access to all analog outboard chains, and dedicated sound engineers.',
    category: 'booking',
    keywords: ['lockout', 'full day', 'residency', 'album', 'package', 'multi-day'],
    actionType: 'booking',
  },
  {
    id: 'cb_studio_tour',
    question: 'Can I schedule an in-person studio walk-through in Lekki before booking?',
    answer: 'Private architectural studio walk-throughs are available by appointment Monday through Sunday. You can tour our 5 decoupled chambers, inspect the outboard rack, and test our listening environment before your tracking date.',
    category: 'booking',
    keywords: ['tour', 'visit', 'walkthrough', 'inspection', 'lekki', 'in-person'],
    actionType: 'whatsapp',
  },
  {
    id: 'cb_cancellation',
    question: 'What is your session rescheduling and cancellation policy?',
    answer: 'Sessions can be rescheduled without penalty up to 48 hours prior to your booked slot. Your deposit will be seamlessly credited toward your rescheduled date with our studio director.',
    category: 'booking',
    keywords: ['cancel', 'cancellation', 'reschedule', 'deposit', 'policy', 'refund'],
    actionType: 'whatsapp',
  },

  // 2. PRICING
  {
    id: 'cb_pricing',
    question: 'How much are your studio rates and session prices?',
    answer: 'Our proposed rates begin at ₦35,000 for a 1-hour vocal recording session and scale with lockout packages and multi-track production bundles. All final rates are calculated dynamically during booking and confirmed with our studio director.',
    category: 'pricing',
    keywords: ['price', 'pricing', 'rate', 'rates', 'cost', 'how much', 'fee'],
    actionType: 'booking',
  },
  {
    id: 'cb_payment_methods',
    question: 'What payment methods do you accept, and is a deposit required?',
    answer: 'We accept secure payments via Paystack including Nigerian debit/credit cards, direct bank transfers, and USSD. A 50% deposit is required to lock your session on the calendar, with the balance settled before stem delivery.',
    category: 'pricing',
    keywords: ['pay', 'payment', 'paystack', 'deposit', 'card', 'transfer', 'ussd'],
    actionType: 'booking',
  },
  {
    id: 'cb_package_rates',
    question: 'Are there discounted rates for full EP or album production bundles?',
    answer: 'Yes! We provide tiered package discounts for multi-song projects, full album recording lockouts, and bundled mixing & mastering. Contact our studio manager on WhatsApp for custom artist budget riders.',
    category: 'pricing',
    keywords: ['discount', 'bundle', 'ep', 'album', 'deal', 'package', 'rates'],
    actionType: 'whatsapp',
  },

  // 3. TECHNICAL
  {
    id: 'cb_equipment',
    question: 'What gear and microphones do you have in the studio?',
    answer: 'The Vault is equipped with reference instruments and analog hardware including the Sony C-800G tube microphone, Neumann U87 Ai, Tube-Tech CL 1B compressor, Neve 1073SPX preamps, SSL AWS 948 Delta console, Studer A800 tape transport, and Genelec 8351B coaxial point-source monitors.',
    category: 'technical',
    keywords: ['gear', 'microphone', 'mic', 'hardware', 'ssl', 'neve', 'tubetech', 'genelec', 'technical'],
    actionType: 'equipment',
  },
  {
    id: 'cb_acoustics',
    question: 'What are the acoustical specifications and isolation ratings of your chambers?',
    answer: 'Every room is physically decoupled on floating concrete slabs to guarantee -80dB to -85dB isolation between concurrent sessions. Our rooms feature NC-15 background noise criteria, tuned Helmholtz bass traps, and custom timber diffusion arrays for flat, truthful monitoring.',
    category: 'technical',
    keywords: ['acoustics', 'isolation', 'decibel', 'nc-15', 'floating slab', 'frequency', 'treatment', 'technical'],
    actionType: 'equipment',
  },
  {
    id: 'cb_file_prep',
    question: 'How should I prepare stems and files for mixing or mastering?',
    answer: 'Please export 24-bit or 32-bit float WAV/AIFF stems at 44.1kHz or 48kHz, all starting from timecode 0:00:00. Remove master bus limiters and dithering. Include rough demo mixes and BPM/key information in your zip archive.',
    category: 'technical',
    keywords: ['stems', 'export', 'wav', 'sample rate', 'multitrack', 'mixing', 'mastering', 'technical'],
    actionType: 'whatsapp',
  },
  {
    id: 'cb_daw_specs',
    question: 'What DAW systems, converters, and sample rates do you support?',
    answer: 'We run Pro Tools Ultimate HDX, Logic Pro, and Ableton Live with Burl Mothership and Universal Audio Apollo X16 reference converters supporting high-resolution conversion up to 192kHz at 32-bit float.',
    category: 'technical',
    keywords: ['daw', 'pro tools', 'logic', 'ableton', 'burl', 'converter', 'sample rate', 'technical'],
    actionType: 'equipment',
  },
  {
    id: 'cb_external_engineer',
    question: 'Can I bring my own external sound engineer or producer?',
    answer: 'Yes! Guest engineers and outside producers are welcome. A SonicVault staff technician will be on standby throughout your session to handle console routing, patchbays, microphone setup, and hardware recalls at zero extra charge.',
    category: 'technical',
    keywords: ['engineer', 'producer', 'external', 'guest', 'patchbay', 'routing', 'technical'],
    actionType: 'booking',
  },

  // 4. SERVICES
  {
    id: 'cb_services',
    question: 'What services do you offer at SonicVault Studios?',
    answer: 'We provide Vocal Recording, Music Production & Beatmaking, Analog & Hybrid Mixing, Precision Mastering, Vocal Tuning & Comping, and Broadcast Podcast/Voice-over recording across our 5 acoustically decoupled chambers.',
    category: 'services',
    keywords: ['services', 'recording', 'mixing', 'mastering', 'production', 'podcast'],
    actionType: 'services',
  },

  // 5. POLICIES & LOCATION
  {
    id: 'cb_welcome',
    question: 'What is SonicVault Studios?',
    answer: 'SONICVAULT STUDIOS is a premier music recording, production, mixing, and mastering studio situated at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos, Nigeria. Our mission is Where Sound Becomes Art — pairing world-class analog hardware with acoustics engineered for pristine fidelity.',
    category: 'policies',
    keywords: ['about', 'who', 'what is', 'studio', 'overview'],
    actionType: 'services',
  },
  {
    id: 'cb_location',
    question: 'Where are you located and what are your opening hours?',
    answer: 'We are located at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria. We operate 24/7 strictly by appointment to guarantee artists complete privacy, unhurried time in our chambers, and unbroken creative flow.',
    category: 'policies',
    keywords: ['address', 'location', 'where', 'lekki', 'hours', '24/7', 'open'],
    actionType: 'whatsapp',
  },
];

interface CategoryFilterTab {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const CATEGORY_TABS: CategoryFilterTab[] = [
  { key: 'all', label: 'All Questions', icon: Sparkles, description: 'Complete studio knowledge base' },
  { key: 'booking', label: 'Booking', icon: Calendar, description: 'Session reservations, lockouts & rescheduling' },
  { key: 'pricing', label: 'Pricing', icon: CreditCard, description: 'Rates, deposits & payment methods' },
  { key: 'technical', label: 'Technical', icon: SlidersHorizontal, description: 'Hardware, mics, acoustics & stem prep' },
  { key: 'services', label: 'Services', icon: Layers, description: 'Tracking, production, mixing & mastering' },
  { key: 'policies', label: 'Policies', icon: ShieldCheck, description: 'Location, opening hours & studio rules' },
];

const CATEGORY_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  booking: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/25' },
  pricing: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/25' },
  technical: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/25' },
  services: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/25' },
  policies: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25' },
  location: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/25' },
  sessions: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/25' },
  equipment: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/25' },
};

interface StudioFAQProps {
  onOpenBooking?: (serviceOrRoom?: string) => void;
}

export default function StudioFAQ({ onOpenBooking }: StudioFAQProps) {
  const [faqs, setFaqs] = useState<StudioFAQItem[]>(FALLBACK_FAQS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['cb_booking', 'cb_pricing', 'cb_equipment']);

  // Fetch live FAQ data dynamically from /api/faqs
  useEffect(() => {
    let isMounted = true;
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.faqs) && data.faqs.length > 0) {
            // Merge backend data with fallback ensuring comprehensive technical/booking/pricing coverage
            const serverIds = new Set(data.faqs.map((f: StudioFAQItem) => f.id));
            const enriched = [
              ...data.faqs,
              ...FALLBACK_FAQS.filter((f) => !serverIds.has(f.id)),
            ];
            setFaqs(enriched);
          }
        }
      } catch (err) {
        // Fallback already pre-seeded
      }
    }
    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live category item counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: faqs.length,
      booking: 0,
      pricing: 0,
      technical: 0,
      services: 0,
      policies: 0,
    };

    faqs.forEach((faq) => {
      const cat = (faq.category || '').toLowerCase();
      if (cat === 'booking' || cat === 'sessions' || faq.id.includes('booking') || faq.id.includes('lockout')) {
        counts.booking++;
      }
      if (cat === 'pricing' || cat === 'rates' || faq.id.includes('pricing') || faq.id.includes('payment')) {
        counts.pricing++;
      }
      if (
        cat === 'technical' ||
        cat === 'equipment' ||
        faq.id.includes('equipment') ||
        faq.id.includes('gear') ||
        faq.id.includes('acoustics') ||
        faq.id.includes('file_prep') ||
        faq.id.includes('daw')
      ) {
        counts.technical++;
      }
      if (cat === 'services' || faq.id.includes('services')) {
        counts.services++;
      }
      if (cat === 'policies' || cat === 'location' || faq.id.includes('contact') || faq.id.includes('welcome')) {
        counts.policies++;
      }
    });

    return counts;
  }, [faqs]);

  // Filtered FAQs based on category and search query using React state
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const cat = (faq.category || '').toLowerCase();

      let matchesCategory = false;
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (selectedCategory === 'booking') {
        matchesCategory =
          cat === 'booking' ||
          cat === 'sessions' ||
          faq.id.includes('booking') ||
          faq.id.includes('lockout');
      } else if (selectedCategory === 'pricing') {
        matchesCategory =
          cat === 'pricing' ||
          cat === 'rates' ||
          faq.id.includes('pricing') ||
          faq.id.includes('payment') ||
          faq.id.includes('package');
      } else if (selectedCategory === 'technical') {
        matchesCategory =
          cat === 'technical' ||
          cat === 'equipment' ||
          faq.id.includes('equipment') ||
          faq.id.includes('gear') ||
          faq.id.includes('acoustics') ||
          faq.id.includes('file_prep') ||
          faq.id.includes('daw');
      } else if (selectedCategory === 'services') {
        matchesCategory = cat === 'services' || faq.id.includes('services');
      } else if (selectedCategory === 'policies') {
        matchesCategory =
          cat === 'policies' ||
          cat === 'location' ||
          faq.id.includes('cancellation') ||
          faq.id.includes('contact') ||
          faq.id.includes('welcome') ||
          faq.id.includes('location');
      } else {
        matchesCategory = cat === selectedCategory.toLowerCase();
      }

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

  const currentCategoryObj = CATEGORY_TABS.find((t) => t.key === selectedCategory) || CATEGORY_TABS[0];

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
            Everything you need to know about booking sessions, rates, our analog signal chains, outside engineers, stem delivery, and studio policies.
          </p>
        </motion.div>

        {/* Dynamic Category Filter Bar & Keyword Search Controls */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 max-w-4xl mx-auto"
        >
          {/* 1. Dynamic Category Filter Buttons (Booking, Pricing, Technical, etc.) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:justify-center">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.key;
              const count = categoryCounts[tab.key] ?? 0;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 border whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#4E85BF] border-[#4E85BF] text-white shadow-lg shadow-[#4E85BF]/30 scale-[1.03] font-semibold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                  aria-pressed={isActive}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#89AACC]'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. Search Input & Accordion Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. deposit, Neumann, engineer, stems, 24/7, lockout)..."
                className="w-full pl-11 pr-16 py-3 rounded-2xl bg-[#090d16] border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-[#4E85BF] transition-all font-sans shadow-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleExpandAll}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors shrink-0 w-full sm:w-auto justify-center cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>{openIds.length === filteredFaqs.length ? 'Collapse All' : 'Expand All'}</span>
            </button>
          </div>

          {/* 3. Filter Status Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[#89AACC]">Active Filter:</span>
              <span className="font-semibold text-white uppercase">{currentCategoryObj.label}</span>
              <span>•</span>
              <span>{filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} available</span>
            </div>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-[#4E85BF] hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Reset to All
              </button>
            )}
          </div>
        </motion.div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-14 px-6 rounded-2xl bg-[#090d16] border border-white/10 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm font-mono text-slate-300">
                No questions matched your search in category "{currentCategoryObj.label}".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-[#89AACC] hover:text-white transition-colors cursor-pointer"
              >
                <span>Reset all filters to view full FAQ catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isOpen = openIds.includes(item.id);
              const numStr = String(index + 1).padStart(2, '0');
              const rawCategory = (item.category || 'general').toLowerCase();
              const badgeStyle = CATEGORY_BADGE_STYLES[rawCategory] || {
                bg: 'bg-white/5',
                text: 'text-[#89AACC]',
                border: 'border-white/10',
              };

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
                    type="button"
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
                      <span
                        className={`hidden sm:inline-block text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        {rawCategory}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white shrink-0"
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
                                type="button"
                                onClick={() => onOpenBooking()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4E85BF] hover:bg-[#3D6E9F] text-white text-xs font-mono font-medium transition-colors shadow-md cursor-pointer"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Book Session Now</span>
                              </button>
                            )}

                            {(item.category === 'technical' || item.category === 'equipment') && (
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
                              href={`https://wa.me/2349015104502?text=${encodeURIComponent(`Hello SonicVault Studios, I have an inquiry regarding: ${item.question}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-medium transition-colors cursor-pointer"
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
                className="faq-whatsapp-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 cursor-pointer group border border-[#20ba59]/60"
                style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366] group-hover:rotate-12 transition-transform shrink-0" />
                <span className="text-white font-bold tracking-wider" style={{ color: '#FFFFFF' }}>CHAT ON WHATSAPP</span>
              </a>

              {onOpenBooking && (
                <button
                  type="button"
                  onClick={() => onOpenBooking()}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
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
