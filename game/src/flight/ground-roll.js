// Rolling on the wheels: tyre and brake friction, keeping the wings level, rotation for take-off, rough ground and the sea.
import * as THREE from 'three';
import { AIRFIELDS } from '../airfields/fields.js';
import { onRunway } from '../airfields/runway-frame.js';
import { isWater } from '../world/height.js';
import { FWD, RIGHT, attitudeOf } from './state.js';
import { crash } from './crash.js';

const qd = new THREE.Quaternion();

// f and r are the aircraft's forward and right axes; speed is the airspeed this step.
export function groundRoll(s, c, dt, speed, f, r) {
  const field = AIRFIELDS.find((af) => onRunway(af, s.pos.x, s.pos.z, 25));
  const rough = !field;
  const grip = (c.brakes ? 0.55 : 0.035) + (rough ? 0.12 : 0) + s.flaps * 0.0;
  const along = s.vel.dot(f);
  const side = s.vel.dot(r);
  s.vel.addScaledVector(f, -Math.sign(along) * Math.min(Math.abs(along), grip * 9.81 * dt));
  s.vel.addScaledVector(r, -side * Math.min(1, dt * 6));
  // Keep the wings level on the wheels; let the nose come up for rotation.
  const att = attitudeOf(s);
  s.quat.multiply(qd.setFromAxisAngle(FWD.clone().negate(), att.bank * Math.min(1, dt * 6)));
  if (att.pitch < 0) s.quat.multiply(qd.setFromAxisAngle(RIGHT, -att.pitch * Math.min(1, dt * 8)));
  else if (speed < 20 || att.pitch > 0.21) { s.quat.multiply(qd.setFromAxisAngle(RIGHT, -att.pitch * Math.min(1, dt * 3))); s.rates.x = Math.min(s.rates.x, 0); }
  if (rough && s.vel.length() > 22) { s.damage += dt * 25; if (s.damage >= 100) crash(s, 'Ran off the runway into rough ground and broke the gear'); }
  if (isWater(s.pos.x, s.pos.z)) crash(s, 'Rolled into the sea');
}
