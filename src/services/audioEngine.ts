// Web Audio API Procedural Studio Sound Engine
// Professional multi-track synthesis for Beat Instrumentals, Vocal Demos, and Studio Master Previews
// Zero-dependency, purely procedural Web Audio implementation adhering to high-fidelity audio standards

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

export type TrackGenreStyle =
  | 'afrobeats'
  | 'amapiano'
  | 'hiphop'
  | 'reggae'
  | 'jazz'
  | 'funk'
  | 'soul'
  | 'ukdrill'
  | 'highlife'
  | 'rock'
  | 'pop'
  | 'rnb';

class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private trackGain: GainNode | null = null;
  private tapeHissGain: GainNode | null = null;
  private subHumGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedback: GainNode | null = null;
  private isInitialized = false;
  private _isMuted = true;
  private currentSceneIndex = 0;

  // Track playback state
  private activeTrackId: string | null = null;
  private trackCurrentTime = 0;
  private trackDuration = 210; // Standard 3.5 min preview
  private isTrackPlaying = false;
  private trackProgressCallback: ((time: number, duration: number) => void) | null = null;
  private trackIntervalId: number | null = null;
  private rhythmStep = 0;
  private rhythmTimer: number | null = null;

  // Pre-cached noise buffer
  private noiseBuffer: AudioBuffer | null = null;
  // Waveshaper distortion curve for analog warmth & log drum saturation
  private distortionCurve: Float32Array | null = null;

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master SSL-style Bus Compressor
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.trackGain = this.ctx.createGain();
      this.trackGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

      // Stereo Tape Echo Delay Loop
      this.delayNode = this.ctx.createDelay();
      this.delayNode.delayTime.setValueAtTime(0.28, this.ctx.currentTime);
      this.delayFeedback = this.ctx.createGain();
      this.delayFeedback.gain.setValueAtTime(0.25, this.ctx.currentTime);
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);

      this.trackGain.connect(this.delayNode);
      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delayNode);
      delayFilter.connect(this.masterGain);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.trackGain.connect(this.masterGain);
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.createNoiseBuffer();
      this.createDistortionCurve();
      this.setupAnalogNoise();
      this.setupSubResonance();

      this.isInitialized = true;
    } catch {
      // AudioContext unavailable in headless test environment
    }
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  private createDistortionCurve(k = 20) {
    const n = 256;
    const curve = new Float32Array(n);
    const deg = Math.PI / 180;
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    this.distortionCurve = curve;
  }

  private setupAnalogNoise() {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = this.noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1600;
    noiseFilter.Q.value = 0.6;

    this.tapeHissGain = this.ctx.createGain();
    this.tapeHissGain.gain.value = 0.02;

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(this.tapeHissGain);
    this.tapeHissGain.connect(this.masterGain);
    whiteNoise.start();
  }

  private setupSubResonance() {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);

    this.subHumGain = this.ctx.createGain();
    this.subHumGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc.connect(this.subHumGain);
    this.subHumGain.connect(this.masterGain);
    osc.start();
  }

  // --- Core Synthesis Instruments ---

  // 1. Modern Punchy Kick (Pitch sweep + beater transient)
  private playKick(volume = 0.7) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(155, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.08);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + 0.3);

    // Beater click
    if (this.noiseBuffer) {
      const click = this.ctx.createBufferSource();
      click.buffer = this.noiseBuffer;
      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(1800, now);
      clickFilter.Q.setValueAtTime(3, now);
      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(volume * 0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      click.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.trackGain);
      click.start(now);
      click.stop(now + 0.03);
    }
  }

  // 2. Signature Amapiano & Afrobeats Resonant Log Drum
  private playLogDrum(baseFreq = 65, slideFreq = 50, volume = 0.65) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Fast pitch drop mimicking wooden acoustic chamber resonance
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 2.4, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.04);
    osc.frequency.linearRampToValueAtTime(slideFreq, now + 0.28);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    // Add warm saturation shaper
    if (this.distortionCurve) {
      const shaper = this.ctx.createWaveShaper();
      (shaper as any).curve = this.distortionCurve;
      shaper.oversample = '2x';
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, now);

      osc.connect(shaper);
      shaper.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // 3. Sliding 808 Trap Sub Bass
  private play808Sub(freq = 45, slideTo = 38, duration = 0.7, volume = 0.7) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.linearRampToValueAtTime(volume * 0.85, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // 4. Shaker Percussion & Hi-Hat
  private playShaker(accent = 0.3, isHiHat = false) {
    if (!this.ctx || !this.trackGain || !this.noiseBuffer || this._isMuted) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = isHiHat ? 'highpass' : 'bandpass';
    filter.frequency.setValueAtTime(isHiHat ? 7000 : 5800, now);
    filter.Q.setValueAtTime(isHiHat ? 1.2 : 2.5, now);

    const gain = this.ctx.createGain();
    const duration = isHiHat ? 0.05 : 0.065;
    gain.gain.setValueAtTime(accent * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.trackGain);
    src.start(now);
    src.stop(now + duration + 0.02);
  }

  // 5. Rimshot / Snare
  private playRimshot(volume = 0.45) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);
    oscGain.gain.setValueAtTime(volume * 0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(oscGain);
    oscGain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + 0.1);

    // Rim click
    if (this.noiseBuffer) {
      const click = this.ctx.createBufferSource();
      click.buffer = this.noiseBuffer;
      const f = this.ctx.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.setValueAtTime(1400, now);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(volume * 0.5, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      click.connect(f);
      f.connect(g);
      g.connect(this.trackGain);
      click.start(now);
      click.stop(now + 0.05);
    }
  }

  // 6. Polyphonic Vintage Rhodes & Synth Chords
  private playRhodesChord(notes: number[], duration = 1.3, volume = 0.18) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.trackGain) return;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.004, now); // subtle chorusing

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + duration);

      const noteVol = (idx === 0 ? volume * 1.2 : volume) / Math.sqrt(notes.length);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(noteVol, now + 0.04 + idx * 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.trackGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
    });
  }

  // 7. Melodic Guitar Pluck / Kalimba
  private playKalimbaPluck(freq: number, volume = 0.22) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  // 8. Soulful Vocal Formant Harmony Layer (mimicking recorded vocal stacks)
  private playVocalFormantHarmony(freq: number, duration = 1.4, volume = 0.16) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Human vowel "Aah / Ooh" dual formant filters
    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(750, now);
    f1.Q.setValueAtTime(4.5, now);

    const f2 = this.ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(1300, now);
    f2.Q.setValueAtTime(5.0, now);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    // Warm vocal vibrato
    const vibrato = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.2, now);
    vibGain.gain.setValueAtTime(2.5, now);
    vibrato.connect(osc.frequency);
    vibrato.start(now);
    vibrato.stop(now + duration);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(f1);
    osc.connect(f2);
    f1.connect(gain);
    f2.connect(gain);
    gain.connect(this.trackGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // 9. Overdriven Rock Power Chords (Marshall Tube emulation)
  private playDistortedRockChord(notes: number[], duration = 0.55, volume = 0.32) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    notes.forEach((freq) => {
      if (!this.ctx || !this.trackGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(2.0, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume / Math.sqrt(notes.length), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      if (this.distortionCurve) {
        const shaper = this.ctx.createWaveShaper();
        (shaper as any).curve = this.distortionCurve;
        shaper.oversample = '2x';
        osc.connect(shaper);
        shaper.connect(filter);
      } else {
        osc.connect(filter);
      }

      filter.connect(gain);
      gain.connect(this.trackGain);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    });
  }

  // 10. Reggae / Dancehall Offbeat Skank (Guitar & Organ Chop)
  private playReggaeSkank(notes: number[], volume = 0.3) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    notes.forEach((freq) => {
      if (!this.ctx || !this.trackGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.trackGain);
      osc.start(now);
      osc.stop(now + 0.1);
    });
  }

  // 11. Jazz Walking Upright Double Bass
  private playWalkingDoubleBass(freq: number, duration = 0.38, volume = 0.5) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // 12. Jazz Swung Ride Cymbal
  private playJazzRide(volume = 0.22) {
    if (!this.ctx || !this.trackGain || !this.noiseBuffer || this._isMuted) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(9200, now);
    f1.Q.setValueAtTime(5.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    src.connect(f1);
    f1.connect(gain);
    gain.connect(this.trackGain);
    src.start(now);
    src.stop(now + 0.3);
  }

  // 13. Slap Funk Bass (Thumb Thump & String Pop)
  private playSlapBass(freq: number, isPop = false, volume = 0.6) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = isPop ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(isPop ? freq * 2 : freq, now);
    if (!isPop) {
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.08);
    }

    filter.type = isPop ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(isPop ? 1600 : 650, now);
    filter.Q.setValueAtTime(3.0, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isPop ? 0.12 : 0.28));

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 14. UK Drill Gliding 808
  private playDrill808Glide(startFreq = 45, slideTo = 90, endFreq = 38, volume = 0.85) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.linearRampToValueAtTime(slideTo, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.75);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.linearRampToValueAtTime(volume * 0.9, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    if (this.distortionCurve) {
      const shaper = this.ctx.createWaveShaper();
      (shaper as any).curve = this.distortionCurve;
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(600, now);
      osc.connect(shaper);
      shaper.connect(f);
      f.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + 0.85);
  }

  // 15. West African Talking Drum Pitch Bend
  private playTalkingDrum(startFreq = 150, endFreq = 260, volume = 0.4) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);
    osc.frequency.linearRampToValueAtTime(startFreq * 1.1, now + 0.2);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  // 16. Pumping Sidechained Synthpop Bass
  private playSidechainSynthBass(freq: number, duration = 0.35, volume = 0.55) {
    if (!this.ctx || !this.trackGain || this._isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    // Emulate sidechain ducking curve (quiet on downbeat, swells up)
    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.trackGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // 17. Sizzling Crash Cymbal
  private playCrashCymbal(volume = 0.35) {
    if (!this.ctx || !this.trackGain || !this.noiseBuffer || this._isMuted) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const f = this.ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.setValueAtTime(5000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    src.connect(f);
    f.connect(gain);
    gain.connect(this.trackGain);
    src.start(now);
    src.stop(now + 0.95);
  }

  // 18. Tight Digital Handclap
  private playHandclap(volume = 0.42) {
    if (!this.ctx || !this.trackGain || !this.noiseBuffer || this._isMuted) return;
    const now = this.ctx.currentTime;
    // 3 quick pre-claps then main tail
    [0, 0.012, 0.024].forEach((offset, idx) => {
      if (!this.ctx || !this.trackGain || !this.noiseBuffer) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const f = this.ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.setValueAtTime(1200, now + offset);
      f.Q.setValueAtTime(2.0, now + offset);
      const g = this.ctx.createGain();
      const dur = idx === 2 ? 0.14 : 0.02;
      g.gain.setValueAtTime(volume * (idx === 2 ? 1 : 0.6), now + offset);
      g.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);
      src.connect(f);
      f.connect(g);
      g.connect(this.trackGain);
      src.start(now + offset);
      src.stop(now + offset + dur + 0.02);
    });
  }

  // --- Genre-Specific Song / Beat Generator Engine ---

  private detectGenre(trackId: string): TrackGenreStyle {
    const id = trackId.toLowerCase();
    if (id.includes('amapiano') || id.includes('kairo') || id.includes('yanos')) return 'amapiano';
    if (id.includes('trap') || id.includes('phantom') || id.includes('808')) return 'hiphop';
    if (id.includes('drill') || id.includes('brixton')) return 'ukdrill';
    if (id.includes('reggae') || id.includes('dancehall') || id.includes('heatwave') || id.includes('dub')) return 'reggae';
    if (id.includes('jazz') || id.includes('bluenote') || id.includes('authentics')) return 'jazz';
    if (id.includes('funk') || id.includes('groove')) return 'funk';
    if (id.includes('soul') || id.includes('motown') || id.includes('velvet') || id.includes('heartstrings')) return 'soul';
    if (id.includes('highlife') || id.includes('palmwine') || id.includes('african_sound')) return 'highlife';
    if (id.includes('rock') || id.includes('overdrive') || id.includes('voltage')) return 'rock';
    if (id.includes('pop') || id.includes('synthpop') || id.includes('neon') || id.includes('starlight')) return 'pop';
    if (id.includes('rnb') || id.includes('neosoul') || id.includes('satin') || id.includes('whisper')) return 'rnb';
    return 'afrobeats'; // Default premier signature sound
  }

  public playTrackPreview(
    trackId: string,
    durationSeconds = 210,
    onProgress?: (time: number, duration: number) => void
  ) {
    this.init();
    if (!this.ctx || !this.trackGain || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Unmute master if muted
    if (this._isMuted) {
      this._isMuted = false;
      this.masterGain.gain.setTargetAtTime(0.8, this.ctx.currentTime, 0.15);
    }

    this.stopTrackPreview();
    this.activeTrackId = trackId;
    this.trackDuration = durationSeconds;
    this.trackCurrentTime = 0;
    this.isTrackPlaying = true;
    this.trackProgressCallback = onProgress || null;
    this.rhythmStep = 0;

    const genre = this.detectGenre(trackId);

    // Harmonic Chord banks
    const chords = {
      afrobeats: [
        [164.81, 196.0, 246.94, 293.66], // Em9
        [130.81, 164.81, 196.0, 246.94], // Cmaj7
        [110.0, 164.81, 220.0, 261.63],  // Am9
        [123.47, 185.0, 220.0, 293.66],  // Bm7
      ],
      amapiano: [
        [146.83, 174.61, 220.0, 261.63], // Dm7
        [130.81, 164.81, 196.0, 246.94], // Cmaj7
        [110.0, 130.81, 164.81, 196.0],  // Am7
        [123.47, 146.83, 185.0, 220.0],  // Bm7
      ],
      hiphop: [
        [110.0, 130.81, 164.81], // Am
        [98.0, 123.47, 146.83],  // G
        [87.31, 110.0, 130.81],  // F
        [82.41, 103.83, 123.47], // E
      ],
      reggae: [
        [196.0, 233.08, 293.66], // Gm
        [174.61, 220.0, 261.63], // F
        [130.81, 164.81, 196.0], // C
        [146.83, 174.61, 220.0], // Dm
      ],
      jazz: [
        [146.83, 174.61, 220.0, 261.63], // Dm7
        [196.0, 246.94, 293.66, 349.23], // G7
        [130.81, 164.81, 196.0, 246.94], // Cmaj7
        [220.0, 277.18, 329.63, 392.0],  // A7
      ],
      funk: [
        [164.81, 196.0, 246.94, 293.66], // Em9
        [146.83, 185.0, 220.0, 277.18],  // D9
        [130.81, 164.81, 196.0, 246.94], // Cmaj7
        [123.47, 155.56, 185.0, 220.0],  // B7#9
      ],
      soul: [
        [116.54, 146.83, 174.61, 220.0], // Bbmaj7
        [98.0, 116.54, 146.83, 174.61],  // Gm7
        [155.56, 196.0, 233.08, 293.66], // Ebmaj7
        [174.61, 220.0, 261.63, 311.13], // F7
      ],
      ukdrill: [
        [130.81, 155.56, 196.0], // Cm
        [103.83, 130.81, 155.56], // Ab
        [116.54, 146.83, 174.61], // Bb
        [98.0, 116.54, 146.83],   // Gm
      ],
      highlife: [
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [130.81, 164.81, 196.0, 246.94], // C
        [146.83, 174.61, 220.0, 261.63], // Dm7
        [196.0, 246.94, 293.66, 349.23], // G7
      ],
      rock: [
        [146.83, 220.0, 293.66], // D5
        [130.81, 196.0, 261.63], // C5
        [196.0, 293.66, 392.0],  // G5
        [220.0, 329.63, 440.0],  // A5
      ],
      pop: [
        [185.0, 220.0, 277.18],  // F#m
        [146.83, 185.0, 220.0],  // D
        [220.0, 277.18, 329.63], // A
        [164.81, 207.65, 246.94], // E
      ],
      rnb: [
        [138.59, 174.61, 207.65, 261.63], // Dbmaj9
        [116.54, 138.59, 174.61, 207.65], // Bbm11
        [155.56, 185.0, 233.08, 277.18],  // Ebm9
        [207.65, 261.63, 311.13, 369.99], // Ab13
      ],
    };

    const kalimbaMelody = [440.0, 493.88, 523.25, 659.25, 587.33, 440.0, 392.0, 329.63];

    // Tempo step intervals (16th notes per genre)
    const stepIntervalMap: Record<TrackGenreStyle, number> = {
      afrobeats: 141, // 106 BPM
      amapiano: 134,  // 112 BPM
      hiphop: 107,    // 140 BPM
      reggae: 156,    // 96 BPM
      jazz: 125,      // 120 BPM
      funk: 138,      // 108 BPM
      soul: 197,      // 76 BPM
      ukdrill: 105,   // 142 BPM
      highlife: 131,  // 114 BPM
      rock: 117,      // 128 BPM
      pop: 123,       // 122 BPM
      rnb: 183,       // 82 BPM
    };

    const stepIntervalMs = stepIntervalMap[genre] || 135;

    this.rhythmTimer = window.setInterval(() => {
      if (!this.isTrackPlaying || !this.ctx || !this.trackGain) return;
      const step = this.rhythmStep % 32;
      const barStep = this.rhythmStep % 16;
      const chordIndex = Math.floor((this.rhythmStep % 64) / 16);
      const genreChords = chords[genre] || chords.afrobeats;
      const currentChord = genreChords[chordIndex % genreChords.length];

      // ==========================================
      // 1. AFROBEATS (Recorded Song Demo)
      // ==========================================
      if (genre === 'afrobeats') {
        const isDownbeat = barStep % 4 === 0;
        const isUpbeat = barStep % 4 === 2;
        this.playShaker(isDownbeat ? 0.35 : isUpbeat ? 0.25 : 0.15);

        // Four-on-the-floor kick with offbeat syncopation
        if (barStep === 0 || barStep === 4 || barStep === 8 || barStep === 12 || barStep === 14) {
          this.playKick(barStep === 14 ? 0.45 : 0.65);
        }
        if (barStep === 4 || barStep === 10) {
          this.playRimshot(0.4);
        }
        if (barStep === 0 || barStep === 3 || barStep === 6 || barStep === 11 || barStep === 13) {
          const notes = [65.41, 73.42, 82.41, 55.0];
          this.playLogDrum(notes[barStep % notes.length], notes[(barStep + 1) % notes.length]);
        }
        if (barStep === 0) {
          this.playRhodesChord(currentChord, 1.8, 0.2);
        }
        if (barStep === 2 || barStep === 5 || barStep === 9 || barStep === 15) {
          const note = kalimbaMelody[(this.rhythmStep + barStep) % kalimbaMelody.length];
          this.playKalimbaPluck(note, 0.2);
        }
        if (step === 0 || step === 16) {
          const vocalNotes = [329.63, 293.66, 261.63, 220.0];
          this.playVocalFormantHarmony(vocalNotes[chordIndex % vocalNotes.length], 1.6, 0.15);
        }
      }

      // ==========================================
      // 2. AMAPIANO (Beat Instrumental)
      // ==========================================
      else if (genre === 'amapiano') {
        this.playShaker(barStep % 3 === 0 ? 0.35 : 0.18);
        if (barStep === 0 || barStep === 8) {
          this.playKick(0.7);
        }
        // Resonant log drum slides
        if (barStep === 2 || barStep === 5 || barStep === 7 || barStep === 10 || barStep === 13) {
          this.playLogDrum(73.42, 55.0, 0.75);
        }
        if (barStep === 0 || barStep === 6) {
          this.playRhodesChord(currentChord, 1.4, 0.22);
        }
        if (barStep === 4 || barStep === 12) {
          this.playRimshot(0.45);
        }
      }

      // ==========================================
      // 3. HIP-HOP / TRAP (Beat Instrumental)
      // ==========================================
      else if (genre === 'hiphop') {
        this.playShaker(barStep % 2 === 0 ? 0.35 : 0.15, true);
        if (barStep === 14 || barStep === 15) {
          this.playShaker(0.3, true); // fast 32nd roll
        }
        if (barStep === 0 || barStep === 6 || barStep === 10) {
          this.playKick(0.85);
        }
        if (barStep === 0 || barStep === 8) {
          const bassNotes = [43.65, 48.99, 55.0, 36.71];
          this.play808Sub(bassNotes[chordIndex % bassNotes.length], bassNotes[(chordIndex + 1) % bassNotes.length], 0.8, 0.8);
        }
        if (barStep === 8) {
          this.playRimshot(0.65);
        }
        if (barStep === 0) {
          this.playRhodesChord(currentChord, 1.2, 0.16);
        }
      }

      // ==========================================
      // 4. REGGAE DANCEHALL & DUB (Recorded Demo)
      // ==========================================
      else if (genre === 'reggae') {
        // One-Drop drum feel: kick and cross-stick hit strictly on beat 3 (step 8)
        if (barStep === 8) {
          this.playKick(0.75);
          this.playRimshot(0.6);
        }
        if (barStep === 15) {
          this.playKick(0.35); // ghost kick
        }
        // Shaker / Hi-hat 16th groove
        this.playShaker(barStep % 4 === 2 ? 0.3 : 0.15);
        // Offbeat Staccato Guitar/Organ Skank on '&' (steps 2, 6, 10, 14)
        if (barStep === 2 || barStep === 6 || barStep === 10 || barStep === 14) {
          this.playReggaeSkank(currentChord, 0.28);
        }
        // Deep sub dub bass
        if (barStep === 0 || barStep === 4 || barStep === 10) {
          this.play808Sub(currentChord[0] * 0.5, currentChord[0] * 0.48, 0.5, 0.65);
        }
        // Vocal dub echo
        if (step === 0) {
          this.playVocalFormantHarmony(currentChord[1], 1.2, 0.12);
        }
      }

      // ==========================================
      // 5. JAZZ (Recorded Song Demo)
      // ==========================================
      else if (genre === 'jazz') {
        // Swing ride cymbal pattern: 0, 4, 6, 8, 12, 14
        if (barStep === 0 || barStep === 4 || barStep === 6 || barStep === 8 || barStep === 12 || barStep === 14) {
          this.playJazzRide(barStep === 4 || barStep === 12 ? 0.25 : 0.16);
        }
        // Walking upright acoustic bass on every quarter note (steps 0, 4, 8, 12)
        if (barStep % 4 === 0) {
          const walkNotes = [currentChord[0] * 0.5, currentChord[1] * 0.5, currentChord[2] * 0.5, currentChord[0] * 0.6];
          const walkIndex = Math.floor(barStep / 4);
          this.playWalkingDoubleBass(walkNotes[walkIndex], 0.38, 0.5);
        }
        // Soft acoustic brush kick on 0 and 8
        if (barStep === 0 || barStep === 8) {
          this.playKick(0.35);
        }
        // Lush Rhodes II-V-I chords
        if (barStep === 0 || barStep === 6) {
          this.playRhodesChord(currentChord, 1.8, 0.2);
        }
        // Muted sax / trumpet lead line
        if (barStep === 2 || barStep === 9 || barStep === 13) {
          const saxNotes = [440, 523.25, 587.33, 659.25];
          this.playKalimbaPluck(saxNotes[(chordIndex + barStep) % saxNotes.length], 0.18);
        }
      }

      // ==========================================
      // 6. FUNK (Beat & Recorded Jam)
      // ==========================================
      else if (genre === 'funk') {
        // Tight acoustic kick on 0, 10
        if (barStep === 0 || barStep === 10) {
          this.playKick(0.75);
        }
        // Snappy acoustic snare on 4 and 12
        if (barStep === 4 || barStep === 12) {
          this.playRimshot(0.65);
        }
        // Hi-hat 16ths with open accents
        this.playShaker(barStep % 4 === 0 ? 0.35 : 0.18, true);
        // Slap bass: thumb thump on 0, 6 and high string pop on 3, 11
        if (barStep === 0 || barStep === 6) {
          this.playSlapBass(currentChord[0] * 0.5, false, 0.65);
        } else if (barStep === 3 || barStep === 11) {
          this.playSlapBass(currentChord[1] * 0.5, true, 0.55);
        }
        // Wah-style guitar chops
        if (barStep === 2 || barStep === 7 || barStep === 10 || barStep === 14) {
          this.playReggaeSkank(currentChord, 0.22);
        }
        // Brass horn stabs
        if (barStep === 0 || barStep === 8) {
          this.playRhodesChord(currentChord, 0.8, 0.24);
        }
      }

      // ==========================================
      // 7. SOUL (Recorded Song Demo)
      // ==========================================
      else if (genre === 'soul') {
        // Deep warm Motown bassline
        if (barStep === 0 || barStep === 6 || barStep === 10) {
          this.play808Sub(currentChord[0] * 0.5, currentChord[0] * 0.48, 0.6, 0.55);
        }
        // Fat deadened snare on 4 and 12
        if (barStep === 4 || barStep === 12) {
          this.playRimshot(0.5);
        }
        // Warm kick on 0 and 8
        if (barStep === 0 || barStep === 8) {
          this.playKick(0.55);
        }
        // Lush Rhodes electric piano
        if (barStep === 0) {
          this.playRhodesChord(currentChord, 2.2, 0.24);
        }
        // String pad swells and emotive vocal runs
        if (barStep === 0 || barStep === 8) {
          this.playVocalFormantHarmony(currentChord[1], 2.0, 0.18);
        }
      }

      // ==========================================
      // 8. UK DRILL (Beat Instrumental)
      // ==========================================
      else if (genre === 'ukdrill') {
        // Triplet drill hi-hats with skip rolls
        this.playShaker(barStep % 3 === 0 ? 0.35 : 0.16, true);
        if (barStep === 14 || barStep === 15) {
          this.playShaker(0.3, true);
        }
        // Hard drill kick
        if (barStep === 0 || barStep === 7 || barStep === 10) {
          this.playKick(0.85);
        }
        // UK Drill sliding octave 808
        if (barStep === 0 || barStep === 8) {
          this.playDrill808Glide(42, 84, 38, 0.85);
        }
        // Drill counter-snare on offbeats 6 and 11
        if (barStep === 6 || barStep === 11) {
          this.playRimshot(0.65);
        }
        // Dark gothic piano chords
        if (barStep === 0) {
          this.playRhodesChord(currentChord, 1.2, 0.18);
        }
      }

      // ==========================================
      // 9. HIGHLIFE (Recorded Song Demo)
      // ==========================================
      else if (genre === 'highlife') {
        // Continuous highlife shakers
        this.playShaker(barStep % 2 === 0 ? 0.32 : 0.18);
        // Interlocking dual clean highlife guitars
        const guitarNote = currentChord[barStep % currentChord.length];
        this.playKalimbaPluck(guitarNote * 1.4, 0.2);
        // Talking drum pitch-bend strokes on offbeats
        if (barStep === 3 || barStep === 7 || barStep === 11) {
          this.playTalkingDrum(160, 260, 0.4);
        }
        // Bouncy melodic highlife bassline
        if (barStep === 0 || barStep === 4 || barStep === 7 || barStep === 10 || barStep === 12) {
          this.playLogDrum(currentChord[0] * 0.5, currentChord[0] * 0.48, 0.55);
        }
        // Joyful brass stabs
        if (barStep === 0 || barStep === 8) {
          this.playRhodesChord(currentChord, 1.2, 0.22);
        }
      }

      // ==========================================
      // 10. ROCK (Modern Alt-Rock Production)
      // ==========================================
      else if (genre === 'rock') {
        // Driving acoustic rock kick on 0, 8, 10
        if (barStep === 0 || barStep === 8 || barStep === 10) {
          this.playKick(0.85);
        }
        // Aggressive acoustic snare on 4 and 12
        if (barStep === 4 || barStep === 12) {
          this.playRimshot(0.7);
        }
        // Driving 8th-note hi-hat / cymbal
        this.playShaker(barStep % 2 === 0 ? 0.35 : 0.15, true);
        // Crash cymbal on bar start
        if (barStep === 0) {
          this.playCrashCymbal(0.35);
        }
        // Distorted Marshall tube power chords
        if (barStep === 0 || barStep === 3 || barStep === 6 || barStep === 8 || barStep === 12) {
          this.playDistortedRockChord(currentChord, 0.55, 0.32);
        }
        // Picked rock bassline
        if (barStep % 2 === 0) {
          this.playSlapBass(currentChord[0] * 0.5, false, 0.55);
        }
      }

      // ==========================================
      // 11. POP / SYNTHPOP (Beat & Vocal Master)
      // ==========================================
      else if (genre === 'pop') {
        // 4-on-the-floor commercial dance kick
        if (barStep % 4 === 0) {
          this.playKick(0.8);
        }
        // Digital handclap on 4 and 12
        if (barStep === 4 || barStep === 12) {
          this.playHandclap(0.48);
        }
        // Pumping sidechained synth bass on offbeats (2, 6, 10, 14)
        if (barStep === 2 || barStep === 6 || barStep === 10 || barStep === 14) {
          this.playSidechainSynthBass(currentChord[0] * 0.5, 0.32, 0.55);
        }
        // Shimmering saw-synth chords on downbeats
        if (barStep === 0 || barStep === 8) {
          this.playRhodesChord(currentChord, 1.4, 0.22);
        }
        // Catchy synthpop lead arpeggios
        if (barStep % 2 === 0) {
          const arp = [currentChord[0] * 2, currentChord[1] * 2, currentChord[2] * 2, currentChord[0] * 3];
          this.playKalimbaPluck(arp[(barStep / 2) % arp.length], 0.22);
        }
      }

      // ==========================================
      // 12. R&B / NEO-SOUL (Recorded Studio Demo)
      // ==========================================
      else if (genre === 'rnb') {
        // Laid-back pocket kick on 0 and 10
        if (barStep === 0 || barStep === 10) {
          this.playKick(0.55);
        }
        // Delicate cross-stick rim on 4 and 12
        if (barStep === 4 || barStep === 12) {
          this.playRimshot(0.4);
        }
        // Gentle shaker
        this.playShaker(barStep % 2 === 0 ? 0.25 : 0.12);
        // Deep Moog sub-bass
        if (barStep === 0 || barStep === 6) {
          this.play808Sub(currentChord[0] * 0.5, currentChord[0] * 0.48, 0.8, 0.55);
        }
        // Rich Fender Rhodes Major 9th / Minor 11th voicings
        if (barStep === 0) {
          this.playRhodesChord(currentChord, 2.4, 0.24);
        }
        // Silky smooth multi-part vocal formant harmonies
        if (barStep === 0 || barStep === 8) {
          this.playVocalFormantHarmony(currentChord[1], 2.2, 0.18);
        }
      }

      this.rhythmStep++;
    }, stepIntervalMs);

    // Track Progress counter (every 1 second)
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
    if (this.rhythmTimer) {
      clearInterval(this.rhythmTimer);
      this.rhythmTimer = null;
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
    this.rhythmStep = 0;
    if (this.rhythmTimer) {
      clearInterval(this.rhythmTimer);
      this.rhythmTimer = null;
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
    if (!this.analyser) return [12, 24, 18, 30, 36, 26, 18, 12];
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return Array.from(dataArray.slice(0, 16)).map((v) => Math.max(4, Math.round((v / 255) * 40)));
  }

  public playTone(freq: number, type: OscillatorType = 'sine', duration = 1.2, volume = 0.15) {
    if (!this.ctx || !this.masterGain || this._isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback safety
    }
  }

  public triggerRoomAudio(sceneIndex: number) {
    if (this._isMuted || !this.ctx) return;
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
  }

  public toggleMute(): boolean {
    this.init();
    if (!this.ctx || !this.masterGain) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this._isMuted = !this._isMuted;

    if (!this._isMuted) {
      this.masterGain.gain.setTargetAtTime(0.65, this.ctx.currentTime, 0.2);
      this.triggerRoomAudio(this.currentSceneIndex);
    } else {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      this.stopTrackPreview();
    }

    return this._isMuted;
  }

  public setMuted(muted: boolean) {
    if (this._isMuted === muted) return;
    this.toggleMute();
  }

  public getMuted(): boolean {
    return this._isMuted;
  }

  public playClick() {
    this.playTone(880, 'sine', 0.05, 0.08);
  }

  public playFaderMove() {
    this.playTone(480, 'triangle', 0.06, 0.05);
  }

  public isMuted(): boolean {
    return this._isMuted;
  }
}

export const audioEngine = new StudioAudioEngine();
