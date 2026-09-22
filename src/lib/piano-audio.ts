import { midiToFreq } from "@/lib/song-editor";

let audioCtx: AudioContext | null = null;

function ensureAudio(): AudioContext {
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

// Âm piano đơn giản (triangle + hài bát độ) - giống bản gốc virtual-piano.
export function playNote(midi: number, volume: number) {
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const freq = midiToFreq(midi);

  const osc1 = ctx.createOscillator();
  osc1.type = "triangle";
  osc1.frequency.value = freq;

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = freq * 2;

  const gain = ctx.createGain();
  const gain2 = ctx.createGain();
  gain2.gain.value = 0.15;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

  osc1.connect(gain);
  osc2.connect(gain2);
  gain2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 1.15);
  osc2.stop(now + 1.15);
}
