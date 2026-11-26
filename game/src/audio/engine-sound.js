// Synthesised engine, wind and stall horn that follow throttle, airspeed and angle of attack.

export function createAudio() {
  return { ctx: null, nodes: null, muted: false, lastChime: 0 };
}

// Browsers only allow sound after a click or key press, so this starts on the first input.
export function startAudio(a) {
  if (a.ctx) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const master = ctx.createGain(); master.gain.value = 0.35; master.connect(ctx.destination);

  const engine = ctx.createOscillator(); engine.type = 'sawtooth';
  const engine2 = ctx.createOscillator(); engine2.type = 'square';
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 600;
  const eg = ctx.createGain(); eg.gain.value = 0.0;
  engine.connect(lp); engine2.connect(lp); lp.connect(eg); eg.connect(master);
  engine.start(); engine2.start();

  const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 0.6;
  const wg = ctx.createGain(); wg.gain.value = 0;
  noise.connect(bp); bp.connect(wg); wg.connect(master); noise.start();

  const horn = ctx.createOscillator(); horn.type = 'square'; horn.frequency.value = 880;
  const hg = ctx.createGain(); hg.gain.value = 0;
  horn.connect(hg); hg.connect(master); horn.start();

  a.ctx = ctx;
  a.nodes = { master, engine, engine2, lp, eg, bp, wg, hg };
}

export function updateAudio(a, flight, paused) {
  if (!a.ctx || !flight) return;
  const n = a.nodes, t = a.ctx.currentTime;
  const on = !paused && !flight.crashed && !a.muted;
  const rpm = 40 + flight.throttle * 70 + flight.airspeed * 0.25;
  n.engine.frequency.setTargetAtTime(rpm, t, 0.1);
  n.engine2.frequency.setTargetAtTime(rpm * 0.5, t, 0.1);
  n.lp.frequency.setTargetAtTime(300 + flight.throttle * 900, t, 0.1);
  n.eg.gain.setTargetAtTime(on && flight.fuel > 0 ? 0.12 + flight.throttle * 0.18 : 0, t, 0.15);
  n.wg.gain.setTargetAtTime(on ? Math.min(0.35, flight.airspeed / 260) : 0, t, 0.2);
  n.bp.frequency.setTargetAtTime(400 + flight.airspeed * 14, t, 0.2);
  n.hg.gain.setTargetAtTime(on && flight.stalled ? 0.06 : 0, t, 0.03);
}
