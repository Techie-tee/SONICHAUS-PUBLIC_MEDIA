import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioEngine } from '../services/audioEngine';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  artwork: string;
  durationSeconds: number;
  studioRoom?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setDuration(track.durationSeconds || 180);
    setCurrentTime(0);

    audioEngine.playTrackPreview(track.id, track.durationSeconds || 180, (time, dur) => {
      setCurrentTime(time);
      setDuration(dur);
    });
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    audioEngine.pauseTrackPreview();
  };

  const resumeTrack = () => {
    if (!currentTrack) return;
    setIsPlaying(true);
    audioEngine.resumeTrackPreview();
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seekTrack(seconds);
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    audioEngine.setTrackVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setTrackVolume(volume);
    } else {
      setIsMuted(true);
      audioEngine.setTrackVolume(0);
    }
  };

  const closePlayer = () => {
    audioEngine.stopTrackPreview();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}
