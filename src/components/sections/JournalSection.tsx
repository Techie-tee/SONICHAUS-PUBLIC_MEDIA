import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Clock, Calendar, BookOpen, X } from 'lucide-react';

import vocalBoothImg from '../../assets/images/studio_02_vocal_booth_1792446832131.jpg';
import controlRoomImg from '../../assets/images/studio_control_live_performance_1792447671011.jpg';
import productionLabImg from '../../assets/images/studio_04_production_lab_1792446833465.jpg';
import masterSuiteImg from '../../assets/images/mastering_suite_collaborating_1792679626184.jpg';

interface JournalEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string[];
}

const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-01',
    title: 'Finding the right vocal performance.',
    subtitle: 'Why psychological comfort, acoustic intimacy, and microphone matching outweigh technical perfection.',
    date: 'OCTOBER 2026',
    readTime: '4 MIN READ',
    category: 'VOCAL ARCHITECTURE',
    image: vocalBoothImg,
    content: [
      'The human voice is the most delicate and emotionally revealing instrument ever recorded. In our vocal chamber, we prioritize performer comfort before touching a preamp knob.',
      'A singer in emotional resonance will always outshine a pristine vocal track that lacks connection. Matching the microphone capsule—whether a vintage 1974 Neumann U87 or Telefunken tube—creates natural frequency complimentary space.',
      'We often dim lights, dial in tailored zero-latency headphone reverb, and capture the first three unvarnished takes while the inspiration is untouched by muscle fatigue.',
    ],
  },
  {
    id: 'entry-02',
    title: 'Why arrangement matters before mixing.',
    subtitle: 'Resolving frequency conflicts in the MIDI arrangement saves hours of surgical EQ later in the mix.',
    date: 'SEPTEMBER 2026',
    readTime: '6 MIN READ',
    category: 'PRODUCTION PERSPECTIVES',
    image: productionLabImg,
    content: [
      'Many mixing problems are not mixing problems at all—they are arrangement conflicts masquerading as muddy low-mids.',
      'When two instruments occupy the exact same octave in the same stereo pocket, they cancel each other out. By shifting chord voicings or alternating note lengths, every element finds its natural home.',
      'In our modular production lab, we dedicate time to pruning competing layers so the focal hook has effortless impact.',
    ],
  },
  {
    id: 'entry-03',
    title: 'The art of listening critically.',
    subtitle: 'Calibrated monitoring, acoustic room modes, and developing an honest ear in a decoupled control room.',
    date: 'AUGUST 2026',
    readTime: '5 MIN READ',
    category: 'ACOUSTIC SCIENCE',
    image: controlRoomImg,
    content: [
      'What you cannot hear accurately, you cannot mix honestly. In untreated rooms, standing waves create artificial 15dB peaks and nulls.',
      'SONICVAULT was engineered with floating concrete foundations and tuned membrane bass traps to deliver an honest linear response down to 18Hz.',
      'Critical listening is not about louder volume—it is about hearing micro-dynamics, phase cancellations, and stereo imaging at conversational listening levels.',
    ],
  },
  {
    id: 'entry-04',
    title: 'Preparing a record for mastering.',
    subtitle: 'Headroom management, dynamic crest factors, and leaving space for analog tape saturation.',
    date: 'JULY 2026',
    readTime: '4 MIN READ',
    category: 'MASTERING SUITE',
    image: masterSuiteImg,
    content: [
      'The greatest gift a mixing engineer can send to the mastering suite is dynamic headroom. Brickwall limiters on the master bus tie the mastering engineer’s hands.',
      'Aim for -6dB true peak headroom and avoid heavy clipping on the 2-bus. This allows our Studer A800 tape machine and analog transformers to add their rich harmonic saturation without harsh digital distortion.',
      'Deliver un-dithered 24-bit or 32-bit float files at native sample rates for Apple Digital Masters certification.',
    ],
  },
];

export default function JournalSection() {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEntry) {
        setSelectedEntry(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntry]);

  return (
    <section id="journal" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#05070c] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
              <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
              <span>FROM THE CONTROL ROOM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
              NOTES ON THE CREATIVE PROCESS.
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Ideas, techniques, and perspectives from the world of recording, production, and sonic engineering.
          </p>
        </div>

        {/* Magazine-Style Horizontal Rows */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {JOURNAL_ENTRIES.map((entry) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedEntry(entry)}
              className="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/[0.02] px-4 -mx-4 rounded-xl transition-all duration-300 cursor-pointer"
            >
              {/* Left Column: Image Thumbnail & Title */}
              <div className="flex items-start sm:items-center gap-5 sm:gap-8 flex-1">
                <div className="w-20 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 group-hover:border-[#4E85BF]/40 transition-colors">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-[#89AACC]">
                    <span className="uppercase tracking-widest">{entry.category}</span>
                    <span>·</span>
                    <span className="text-slate-400">{entry.readTime}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white group-hover:text-[#89AACC] transition-colors font-display">
                    {entry.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-1 max-w-2xl font-sans">
                    {entry.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Column: Metadata & Read Action */}
              <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 text-xs font-mono">
                <span className="text-slate-500 uppercase tracking-wider hidden sm:inline">
                  {entry.date}
                </span>
                <span className="w-10 h-10 rounded-full border border-white/15 bg-white/5 text-white flex items-center justify-center group-hover:accent-gradient group-hover:border-transparent transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEntry(null)}
            className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="journal-entry-title"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#090d16] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl text-white space-y-6 my-8 max-h-[88vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedEntry(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Essay"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono text-[#89AACC]">
                  <span className="uppercase tracking-widest">{selectedEntry.category}</span>
                  <span>·</span>
                  <span className="text-slate-400">{selectedEntry.date}</span>
                </div>
                <h3 id="journal-entry-title" className="text-2xl sm:text-3xl font-extrabold font-display">
                  {selectedEntry.title}
                </h3>
                <p className="text-sm text-slate-300 font-sans italic">
                  {selectedEntry.subtitle}
                </p>
              </div>

              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={selectedEntry.image}
                  alt={selectedEntry.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed border-t border-white/10 pt-6">
                {selectedEntry.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>EST. 2026 · SONICVAULT STUDIOS</span>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  CLOSE ESSAY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
