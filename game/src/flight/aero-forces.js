// Aerodynamic forces for one step: airflow, angle of attack, stall, lift, drag, thrust and sideslip.
import * as THREE from 'three';
import { AIRCRAFT as A } from '../core/config.js';
import { airDensity } from './atmosphere.js';

// f, u, r are the aircraft's forward, up and right axes in the world. Sets s.airspeed, s.aoa, s.stalled.
// Returns the total force (newtons) plus the airflow numbers the rotation step needs.
export function aeroForces(s, f, u, r, gust, health) {
  const air = s.vel.clone().sub(s.wind);
  if (gust) air.sub(gust);
  const speed = air.length();
  s.airspeed = speed;
  const vf = air.dot(f), vu = air.dot(u), vr = air.dot(r);
  const aoa = speed > 1 ? Math.atan2(-vu, Math.max(vf, 0.1)) : 0;
  s.aoa = aoa;

  const rho = airDensity(s.pos.y);
  const q = 0.5 * rho * speed * speed;
  let cl = A.cl0 + A.clSlope * aoa + A.flapCl * s.flaps;
  s.stalled = Math.abs(aoa) > A.stallAoa && speed > 5;
  if (s.stalled) cl = Math.sign(aoa) * Math.max(0.4, A.clMax - (Math.abs(aoa) - A.stallAoa) * 4);
  cl = THREE.MathUtils.clamp(cl, -1.1, A.clMax + A.flapCl * s.flaps) * (0.75 + 0.25 * health);
  const cd = A.cd0 + A.induced * cl * cl + A.flapDrag * s.flaps + A.gearDrag + (s.damage / 100) * 0.03;

  const force = new THREE.Vector3(0, -A.mass * 9.81, 0);
  force.addScaledVector(f, A.maxThrust * s.throttle * (rho / 1.225) * health);
  if (speed > 0.5) {
    const vdir = air.clone().divideScalar(speed);
    const liftDir = new THREE.Vector3().crossVectors(r, vdir).normalize();
    force.addScaledVector(liftDir, cl * q * A.wingArea);
    force.addScaledVector(vdir, -cd * q * A.wingArea);
    force.addScaledVector(r, -vr * q * 0.0022 * A.wingArea * 40 / Math.max(speed, 10)); // sideslip resistance
  }
  return { force, speed, aoa, vr };
}
