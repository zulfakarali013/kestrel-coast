// Checks for the new sorties: their rings sit above ground, and the dead-stick glide can reach Kestrel 07.
import { MISSIONS } from '../game/src/mission/missions.js';
import { heightAt } from '../game/src/world/height.js';
import { createFlightState, placeInAir, headingOf, attitudeOf } from '../game/src/flight/state.js';
import { stepFlight } from '../game/src/flight/dynamics.js';
import { airfieldById } from '../game/src/airfields/fields.js';

for (const m of MISSIONS) {
  const rings = m.rings();
  const low = rings.map((r) => Math.round(r.y - Math.max(0, heightAt(r.x, r.z)) - r.radius));
  console.log(m.id.padEnd(11), 'rings', rings.length, 'names', (m.ringNames || []).length, 'clearance below ring rim (m)', low.join(','));
}

// Dead stick: glide hands-off at a gentle nose-down trim, steering toward the key gate, then the runway.
const m = MISSIONS.find((x) => x.id === 'deadstick');
const f = createFlightState();
f.fuel = 0; f.turbulence = 0;
placeInAir(f, m.start.x, m.start.y, m.start.z, m.start.heading, m.start.speed);
const k = airfieldById('kestrel');
const gate = m.rings()[0];
for (let t = 0; t < 200; t += 1 / 120) {
  const tgt = Math.hypot(gate.x - f.pos.x, gate.z - f.pos.z) > 150 && !f.passed ? gate : k;
  if (tgt === gate && Math.hypot(gate.x - f.pos.x, gate.z - f.pos.z) < 160) f.passed = true;
  const want = (Math.atan2(tgt.x - f.pos.x, -(tgt.z - f.pos.z)) * 57.3 + 360) % 360; const hd = (Math.atan2(-f.quat.clone ? 0 : 0, 1)); void hd;
  const err = ((want - headingOf(f) + 540) % 360) - 180; const bankWant = Math.max(-0.35, Math.min(0.35, err / 57.3)); const roll = Math.max(-1, Math.min(1, (bankWant - attitudeOf(f).bank) * 3));
  stepFlight(f, { pitch: Math.max(-1, Math.min(1, (f.airspeed * 1.944 - 62) * 0.04)), roll, yaw: 0, throttle: 0, flaps: 0, brakes: false }, 1 / 120, t);
  if (Math.round(t * 120) % 1200 === 0) console.log('t', Math.round(t), 'alt', Math.round(f.pos.y), 'agl', Math.round(f.agl), 'kt', Math.round(f.airspeed * 1.944), 'to gate m', Math.round(Math.hypot(gate.x - f.pos.x, gate.z - f.pos.z)), 'gate y', Math.round(gate.y), 'to KST', Math.round(Math.hypot(k.x - f.pos.x, k.z - f.pos.z)), f.crashed ? 'CRASH ' + f.crashReason : '');
  if (f.crashed || f.onGround) break;
}
