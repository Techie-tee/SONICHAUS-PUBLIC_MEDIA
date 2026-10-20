import { useState } from 'react';
import { ArrowRight, Layers, Sliders, Volume2, ShieldCheck, Check } from 'lucide-react';
import { SCENES } from '../../data/scenes';

interface StudioSpacesProps {
  onSelectRoom: (roomId: string) => void;
}

export default function StudioSpaces({ onSelectRoom }: StudioSpacesProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(1); // default Vocal Booth

  const featuredRooms = SCENES;
  const currentRoom = featuredRooms[selectedRoomIndex] || featuredRooms[0];

  return (
    <section id="spaces" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-[#070a12] border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-2 sm:space-y-3">
            <div className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-sky-400">
              FACILITY SCHEMATICS & SPACES
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight uppercase">
              Engineered for Sonic Perfection
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every studio space at SONICVAULT is decoupled from the exterior world through dual-floating concrete foundations, tuned quadratic diffusers, and calibrated acoustic resonance chambers.
          </p>
        </div>

        {/* Room Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {featuredRooms.map((room, idx) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoomIndex(idx)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedRoomIndex === idx
                  ? 'bg-sky-500 text-black font-bold shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {room.number} · {room.title}
            </button>
          ))}
        </div>

        {/* Active Space Spotlight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch bg-slate-900/40 rounded-2xl sm:rounded-3xl border border-white/10 p-4 sm:p-8 lg:p-10 overflow-hidden">
          {/* Left Column: Visual Media & Atmosphere */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl group">
              <img
                src={currentRoom.imagePath}
                alt={currentRoom.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between text-[11px] sm:text-xs font-mono text-white/90">
                <span className="px-2.5 sm:px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/20">
                  {currentRoom.roomName}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/20 text-sky-400">
                  {currentRoom.reverbTime}
                </span>
              </div>
            </div>

            {/* Quick Spec Matrix - Responsive 1 col on mobile, 3 cols on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2">
              <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 block uppercase">Dimensions</span>
                <span className="text-xs sm:text-sm font-semibold text-white font-mono">{currentRoom.dimensions}</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 block uppercase">Acoustic Isolation</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-400 font-mono">-85 dB TL</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 block uppercase">Monitoring</span>
                <span className="text-xs sm:text-sm font-semibold text-sky-400 font-mono">Calibrated Class A</span>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural & Hardware Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-sky-400">
                SPACE ARCHITECTURE
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {currentRoom.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {currentRoom.caption}
              </p>
            </div>

            {/* Verified Hardware Installed */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                Permanent Hardware Locker:
              </span>
              <ul className="space-y-2">
                {currentRoom.highlightGear.map((gear, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-xs text-slate-200 p-2.5 rounded-lg bg-white/5 border border-white/10"
                  >
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{gear}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <button
                onClick={() => onSelectRoom(currentRoom.id)}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white hover:bg-sky-400 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-sky-400/20 cursor-pointer"
              >
                <span>Book This Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
