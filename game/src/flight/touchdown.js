// Meeting the ground: the touchdown judgement (landing, damage or crash), lift-off, and keeping the wheels on the surface.
import { AIRCRAFT as A, LANDING } from '../core/config.js';
import { groundAt, isWater } from '../world/height.js';
import { AIRFIELDS } from '../airfields/fields.js';
import { onRunway } from '../airfields/runway-frame.js';
import { attitudeOf } from './state.js';
import { crash } from './crash.js';

// ground is the terrain height under the aircraft this step.
export function groundContact(s, ground, time) {
  const floor = ground + A.gearHeight;
  if (s.pos.y <= floor) {
    const sink = -s.vel.y;
    if (!s.onGround) {
      const att = attitudeOf(s);
      const water = isWater(s.pos.x, s.pos.z);
      const field = AIRFIELDS.find((af) => onRunway(af, s.pos.x, s.pos.z, 4));
      const td = { sink, bank: att.bank, pitch: att.pitch, speed: s.vel.length(), field: field ? field.id : null, time, x: s.pos.x, z: s.pos.z };
      s.lastTouchdown = td;
      if (water) crash(s, `Ditched in the sea at ${Math.round(td.speed * 1.944)} kt`);
      else if (sink > LANDING.maxSinkCrash) crash(s, `Hit the ground sinking at ${Math.round(sink * 196.85)} ft/min`);
      else if (Math.abs(att.bank) > LANDING.maxBank * 1.8) crash(s, `Caught a wingtip at ${Math.round(Math.abs(att.bank) * 57.3)}° of bank`);
      else if (att.pitch < -LANDING.maxPitchDown * 2.5) crash(s, `Flew into the ground nose-down at ${Math.round(-att.pitch * 57.3)}°`);
      else if (!field && ground > 2) {
        const slope = Math.abs(groundAt(s.pos.x + 6, s.pos.z) - ground) + Math.abs(groundAt(s.pos.x, s.pos.z + 6) - ground);
        if (slope > 2.2 || td.speed > 40) crash(s, `Hit ${ground > 150 ? 'the hillside' : 'rough ground'} at ${Math.round(td.speed * 1.944)} kt`);
        else { s.onGround = true; s.damage = Math.min(99, s.damage + 30); s.events.push({ type: 'touchdown', ...td, offField: true }); }
      } else {
        if (sink > LANDING.maxSinkSafe) s.damage = Math.min(99, s.damage + (sink - LANDING.maxSinkSafe) * 18);
        s.onGround = true;
        s.events.push({ type: 'touchdown', ...td });
      }
    }
    s.pos.y = floor;
    if (s.vel.y < 0) s.vel.y = 0;
  } else if (s.onGround && s.pos.y > floor + 0.4) {
    s.onGround = false;
    s.events.push({ type: 'liftoff', time });
  }
  if (s.onGround && s.pos.y < floor + 0.05) s.pos.y = floor;
}
