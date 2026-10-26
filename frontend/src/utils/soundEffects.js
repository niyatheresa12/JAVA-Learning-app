// Sound effects using Web Audio API (Zero external audio file dependencies!)
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.15, gain = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(gain, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay may be blocked until user interacts
    }
  }

  // Sweet chime on correct answer
  playCorrect() {
    if (!this.enabled) return;
    this.playTone(523.25, 'triangle', 0.1, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.15), 100); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.18), 200); // G5
  }

  // Cute squeak/buzz on wrong answer
  playWrong() {
    if (!this.enabled) return;
    this.playTone(300, 'sawtooth', 0.15, 0.12);
    setTimeout(() => this.playTone(220, 'sawtooth', 0.25, 0.12), 140);
  }

  // Soft cute bubble click
  playClick() {
    if (!this.enabled) return;
    this.playTone(800, 'sine', 0.04, 0.08);
  }

  // Fanfare for level complete
  playVictory() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.2), idx * 120);
    });
  }

  // Menacing warning sound when Koffi gets angry
  playThreat() {
    if (!this.enabled) return;
    this.playTone(180, 'sawtooth', 0.2, 0.15);
    setTimeout(() => this.playTone(140, 'sawtooth', 0.3, 0.18), 180);
  }
}

export const sounds = new SoundManager();
