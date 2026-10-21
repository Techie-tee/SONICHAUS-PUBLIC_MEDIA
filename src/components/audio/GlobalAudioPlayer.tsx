import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  ArrowUpRight,
  Disc3,
  Sparkles,
} from 'lucide-react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';
import { audioEngine } from '../../services/audioEngine';

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function GlobalAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    closePlayer,
  } = useAudioPlayer();

  const [visualizerBars, setVisualizerBars] = useState<number[]>([12, 18, 24, 16, 28, 20, 14, 8]);

  // Frequency animation loop when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVisualizerBars(audioEngine.getVisualizerData().slice(0, 8));
    }, 120);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      role="region"
      aria-label="Studio Master Audio Player"
      className="fixed bottom-0 left-0 right-0 z-45 bg-[#090d16]/98 backdrop-blur-2xl border-t border-[#4E85BF]/40 shadow-[0_-12px_40px_rgba(0,0,0,0.9)] animate-in slide-in-from-bottom-5 duration-300 pb-[env(safe-area-inset-bottom)]"
    >
      {/* Top Thin Progress Bar for Mobile & Desktop */}
      <div className="w-full h-1 bg-white/10 cursor-pointer relative group" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        seek(pos * (duration || 100));
      }}>
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-[#4E85BF] to-[#89AACC] transition-[width] duration-100 relative"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Track Information & Artwork */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 md:w-1/3 md:flex-initial">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-md">
            <img
              src={currentTrack.artwork}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Disc3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#89AACC] animate-spin" />
              </div>
            )}
          </div>

          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h4 className="font-display text-xs sm:text-sm font-bold text-white truncate">
                {currentTrack.title}
              </h4>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#89AACC] whitespace-nowrap">
                {currentTrack.category}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans truncate">
              {currentTrack.artist} {currentTrack.studioRoom && `· ${currentTrack.studioRoom}`}
            </p>
          </div>
        </div>

        {/* Center: Controls, Scrubber & Visualizer (Desktop & Tablet) */}
        <div className="hidden md:flex w-5/12 flex-col items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-4">
            {/* Animated frequency visualizer */}
            <div className="hidden lg:flex items-end gap-1 h-4 px-2" aria-hidden="true">
              {visualizerBars.map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${isPlaying ? height : 3}px` }}
                  className="w-0.5 rounded-full bg-gradient-to-t from-[#4E85BF] to-[#89AACC] transition-all duration-100"
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full accent-gradient text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              aria-label={isPlaying ? 'Pause Track' : 'Play Track'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              ) : (
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
              )}
            </button>

            <span className="text-[10px] text-slate-400 whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Desktop Progress Slider */}
          <div className="w-full flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Track Progress"
              className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#4E85BF]"
            />
          </div>
        </div>

        {/* Right: Controls, Volume, CTA & Close */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
          {/* Mobile Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="md:hidden w-8 h-8 rounded-full accent-gradient text-white flex items-center justify-center shadow-md active:scale-95 cursor-pointer"
            aria-label={isPlaying ? 'Pause Track' : 'Play Track'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>

          {/* Volume Control (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#89AACC]" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Audio Volume"
              className="w-16 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#4E85BF]"
            />
          </div>

          {/* Prominent CTA */}
          <Link
            to="/book-session"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full accent-gradient text-white text-[10px] sm:text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-md hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 hidden sm:inline" />
            <span className="hidden xl:inline">RECORD AT THE VAULT ·</span>
            <span>BOOK SESSION</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          {/* Close Player */}
          <button
            onClick={closePlayer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close Audio Player"
            title="Close Audio Player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
