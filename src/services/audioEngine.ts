// Web Audio API Procedural Studio Sound Engine
// Zero-dependency, purely procedural audio synthesis adhering to the no-autoplay guideline

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private tapeHissGain: GainNode | null = null;
  private subHumGain: GainNode | null = null;
  private chordFilter: BiquadFilterNode | null = null;
  private isInitialized = false;
  private isMuted = true;
  private intervalId: number | null = null;
  private currentSceneIndex = 0;

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

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

  public triggerRoomAudio(sceneIndex: number) {
    if (this.isMuted || !this.ctx) return;
    this.currentSceneIndex = sceneIndex;

    const baseChords = [
      [220, 329.63, 440],       // Vault: A3, E4, A4 (open fifth drone)
      [261.63, 329.63, 392],    // Vocal Booth: C4, E4, G4 (pure intimacy)
      [196, 246.94, 293.66],    // Live Room: G3, B3, D4 (rich resonance)
      [293.66, 369.99, 440],    // Control Room: D4, F#4, A4 (crisp precision)
      [329.63, 392, 493.88],    // Production Lab: E4, G4, B4 (electronic energy)
      [220, 277.18, 329.63],    // Artist: A3, C#4, E4 (warm passion)
      [261.63, 329.63, 523.25], // Master: C4, E4, C5 (full spectrum)
      [440, 554.37, 659.25],    // Grand Reveal: A4, C#5, E5 (bright triumph)
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

  private startAmbientSequence() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      // Gentle atmospheric note pulse every 4 seconds
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
