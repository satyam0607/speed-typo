/**
 * Real-time Web Audio API sound synthesizer with musical tunes, word completion chords,
 * mechanical switches, retro chiptune, and synthwave soundscapes.
 * 100% zero-latency, client-side, hermetic, works offline.
 */

import { SoundTheme } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Pentatonic scale frequencies in Hz (C4 to C6)
const PENTATONIC_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50, // C6
  1174.66, // D6
  1318.51, // E6
];

/**
 * Generate a deterministic hash number from a word string
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Play typing key sound
 */
export function playKeySound(theme: SoundTheme, char: string = ' ') {
  if (theme === 'off') return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (theme === 'mechanical') {
    // Mechanical switch: sharp transient click + low body resonance
    const bufferSize = Math.floor(ctx.sampleRate * 0.012);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3400 + Math.random() * 600, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.012);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150 + Math.random() * 25, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.03);

    oscGain.gain.setValueAtTime(0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  } else if (theme === 'melodic') {
    // Gentle marimba / acoustic chime mapped to letter
    const code = char.charCodeAt(0) || 65;
    const noteIdx = (code % 7) + 3; // notes C4 - A5
    const freq = PENTATONIC_SCALE[noteIdx % PENTATONIC_SCALE.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } else if (theme === 'chiptune') {
    // 8-bit retro square wave plink
    const code = char.charCodeAt(0) || 65;
    const baseFreq = 440 + ((code % 12) * 40);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.03);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } else if (theme === 'synthwave') {
    // Warm atmospheric filtered sawtooth
    const code = char.charCodeAt(0) || 65;
    const noteIdx = code % PENTATONIC_SCALE.length;
    const freq = PENTATONIC_SCALE[noteIdx];

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }
}

/**
 * Play a custom harmonic tune when a specific word is typed or discovered!
 * Adapts to keyword category, word length, and sound theme.
 */
export function playWordTune(word: string, theme: SoundTheme, streak: number = 0) {
  if (theme === 'off') return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const cleanWord = word.trim().toLowerCase();
  const hash = hashString(cleanWord);
  const now = ctx.currentTime;

  // Determine note chords based on word characteristics
  let notes: number[] = [];

  // Keywords special tunes
  const isAsync = ['async', 'await', 'promise', 'defer'].includes(cleanWord);
  const isFunction = ['function', 'def', 'func', 'fn', 'lambda', 'return'].includes(cleanWord);
  const isControl = ['if', 'else', 'match', 'switch', 'case', 'try', 'catch'].includes(cleanWord);
  const isType = ['interface', 'struct', 'class', 'type', 'enum', 'trait'].includes(cleanWord);
  const isSymbol = cleanWord.includes('=>') || cleanWord.includes('{') || cleanWord.includes('(');

  if (isAsync) {
    // Ethereal rising 3-chord (C5 -> G5 -> C6)
    notes = [523.25, 783.99, 1046.50];
  } else if (isFunction) {
    // Victorious triad (D5 -> F#5/G5 -> A5)
    notes = [587.33, 783.99, 880.00];
  } else if (isType) {
    // Rich suspended chord (E5 -> A5 -> B5/D6)
    notes = [659.25, 880.00, 1174.66];
  } else if (isControl) {
    // Quick energetic 2-note bounce
    notes = [659.25, 987.77];
  } else if (isSymbol) {
    // Bell chime
    notes = [880.00, 1318.51];
  } else {
    // Dynamic harmonic notes based on word hash
    const rootIndex = (hash % 6) + 3; // C4 - G5
    const root = PENTATONIC_SCALE[rootIndex];
    const third = PENTATONIC_SCALE[(rootIndex + 2) % PENTATONIC_SCALE.length];
    const fifth = PENTATONIC_SCALE[(rootIndex + 4) % PENTATONIC_SCALE.length];

    if (cleanWord.length <= 4) {
      notes = [root, fifth];
    } else {
      notes = [root, third, fifth];
    }
  }

  // Play harmonic notes with slight stagger (arpeggiation)
  notes.forEach((freq, idx) => {
    const startTime = now + idx * 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (theme === 'chiptune') {
      osc.type = 'square';
      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
    } else if (theme === 'synthwave') {
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
    } else {
      // Default & Melodic: warm chime / bell
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);
    }

    osc.frequency.setValueAtTime(freq, startTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  });

  // If on a big streak (5, 10, 15+), play extra harmonic sparkle chime
  if (streak > 0 && streak % 5 === 0) {
    const sparkleTime = now + 0.14;
    const sparkleOsc = ctx.createOscillator();
    const sparkleGain = ctx.createGain();

    sparkleOsc.type = 'sine';
    sparkleOsc.frequency.setValueAtTime(1567.98, sparkleTime); // G6
    sparkleOsc.frequency.exponentialRampToValueAtTime(2093.00, sparkleTime + 0.15); // C7

    sparkleGain.gain.setValueAtTime(0.1, sparkleTime);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, sparkleTime + 0.15);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(ctx.destination);

    sparkleOsc.start(sparkleTime);
    sparkleOsc.stop(sparkleTime + 0.16);
  }
}

/**
 * Play celebration tune on test completion or streak milestones
 */
export function playCelebrationTune(theme: SoundTheme) {
  if (theme === 'off') return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Ascending 4-chord fanfare: C5, E5, G5, C6
  const fanfare = [523.25, 659.25, 783.99, 1046.50];

  fanfare.forEach((freq, idx) => {
    const startTime = now + idx * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = theme === 'chiptune' ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.35);
  });
}

/**
 * Error buzz on mistake
 */
export function playErrorSound(enabled: boolean) {
  if (!enabled) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.linearRampToValueAtTime(95, now + 0.06);

  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}
