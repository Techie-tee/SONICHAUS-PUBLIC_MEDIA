import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, ArrowUpRight, Sparkles, ExternalLink, X, Disc, Layers, Sliders } from 'lucide-react';
import { ProjectItem } from '../types';

import { useAudioPlayer } from '../context/AudioPlayerContext';

const FILTERS = [
  { id: 'all', label: 'ALL WORK' },
  { id: 'Artist Sessions', label: 'ARTIST SESSIONS' },
  { id: 'Original Productions', label: 'ORIGINAL PRODUCTIONS' },
  { id: 'Mix & Master', label: 'MIX & MASTER' },
  { id: 'Sound in Motion', label: 'SOUND IN MOTION' },
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudioPlayer();

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load portfolio:', err);
        setLoading(false);
      });
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  const togglePlayAudio = (p: ProjectItem) => {
    if (currentTrack?.id === p.id && isPlaying) {
      pauseTrack();
    } else {
      playTrack({
        id: p.id,
        title: p.title,
        artist: p.artist,
        category: p.category,
        artwork: p.coverImage,
        durationSeconds: 194,
        studioRoom: p.credits.studioRoom,
        spotifyUrl: p.streamingLinks.spotify,
        appleMusicUrl: p.streamingLinks.appleMusic,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>SELECTED WORK · SONICVAULT STUDIOS</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
            SOUND MADE / INTO SOMETHING / TIMELESS.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A look inside the recordings, productions, and creative processes that bring ideas to life. 
            Crafted inside our Lekki Phase 1 tracking rooms and mastering suite.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'accent-gradient text-white font-bold shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 12-Column Desktop Bento Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs font-mono">
            Loading selected recordings...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {filteredProjects.map((p, idx) => {
              // Bento spans: alternating wide cards
              const colSpan = idx % 3 === 0 ? 'lg:col-span-8' : idx % 3 === 1 ? 'lg:col-span-4' : 'lg:col-span-6';
              const isThisPlaying = currentTrack?.id === p.id && isPlaying;

              return (
                <div
                  key={p.id}
                  className={`${colSpan} group relative rounded-2xl overflow-hidden bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/60 transition-all duration-500 flex flex-col justify-between shadow-xl min-h-[360px]`}
                >
                  {/* Background Image Frame with Pixel-Dissolve Grid Overlay */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover filter brightness-75 contrast-110 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  </div>

                  {/* Top Bar: Category & Audio Player Trigger */}
                  <div className="relative z-10 p-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider text-[#89AACC] uppercase">
                      {p.category} · {p.year}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayAudio(p);
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                        isThisPlaying
                          ? 'bg-[#4E85BF] text-white animate-pulse'
                          : 'bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
                      }`}
                      aria-label="Toggle Audio Preview"
                    >
                      {isThisPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>
                  </div>

                  {/* Bottom Content: Title, Artist, Credits & Case Study CTA */}
                  <div className="relative z-10 p-6 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div>
                      <span className="text-xs font-mono text-slate-300 block">{p.artist}</span>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#89AACC] transition-colors">
                        {p.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {p.caseStudyOverview}
                    </p>

                    {/* Actions: Case Study & Streaming Links */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedCaseStudy(p)}
                        className="text-xs font-mono text-white flex items-center gap-1.5 hover:text-[#89AACC] transition-colors cursor-pointer"
                      >
                        <span>VIEW CASE STUDY</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Streaming Platform Icons */}
                      <div className="flex items-center gap-2">
                        {p.streamingLinks.spotify && (
                          <a
                            href={p.streamingLinks.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                            title="Listen on Spotify"
                          >
                            Spotify
                          </a>
                        )}
                        {p.streamingLinks.appleMusic && (
                          <a
                            href={p.streamingLinks.appleMusic}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                            title="Listen on Apple Music"
                          >
                            Apple
                          </a>
                        )}
                        {p.streamingLinks.audiomack && (
                          <a
                            href={p.streamingLinks.audiomack}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300"
                            title="Listen on Audiomack"
                          >
                            Audiomack
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Portfolio Closing CTA */}
        <div className="mt-20 pt-16 border-t border-white/10 bg-[#080b12] rounded-3xl p-8 sm:p-14 border border-white/10 text-center space-y-6">
          <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
            HAVE SOMETHING IN MIND?
          </span>
          <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            LET'S MAKE IT SOUND LIKE YOU.
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Bring us the idea, the unfinished record, or the sound you've been chasing. 
            Let's build something worth listening to in our Lekki Phase 1 sanctuary.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book-session"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full accent-gradient text-white font-bold text-xs tracking-wider uppercase shadow-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span>LET'S WORK TOGETHER</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/2349015104502?text=Hello%20SonicVault%2C%20I%20would%20like%20to%20discuss%20a%20new%20recording%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-7 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-semibold text-xs tracking-wide hover:bg-emerald-600/30 transition-colors flex items-center justify-center gap-2"
            >
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#0a0e16] border border-white/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCaseStudy(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Case Study"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#4E85BF]/20 text-[#89AACC] border border-[#4E85BF]/30">
                {selectedCaseStudy.category} · RELEASE YEAR: {selectedCaseStudy.year}
              </span>
              <h3 className="font-display text-3xl font-extrabold text-white">
                {selectedCaseStudy.title}
              </h3>
              <p className="text-sm font-editorial italic text-slate-300">
                Artist: {selectedCaseStudy.artist}
              </p>
            </div>

            <div className="rounded-xl overflow-hidden aspect-[16/9] border border-white/10">
              <img
                src={selectedCaseStudy.coverImage}
                alt={selectedCaseStudy.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-wider block font-semibold">
                CASE STUDY & CREATIVE DIRECTION
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedCaseStudy.caseStudyOverview}
              </p>
            </div>

            {/* Production Credits Breakdown */}
            <div className="bg-[#05080e] p-4 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                VERIFIED SESSION CREDITS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedCaseStudy.credits.recordedBy && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-500 font-mono text-[11px]">Recorded At:</span>
                    <span>{selectedCaseStudy.credits.recordedBy}</span>
                  </div>
                )}
                {selectedCaseStudy.credits.mixedBy && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-500 font-mono text-[11px]">Mixed On:</span>
                    <span>{selectedCaseStudy.credits.mixedBy}</span>
                  </div>
                )}
                {selectedCaseStudy.credits.masteredBy && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-500 font-mono text-[11px]">Mastered In:</span>
                    <span>{selectedCaseStudy.credits.masteredBy}</span>
                  </div>
                )}
                {selectedCaseStudy.credits.studioRoom && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-500 font-mono text-[11px]">Facility:</span>
                    <span>{selectedCaseStudy.credits.studioRoom}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                STREAMING PLATFORMS VERIFIED
              </span>
              <Link
                to={`/book-session?projectRef=${encodeURIComponent(selectedCaseStudy.id)}`}
                className="py-2.5 px-5 rounded-xl accent-gradient text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-md"
              >
                <span>BOOK SIMILAR SESSION</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
