/**
 * Lightweight browser Web Audio API tone generator and Web Speech synthesis
 * for child-friendly sound effects without external audio file dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play child-friendly cheerful chime frequencies
  playTone(frequencies: number[], durations: number[] = [0.1, 0.15], type: OscillatorType = 'sine') {
    const ctx = this.getContext();
    if (!ctx) return;

    let startTime = ctx.currentTime;
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      const duration = durations[i] || 0.12;
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);

      startTime += duration * 0.8; // subtle overlap for harmonious melody
    });
  }

  playClick() {
    this.playTone([440, 660], [0.05, 0.08], 'triangle');
  }

  playSuccess() {
    this.playTone([523.25, 659.25, 783.99, 1046.5], [0.08, 0.08, 0.1, 0.25], 'sine');
  }

  playPop() {
    this.playTone([350, 700], [0.04, 0.08], 'sine');
  }

  playIncorrect() {
    this.playTone([330, 260], [0.1, 0.15], 'sine');
  }

  playCheer() {
    this.playTone([400, 500, 600, 800, 1000], [0.07, 0.07, 0.07, 0.09, 0.2], 'triangle');
  }
}

export const soundEngine = new SoundEngine();

export function speakText(text: string, langCode: string = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    soundEngine.playTone([440, 550], [0.1, 0.15]);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    soundEngine.playTone([523.25, 659.25], [0.06, 0.08]);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower and friendlier for young children
    utterance.pitch = 1.15; // Cheerful, warm tone

    // Map language code to BCP 47
    const langMap: Record<string, string> = {
      en: 'en-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
      or: 'or-IN',
      as: 'as-IN',
    };

    utterance.lang = langMap[langCode] || 'en-IN';

    // Check if voice exists for this language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(langCode));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis playback error, fallback to audio chime', err);
    soundEngine.playPop();
  }
}
