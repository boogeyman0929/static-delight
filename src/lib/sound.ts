let ctx: AudioContext | null = null;

const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
};

export const click = (freq = 880, dur = 0.05) => {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.08, c.currentTime + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + dur);
};

let ambient: { osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode } | null = null;

export const startAmbient = () => {
  const c = getCtx();
  if (!c || ambient) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = 55;
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.04, c.currentTime + 2);
  lfo.frequency.value = 0.1;
  lfoGain.gain.value = 0.02;
  lfo.connect(lfoGain).connect(gain.gain);
  osc.connect(gain).connect(c.destination);
  osc.start();
  lfo.start();
  ambient = { osc, gain, lfo, lfoGain };
};

export const stopAmbient = () => {
  const c = getCtx();
  if (!c || !ambient) return;
  ambient.gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
  const a = ambient;
  setTimeout(() => {
    try { a.osc.stop(); a.lfo.stop(); } catch { /* noop */ }
  }, 600);
  ambient = null;
};
