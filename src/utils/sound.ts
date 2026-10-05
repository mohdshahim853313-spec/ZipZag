/**
 * Web Audio API synthesizer for rich, tactile puzzle game sound effects.
 * Includes:
 *  - 'tick' for path drawing (transient click + tuned harmonic body)
 *  - 'completion chime' on victory (bell-like sparkling polyphonic arpeggio)
 *  - 'error sound' for invalid moves (distinct damped low-frequency buzzer)
 *  - 'checkpoint fanfare' on reaching sequential numbered dots
 *  - 'rewind whoosh' on undo/backtracking
 */

class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Crisp, tactile 'tick' sound for path drawing.
   * Features a sharp high-frequency transient click followed by a tuned resonance,
   * with pitch gently ascending as the path lengthens.
   */
  playTick(stepIndex: number = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Transient click (mechanical snap)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      const clickFilter = ctx.createBiquadFilter();

      clickFilter.type = 'bandpass';
      clickFilter.frequency.setValueAtTime(2400, now);
      clickFilter.Q.setValueAtTime(3, now);

      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1600, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

      clickGain.gain.setValueAtTime(0.18, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      clickOsc.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.02);

      // 2. Resonant body 'pop' tone (ascends slightly with path progress)
      const baseFreq = 340;
      const pitch = Math.min(840, baseFreq + (stepIndex % 30) * 14);

      const toneOsc = ctx.createOscillator();
      const toneGain = ctx.createGain();

      toneOsc.type = 'sine';
      toneOsc.frequency.setValueAtTime(pitch * 1.15, now);
      toneOsc.frequency.exponentialRampToValueAtTime(pitch, now + 0.035);

      toneGain.gain.setValueAtTime(0.14, now);
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      toneOsc.connect(toneGain);
      toneGain.connect(ctx.destination);

      toneOsc.start(now);
      toneOsc.stop(now + 0.055);
    } catch {
      // AudioContext error gracefully ignored
    }
  }

  // Alias for backward compatibility
  playStep(stepIndex: number = 0) {
    this.playTick(stepIndex);
  }

  private lastErrorTime: number = 0;

  /**
   * Distinct, pleasant error sound for invalid moves (hitting walls, wrong checkpoint order).
   * Refined two-tone acoustic wooden-block reject ("tok-tok") with zero clipping or harshness.
   */
  playError() {
    const nowMs = Date.now();
    if (nowMs - this.lastErrorTime < 280) return; // Responsive cooldown
    this.lastErrorTime = nowMs;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Two-step acoustic micro-knock (warm descending interval: 460Hz -> 330Hz)
      const taps = [
        { freq: 460, endFreq: 360, delay: 0, dur: 0.042, gain: 0.15 },
        { freq: 340, endFreq: 260, delay: 0.038, dur: 0.052, gain: 0.18 },
      ];

      for (const t of taps) {
        const tStart = now + t.delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Warm bandpass shaping for natural acoustic marimba/wood block resonance
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(t.freq * 1.15, tStart);
        filter.Q.setValueAtTime(2.4, tStart);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(t.freq, tStart);
        osc.frequency.exponentialRampToValueAtTime(t.endFreq, tStart + t.dur);

        gain.gain.setValueAtTime(0.001, tStart);
        gain.gain.linearRampToValueAtTime(t.gain, tStart + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, tStart + t.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(tStart);
        osc.stop(tStart + t.dur + 0.01);
      }
    } catch {}
  }

  // Alias for invalid move feedback
  playInvalidMove() {
    this.playError();
  }

  /**
   * Sparkling 'completion chime' on victory.
   * Multi-voice crystal bell arpeggio with shimmering overtones and rich sustain.
   */
  playCompletionChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Ascending pentatonic bell frequencies: C5, E5, G5, B5, C6, E6, G6
      const chord = [
        { freq: 523.25, timeOffset: 0.0, gain: 0.16 }, // C5
        { freq: 659.25, timeOffset: 0.08, gain: 0.18 }, // E5
        { freq: 783.99, timeOffset: 0.16, gain: 0.20 }, // G5
        { freq: 987.77, timeOffset: 0.24, gain: 0.22 }, // B5
        { freq: 1046.5, timeOffset: 0.32, gain: 0.24 }, // C6
        { freq: 1318.51, timeOffset: 0.42, gain: 0.26 }, // E6
        { freq: 1567.98, timeOffset: 0.54, gain: 0.22 }, // G6
      ];

      const now = ctx.currentTime;

      chord.forEach(({ freq, timeOffset, gain }) => {
        const noteStart = now + timeOffset;

        // 1. Fundamental chime sine wave
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        noteGain.gain.setValueAtTime(gain, noteStart);
        noteGain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.7);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.75);

        // 2. Crystal bell harmonic overtone (2.76x frequency for bell chime shimmer)
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();

        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2.76, noteStart);

        overtoneGain.gain.setValueAtTime(gain * 0.35, noteStart);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.35);

        overtone.connect(overtoneGain);
        overtoneGain.connect(ctx.destination);

        overtone.start(noteStart);
        overtone.stop(noteStart + 0.38);
      });
    } catch {}
  }

  // Alias for victory
  playWin() {
    this.playCompletionChime();
  }

  /**
   * Sound played when connecting a sequential numbered dot (e.g. 1 -> 2 -> 3).
   * Uplifting dual-tone marimba chime.
   */
  playCheckpoint(checkpointNum: number = 1) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Scales with checkpoint number
      const root = Math.min(659.25, 440 + checkpointNum * 32);
      const fifth = root * 1.5;

      [root, fifth].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + i * 0.055;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.18);
      });
    } catch {}
  }

  /**
   * Sound played when rewinding / undoing path segments.
   */
  playUndo() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /**
   * Sound played when hint is activated.
   * Pleasant ascending sparkle chime.
   */
  playHint() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.055;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.14, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.24);
      });
    } catch {}
  }
}

export const sound = new SoundController();
