// Ring chime and crash thud.

// A short two-note chime for a ring, or a low thud for a crash.
export function chime(a, good = true) {
  if (!a.ctx || a.muted) return;
  const t = a.ctx.currentTime;
  const notes = good ? [784, 1175] : [180, 90];
  notes.forEach((f, i) => {
    const o = a.ctx.createOscillator(), g = a.ctx.createGain();
    o.type = good ? 'triangle' : 'sawtooth';
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t + i * 0.12);
    g.gain.linearRampToValueAtTime(good ? 0.25 : 0.5, t + i * 0.12 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + (good ? 0.5 : 0.9));
    o.connect(g); g.connect(a.nodes.master);
    o.start(t + i * 0.12); o.stop(t + i * 0.12 + 1);
  });
}
