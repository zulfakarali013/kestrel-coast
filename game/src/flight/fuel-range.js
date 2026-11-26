// How far the fuel left will carry the aircraft at the current throttle, and whether that reaches a point.
import { AIRCRAFT as A } from '../core/config.js';

export function burnRate(flight) {
  const leak = flight.damage > 40 ? flight.damage * 0.0009 : 0;
  return A.burnIdle + (A.burnFull - A.burnIdle) * flight.throttle + leak; // litres a second
}

export function rangeMetres(flight) {
  const ground = Math.hypot(flight.vel.x + 0, flight.vel.z + 0);
  return (flight.fuel / burnRate(flight)) * Math.max(ground, 25);
}

// 'MAKES IT' with a fifth to spare, 'TIGHT' when only just, 'SHORT' when the tank runs dry first.
export function reachVerdict(flight, x, z) {
  const dist = Math.hypot(x - flight.pos.x, z - flight.pos.z);
  const range = rangeMetres(flight);
  return { dist, range, verdict: range > dist * 1.2 ? 'MAKES IT' : range > dist ? 'TIGHT' : 'SHORT' };
}
