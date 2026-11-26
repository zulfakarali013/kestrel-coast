// Airframe stress: flying past the never-exceed speed or pulling too many g bends the aircraft.
import { AIRCRAFT as A } from '../core/config.js';

export function airframeStress(s, speed, dt) {
  if (speed > A.neverExceed) s.damage = Math.min(99, s.damage + (speed - A.neverExceed) * dt * 3);
  if (s.gForce > 4.4 || s.gForce < -1.8) s.damage = Math.min(99, s.damage + dt * 12);
}
