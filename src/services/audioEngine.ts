// Web Audio API Procedural Studio Sound Engine
// Zero-dependency, purely procedural audio synthesis adhering to the no-autoplay guideline

export interface ActiveTrackState {
  trackId: string;
  title: string;
  artist: string;
  artwork: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private trackGain: GainNode | null = null;
  private tapeHissGain: GainNode | null = null;
  private subHumGain: GainNode | null = null;
  private chordFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isInitialized = false;
  private isMuted = true;
  private intervalId: number | null = null;
  private trackIntervalId: number | null = null;
  private currentSceneIndex = 0;

  // Track playback state
  private activeTrackId: string | null = null;
  private trackCurrentTime = 0;
  private trackDuration = 180; // 3 minutes standard preview
  private isTrackPlaying = false;
  private trackProgressCallback: ((time: number, duration: number) => void) | null = null;
  private trackPatternInterval: number | null = null;

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.trackGain = this.ctx.createGain();
      this.trackGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.trackGain.connect(this.masterGain);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.setupAnalogNoise();
      this.setupSubResonance();
      this.setupHarmonicFilter();

      this.isInitialized = true;
    } catch {
      // AudioContext unavailable in environment
    }
  }

  private setupAnalogNoise() {
    if (!this.ctx || !this.masterGain) return;

    // Procedural warm tape hiss
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.015;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1800;
    noiseFilter.Q.value = 0.8;

    this.tapeHissGain = this.ctx.createGain();
    this.tapeHissGain.gain.value = 0.04;

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(this.tapeHissGain);
    this.tapeHissGain.connect(this.masterGain);
    whiteNoise.start();
  }

  private setupSubResonance() {
    if (!this.ctx || !this.masterGain) return;

    // 55Hz (A1) warm analog console sub rumble
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime);

    this.subHumGain = this.ctx.createGain();
    this.subHumGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc.connect(this.subHumGain);
    this.subHumGain.connect(this.masterGain);
    osc.start();
  }

  private setupHarmonicFilter() {
    if (!this.ctx || !this.masterGain) return;

    this.chordFilter = this.ctx.createBiquadFilter();
    this.chordFilter.type = 'lowpass';
    this.chordFilter.frequency.setValueAtTime(600, this.ctx.currentTime);
    this.chordFilter.Q.setValueAtTime(3, this.ctx.currentTime);
    this.chordFilter.connect(this.masterGain);
  }

  public playTone(freq: number, type: OscillatorType = 'sine', duration = 1.2, volume = 0.15) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      if (this.chordFilter) {
        gain.connect(this.chordFilter);
      } else {
        gain.connect(this.masterGain);
      }

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback safety catch
    }
  }

  // --- Track synthesis playback for custom audio player ---
  public playTrackPreview(
    trackId: string,
    durationSeconds = 194,
    onProgress?: (time: number, duration: number) => void
  ) {
    this.init();
    if (!this.ctx || !this.trackGain || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Unmute master if muted
    if (this.isMuted) {
      this.isMuted = false;
      this.masterGain.gain.setTargetAtTime(0.65, this.ctx.currentTime, 0.2);
    }

    this.stopTrackPreview();
    this.activeTrackId = trackId;
    this.trackDuration = durationSeconds;
    this.trackCurrentTime = 0;
    this.isTrackPlaying = true;
    this.trackProgressCallback = onProgress || null;

    // Musical chord sequences (E minor, C major, G major, D major)
    const chordProgressions = [
      [164.81, 196.0, 246.94, 329.63], // Em7
      [130.81, 164.81, 196.0, 261.63], // Cmaj7
      [196.0, 246.94, 293.66, 392.0],  // Gmaj
      [146.83, 220.0, 293.66, 369.99], // Dmaj
    ];

    let chordStep = 0;

    // Play rhythmic pattern every 1.5 seconds
    this.trackPatternInterval = window.setInterval(() => {
      if (!this.isTrackPlaying || !this.ctx || !this.trackGain) return;

      const chord = chordProgressions[chordStep % chordProgressions.length];
      chordStep++;

      // Play Rhodes synth chord
      chord.forEach((note, i) => {
        setTimeout(() => {
          if (!this.isTrackPlaying || !this.ctx || !this.trackGain) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(note, this.ctx.currentTime);

          g.gain.setValueAtTime(0, this.ctx.currentTime);
          g.gain.linearRampToValueAtTime(i === 0 ? 0.25 : 0.08, this.ctx.currentTime + 0.04);
          g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.4);

          osc.connect(g);
          g.connect(this.trackGain);
          osc.start();
          osc.stop(this.ctx.currentTime + 1.4);
        }, i * 35);
      });

      // Subtle sub kick pulse
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
      kickOsc.frequency.exponentialRampToValueAtTime(42, this.ctx.currentTime + 0.18);
      kickGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      kickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
      kickOsc.connect(kickGain);
      kickGain.connect(this.trackGain);
      kickOsc.start();
      kickOsc.stop(this.ctx.currentTime + 0.22);
    }, 1500);

    // Progress tick every second
    this.trackIntervalId = window.setInterval(() => {
      if (!this.isTrackPlaying) return;
      this.trackCurrentTime += 1;
      if (this.trackCurrentTime >= this.trackDuration) {
        this.trackCurrentTime = 0;
      }
      if (this.trackProgressCallback) {
        this.trackProgressCallback(this.trackCurrentTime, this.trackDuration);
      }
    }, 1000);
  }

  public pauseTrackPreview() {
    this.isTrackPlaying = false;
    if (this.trackPatternInterval) {
      clearInterval(this.trackPatternInterval);
      this.trackPatternInterval = null;
    }
  }

  public resumeTrackPreview() {
    if (!this.activeTrackId) return;
    this.playTrackPreview(this.activeTrackId, this.trackDuration, this.trackProgressCallback || undefined);
  }

  public stopTrackPreview() {
    this.isTrackPlaying = false;
    this.activeTrackId = null;
    this.trackCurrentTime = 0;
    if (this.trackPatternInterval) {
      clearInterval(this.trackPatternInterval);
      this.trackPatternInterval = null;
    }
    if (this.trackIntervalId) {
      clearInterval(this.trackIntervalId);
      this.trackIntervalId = null;
    }
  }

  public seekTrack(seconds: number) {
    this.trackCurrentTime = Math.max(0, Math.min(seconds, this.trackDuration));
    if (this.trackProgressCallback) {
      this.trackProgressCallback(this.trackCurrentTime, this.trackDuration);
    }
  }

  public setTrackVolume(vol: number) {
    if (!this.ctx || !this.trackGain) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.trackGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  public getVisualizerData(): number[] {
    if (!this.analyser) return [10, 20, 15, 25, 30, 20, 15, 10];
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return Array.from(dataArray.slice(0, 16)).map((v) => Math.max(4, Math.round((v / 255) * 36)));
  }

  public triggerRoomAudio(sceneIndex: number) {
    if (this.isMuted || !this.ctx) return;
    this.currentSceneIndex = sceneIndex;

    const baseChords = [
      [220, 329.63, 440],
      [261.63, 329.63, 392],
      [196, 246.94, 293.66],
      [293.66, 369.99, 440],
      [329.63, 392, 493.88],
      [220, 277.18, 329.63],
      [261.63, 329.63, 523.25],
      [440, 554.37, 659.25],
    ];

    const notes = baseChords[sceneIndex] || baseChords[0];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 2.0, 0.08);
      }, idx * 120);
    });

    if (this.chordFilter && this.ctx) {
      const targetCutoff = 400 + sceneIndex * 350;
      this.chordFilter.frequency.setTargetAtTime(targetCutoff, this.ctx.currentTime, 0.4);
    }
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 0.2);
      this.startAmbientSequence();
      this.triggerRoomAudio(this.currentSceneIndex);
    } else {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      this.stopAmbientSequence();
    }

    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    if (this.isMuted === muted) return;
    this.toggleMute();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isMuted(): boolean {
    return this.isMuted;
  }

  private startAmbientSequence() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const rootNotes = [110, 146.83, 164.81, 220];
      const randomNote = rootNotes[Math.floor(Math.random() * rootNotes.length)];
      this.playTone(randomNote, 'sine', 3.5, 0.05);
    }, 4200);
  }

  private stopAmbientSequence() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public playClick() {
    this.playTone(880, 'sine', 0.05, 0.03);
  }

  public playFaderMove() {
    this.playTone(320 + Math.random() * 200, 'triangle', 0.08, 0.02);
  }
}

export const audioEngine = new StudioAudioEngine();
