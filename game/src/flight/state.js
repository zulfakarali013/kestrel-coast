// The aircraft's flight state, placing it on a runway or in the air, and reading heading and attitude.
import * as THREE from 'three';
import { AIRCRAFT as A } from '../core/config.js';
import { runwayAxes } from '../airfields/runway-frame.js';

export const FWD = new THREE.Vector3(0, 0, -1), UP = new THREE.Vector3(0, 1, 0), RIGHT = new THREE.Vector3(1, 0, 0);

export const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3(), qd = new THREE.Quaternion();

export function createFlightState() {
  return {
    pos: new THREE.Vector3(), vel: new THREE.Vector3(), quat: new THREE.Quaternion(), rates: new THREE.Vector3(),
    throttle: 0, flaps: 0, brakes: false, fuel: A.fuelMax, damage: 0,
    onGround: false, crashed: false, crashReason: '', stalled: false, aoa: 0, airspeed: 0, agl: 0,
    vs: 0, gForce: 1, lastTouchdown: null, wind: new THREE.Vector3(), turbulence: 0, events: [],
  };
}

// Put the aircraft on a runway's approach end, lined up, engine idling.
export function placeOnRunway(s, field, fromEnd = -1) {
  const ax = runwayAxes(field);
  const dir = fromEnd < 0 ? 1 : -1;
  const along = (field.length / 2 - 40) * fromEnd;
  s.pos.set(field.x + ax.fx * along, field.elev + A.gearHeight, field.z + ax.fz * along);
  const heading = THREE.MathUtils.degToRad(field.heading) + (dir < 0 ? Math.PI : 0);
  s.quat.setFromAxisAngle(UP, -heading);
  s.vel.set(0, 0, 0);
  s.rates.set(0, 0, 0);
  s.onGround = true;
  s.crashed = false;
  s.throttle = 0;
}

// Put the aircraft in the air at a position, heading (degrees) and speed.
export function placeInAir(s, x, y, z, headingDeg, speed) {
  s.pos.set(x, y, z);
  s.quat.setFromAxisAngle(UP, -THREE.MathUtils.degToRad(headingDeg));
  s.vel.copy(FWD).applyQuaternion(s.quat).multiplyScalar(speed);
  s.rates.set(0, 0, 0);
  s.onGround = false;
  s.crashed = false;
  s.throttle = 0.65;
}

export function headingOf(s) {
  const f = v1.copy(FWD).applyQuaternion(s.quat);
  return (THREE.MathUtils.radToDeg(Math.atan2(f.x, -f.z)) + 360) % 360;
}

export function attitudeOf(s) {
  const f = v1.copy(FWD).applyQuaternion(s.quat);
  const r = v2.copy(RIGHT).applyQuaternion(s.quat);
  const pitch = Math.asin(THREE.MathUtils.clamp(f.y, -1, 1));
  const bank = Math.atan2(-r.y, v3.copy(UP).applyQuaternion(s.quat).y);
  return { pitch, bank };
}
