import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Sliders, ArrowUpRight, Sparkles, X, Info, CheckCircle2 } from 'lucide-react';
import { EquipmentItem } from '../types';

const CATEGORIES = [
  { id: 'all', name: 'ALL EQUIPMENT' },
  { id: 'microphones', name: 'MICROPHONES' },
  { id: 'outboard_gear', name: 'OUTBOARD & PREAMPS' },
  { id: 'consoles', name: 'CONSOLES & CONTROL' },
  { id: 'monitors_headphones', name: 'MONITORING & CUES' },
  { id: 'instruments', name: 'INSTRUMENTS & SYNTHS' },
];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState<EquipmentItem | null>(null);

  useEffect(() => {
    fetch('/api/equipment')
      .then((res) => res.json())
      .then((data) => {
        setEquipment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load equipment:', err);
        setLoading(false);
      });
  }, []);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [equipment, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>VERIFIED HARDWARE VAULT · LEKKI PHASE 1</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase">
            THE EQUIPMENT LIBRARY.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every piece of hardware in SONICVAULT is verified, calibrated, and maintained in pristine operating condition. 
            From the legendary Sony C-800G tube chain to SSL SuperAnalogue summing, these are the tools behind records that endure.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0a0e16] border border-white/10">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'accent-gradient text-white font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gear, mic, brand..."
              className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4E85BF] transition-colors"
            />
          </div>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs font-mono">
            Scanning verified equipment locker...
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs font-mono bg-[#080b12] rounded-2xl border border-white/10">
            No equipment matching your search filter. Try another keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group rounded-2xl bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/60 p-4 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(78,133,191,0.15)] hover:-translate-y-1 cursor-pointer"
              >
                {/* Image Frame */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center p-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#89AACC]">
                    {item.manufacturer}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    {item.room}
                  </span>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-[#89AACC] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer specs pill & action */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-[10px] text-slate-500">VIEW SPECS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#89AACC] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Closing Banner */}
        <div className="mt-20 pt-16 border-t border-white/10 text-center space-y-4">
          <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
            READY FOR YOUR PRODUCTION
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            THE TOOLS ARE READY. LET'S MAKE SOMETHING.
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Book a session in our Lekki Phase 1 facility and experience the precision of reference tube microphones and analog summing.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              to="/book-session"
              className="py-3 px-6 rounded-full accent-gradient text-white font-semibold text-xs tracking-wide shadow-md hover:opacity-90 transition-opacity"
            >
              BOOK A SESSION
            </Link>
            <Link
              to="/studio"
              className="py-3 px-6 rounded-full bg-white/5 border border-white/15 text-slate-300 font-semibold text-xs tracking-wide hover:text-white hover:bg-white/10 transition-colors"
            >
              EXPLORE ROOMS
            </Link>
          </div>
        </div>
      </div>

      {/* Detail Specifications Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0a0e16] border border-white/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-40 h-40 shrink-0 bg-black/60 rounded-xl border border-white/10 p-3 flex items-center justify-center">
                <img
                  src={activeModalItem.imageUrl}
                  alt={activeModalItem.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#4E85BF]/20 text-[#89AACC] border border-[#4E85BF]/30">
                  {activeModalItem.category.replace('_', ' ')} · {activeModalItem.room}
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  {activeModalItem.name}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Manufacturer: {activeModalItem.manufacturer} · Model: {activeModalItem.model}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeModalItem.description}
            </p>

            {/* Verified Specs */}
            {activeModalItem.specs && Object.keys(activeModalItem.specs).length > 0 && (
              <div className="space-y-2 bg-[#05080e] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-wider block font-semibold">
                  VERIFIED HARDWARE SPECIFICATIONS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(activeModalItem.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                      <span className="text-slate-500 font-mono text-[11px]">{k}</span>
                      <span className="font-medium text-right text-slate-200">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications */}
            {activeModalItem.applications && activeModalItem.applications.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  PRIMARY RECORDING APPLICATIONS
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeModalItem.applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{app}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link
                to={`/book-session?gear=${encodeURIComponent(activeModalItem.id)}`}
                className="py-2.5 px-5 rounded-xl accent-gradient text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-md"
              >
                <span>BOOK THIS RIG</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
