// The pilot's state in a word and a sentence: ON PROFILE, BEHIND THE AIRCRAFT, STALL BUFFET, HIGH ON FINAL and the rest.
import { AIRCRAFT, MS_TO_KT, M_TO_FT } from '../core/config.js';
import { approachSlope } from '../mission/approach-slope.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Returns { word, level, line, margin } where margin is the share of angle of attack left before the stall (0..1).
export function pilotState(flight, target, field) {
  const kt = Math.round(flight.airspeed * MS_TO_KT);
  const margin = clamp01(1 - flight.aoa / AIRCRAFT.stallAoa);
  const out = (word, level, line) => ({ word, level, line, margin });
  if (flight.crashed) return out('WRECKED', 'danger', 'The sortie is over.');
  if (flight.onGround) {
    return kt > 3
      ? out('ROLLING', 'info', `Rolling at ${kt} kt: rudder on the centreline, brakes when slow.`)
      : out('STOPPED', 'good', 'Wheels still. Throttle up to taxi or take off.');
  }
  if (flight.stalled) return out('STALL BUFFET', 'danger', 'The wing has let go: nose down, full power, wings level.');
  if (flight.aoa > AIRCRAFT.stallAoa * 0.8) return out('BEHIND THE AIRCRAFT', 'caution', `Slow and nose-high at ${kt} kt: lower the nose before the wing quits.`);
  if (flight.fuel <= 0) return out('GLIDING', 'danger', 'Engine dry: hold 60 kt and pick the nearest field.');
  const a = approachSlope(flight, field);
  if (a && a.off > 1) return out('HIGH ON FINAL', 'caution', `${a.angle.toFixed(1)}° against 3°: ease the power, add flap.`);
  if (a && a.off < -1) return out('LOW ON FINAL', 'caution', `${a.angle.toFixed(1)}° against 3°: add power, stop the sink.`);
  if (a) return out('ON PROFILE', 'good', `${a.angle.toFixed(1)}° slope at ${kt} kt: hold this power to the flare.`);
  if (flight.airspeed > AIRCRAFT.neverExceed * 0.92) return out('TOO FAST', 'caution', `${kt} kt is near the airframe's limit: throttle back.`);
  if (flight.agl < 60) return out('LOW LEVEL', 'caution', `${Math.round(flight.agl * M_TO_FT)} ft above the ground: keep the speed, watch the hills.`);
  if (target) {
    const d = Math.hypot(target.x - flight.pos.x, target.z - flight.pos.z);
    return out('ON PROFILE', 'good', `${target.label} is ${d > 1000 ? (d / 1000).toFixed(1) + ' km' : Math.round(d) + ' m'} away at ${kt} kt.`);
  }
  return out('ON PROFILE', 'good', `${kt} kt, wings steady.`);
}
