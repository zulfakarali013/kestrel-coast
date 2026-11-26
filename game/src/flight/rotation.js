// Rotation for one step: stick rates scaled by airspeed, plus pitch stability, weathervane, dihedral and turn coordination.
import * as THREE from 'three';
import { AIRCRAFT as A } from '../core/config.js';

const qd = new THREE.Quaternion();

export function rotate(s, c, dt, time, speed, aoa, vr, bankNow, health, gust) {
  const auth = THREE.MathUtils.clamp(speed / 48, 0.12, 1.25) * health * (s.stalled ? 0.45 : 1);
  const target = new THREE.Vector3(c.pitch * A.pitchRate * auth, -c.yaw * A.yawRate * auth, -c.roll * A.rollRate * auth);
  if (!s.onGround && speed > 8) {
    target.x += -(aoa - 0.02) * 2.4 * Math.min(auth, 1);   // pitch stability: the nose settles onto the flight path
    target.y += -(vr / speed) * 2.2;                         // weathervane: the tail pulls the nose into the airflow
    target.z += bankNow * 0.12;                              // dihedral: a gentle pull back toward wings level
    target.y += -Math.sin(bankNow) * 9.81 / Math.max(speed, 20) * 0.9; // coordinated turn: bank swings the nose round
    if (s.stalled) { target.x -= 0.5; target.z += Math.sin(time * 3) * 0.5; }
  }
  s.rates.lerp(target, Math.min(1, dt * 4));
  if (gust) { s.rates.z += gust.y * 0.02 * dt * 10; s.rates.x += gust.x * 0.01 * dt * 10; }
  qd.setFromEuler(new THREE.Euler(s.rates.x * dt, s.rates.y * dt, s.rates.z * dt, 'XYZ'));
  s.quat.multiply(qd).normalize();
}
