import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, ArrowUpRight, Sparkles, X, Disc, Sliders, Mic, Music2, Radio } from 'lucide-react';
import { ProjectItem } from '../types';
import { useAudioPlayer } from '../context/AudioPlayerContext';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'ALL WORK' },
  { id: 'Artist Sessions', label: 'ARTIST SESSIONS' },
  { id: 'Original Productions', label: 'ORIGINAL PRODUCTIONS' },
  { id: 'Mix & Master', label: 'MIX & MASTER' },
  { id: 'Sound in Motion', label: 'SOUND IN MOTION' },
];

const GENRE_FILTERS = [
  'ALL GENRES',
  'Afrobeats',
  'Amapiano',
  'Hip-Hop / Trap',
  'Reggae Dancehall',
  'Jazz',
  'Funk',
  'Soul',
  'UK Drill',
  'Highlife',
  'Rock',
  'Pop',
  'R&B / Neo-Soul',
];

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGenre, setActiveGenre] = useState('ALL GENRES');
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
    return projects.filter((p) => {
      const matchCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchGenre =
        activeGenre === 'ALL GENRES' ||
        (p.genre && p.genre.toLowerCase() === activeGenre.toLowerCase()) ||
        (p.title && p.title.toLowerCase().includes(activeGenre.toLowerCase()));
      return matchCategory && matchGenre;
    });
  }, [projects, activeCategory, activeGenre]);

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
        durationSeconds: 210,
        studioRoom: p.credits.studioRoom,
        spotifyUrl: p.streamingLinks.spotify,
        appleMusicUrl: p.streamingLinks.appleMusic,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>SELECTED WORK · MASTER PRODUCTIONS & BEATS</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
            SOUND MADE / INTO SOMETHING / TIMELESS.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Authentic beat productions, recorded artist song demos, and billboard-grade mixes. 
            Spanning Afrobeats, Amapiano, Hip-Hop/Trap, Reggae Dancehall, Jazz, Funk, Soul, UK Drill, 
            Highlife, Rock, and Pop crafted inside our Lekki Phase 1 tracking sanctuary.
          </p>
        </div>

        {/* Category & Genre Filtering Bar */}
        <div className="space-y-4 border-y border-white/10 py-6">
          {/* Primary Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveCategory(f.id);
                  setActiveGenre('ALL GENRES');
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === f.id
                    ? 'accent-gradient text-white font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Secondary Genre Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-2 shrink-0">
              GENRES:
            </span>
            {GENRE_FILTERS.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                  activeGenre === g
                    ? 'bg-[#4E85BF] text-white font-semibold shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Symmetrical 3-Column Desktop Grid */}
        {loading ? (
          <div className="p-20 text-center text-slate-400 text-xs font-mono">
            Loading selected productions and beat demos...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm font-mono border border-white/10 rounded-2xl bg-white/[0.02]">
            No records match the current filter selection. Select another genre or view "ALL WORK".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredProjects.map((p) => {
              const isThisPlaying = currentTrack?.id === p.id && isPlaying;
              const isBeat = p.type?.toLowerCase().includes('beat');

              return (
                <div
                  key={p.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#080b12] border border-white/10 hover:border-[#4E85BF]/70 transition-all duration-500 flex flex-col justify-between shadow-xl min-h-[460px] h-full"
                >
                  {/* Background Artwork with Vignette */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.72] contrast-115 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
                  </div>

                  {/* Top Bar: Genre / Type Badge & Audio Play Button */}
                  <div className="relative z-10 p-5 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {p.genre && (
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#4E85BF]/40 text-[10px] font-mono tracking-wider text-sky-300 uppercase font-bold">
                          {p.genre}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold backdrop-blur-md border ${
                          isBeat
                            ? 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30'
                            : 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {isBeat ? (
                          <Music2 className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Mic className="w-3 h-3 text-amber-400" />
                        )}
                        <span>{p.type || p.category}</span>
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayAudio(p);
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer shrink-0 ${
                        isThisPlaying
                          ? 'bg-[#4E85BF] text-white shadow-[0_0_24px_rgba(78,133,191,0.85)] scale-105 animate-pulse'
                          : 'bg-black/85 backdrop-blur-md border border-white/25 text-white hover:bg-[#4E85BF]/80 hover:scale-105'
                      }`}
                      aria-label="Toggle Audio Preview"
                      title={isThisPlaying ? 'Pause Production Demo' : 'Play Audio Production Demo'}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Middle: Active Waveform Visualizer Bar when playing */}
                  {isThisPlaying && (
                    <div className="relative z-10 px-5 py-2">
                      <div className="flex items-center gap-1 h-7 bg-black/80 backdrop-blur-md rounded-lg px-3.5 border border-[#4E85BF]/60 shadow-lg">
                        <Radio className="w-3.5 h-3.5 text-[#4E85BF] animate-spin" />
                        <span className="text-[9px] font-mono text-[#89AACC] uppercase font-bold mr-2">
                          STUDIO DEMO PLAYING
                        </span>
                        {[45, 80, 60, 95, 65, 90, 50, 100, 75, 55, 85, 70, 90, 60].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-[#4E85BF] rounded-full animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDuration: `${0.35 + (i % 6) * 0.12}s`,
                              animationDelay: `${i * 0.04}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Content: Title, Artist, BPM/Key, Description & Case Study Action */}
                  <div className="relative z-10 p-6 space-y-3 bg-gradient-to-t from-black via-black/95 to-transparent flex-1 flex flex-col justify-end">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#89AACC] mb-1">
                        <span className="font-semibold block uppercase tracking-wider truncate mr-2">
                          {p.artist}
                        </span>
                        {p.bpm && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 shrink-0">
                            {p.bpm} BPM {p.key ? `· ${p.key}` : ''}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl font-extrabold text-white group-hover:text-sky-300 transition-colors leading-snug">
                        {p.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {p.caseStudyOverview}
                    </p>

                    {/* Hardware Signal Chain Hint */}
                    {p.credits.mixedBy && (
                      <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <Sliders className="w-3 h-3 text-[#4E85BF] shrink-0" />
                        <span className="truncate">{p.credits.mixedBy}</span>
                      </div>
                    )}

                    {/* Actions: Case Study Modal & Streaming Links */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedCaseStudy(p)}
                        className="text-xs font-mono font-semibold text-white flex items-center gap-1.5 hover:text-[#89AACC] transition-colors cursor-pointer group/link"
                      >
                        <span>VIEW CASE STUDY</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#89AACC] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </button>

                      {/* Streaming Badges */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.streamingLinks.spotify && (
                          <a
                            href={p.streamingLinks.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
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
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
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
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
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
            Bring us your beat ideas, custom production brief, or vocal sessions. 
            We sculpt radio-ready records inside our Lekki Phase 1 tracking rooms and mastering suite.
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
              href="https://wa.me/2349015104502?text=Hello%20SonicVault%2C%20I%20would%20like%20to%20discuss%20a%20new%20recording%20or%20beat%20production."
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#4E85BF]/20 text-[#89AACC] border border-[#4E85BF]/30 font-semibold">
                  {selectedCaseStudy.category} · RELEASE YEAR: {selectedCaseStudy.year}
                </span>
                {selectedCaseStudy.genre && (
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600/30 font-bold">
                    {selectedCaseStudy.genre}
                  </span>
                )}
                {selectedCaseStudy.bpm && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    {selectedCaseStudy.bpm} BPM {selectedCaseStudy.key ? `· ${selectedCaseStudy.key}` : ''}
                  </span>
                )}
              </div>
              <h3 className="font-display text-3xl font-extrabold text-white">
                {selectedCaseStudy.title}
              </h3>
              <p className="text-sm font-editorial italic text-slate-300">
                Artist / Producer: {selectedCaseStudy.artist}
              </p>
            </div>

            <div className="rounded-xl overflow-hidden aspect-[16/9] border border-white/10">
              <img
                src={selectedCaseStudy.coverImage}
                alt={selectedCaseStudy.title}
                referrerPolicy="no-referrer"
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
                    <span className="text-right font-medium">{selectedCaseStudy.credits.recordedBy}</span>
                  </div>
                )}
                {selectedCaseStudy.credits.mixedBy && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-500 font-mono text-[11px]">Mixed On:</span>
                    <span className="text-right font-medium">{selectedCaseStudy.credits.mixedBy}</span>
                  </div>
                )}
                {selectedCaseStudy.credits.masteredBy && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-500 font-mono text-[11px]">Mastered In:</span>
                    <span className="text-right font-medium">{selectedCaseStudy.credits.masteredBy}</span>
                  </div>
                )}
                {selectedCaseStudy.credits.studioRoom && (
                  <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                    <span className="text-slate-500 font-mono text-[11px]">Facility:</span>
                    <span className="text-right font-medium">{selectedCaseStudy.credits.studioRoom}</span>
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
