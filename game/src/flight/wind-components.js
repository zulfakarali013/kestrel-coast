// Wind relative to the aircraft: where it blows from, its strength, and its headwind and crosswind parts in knots.
import { MS_TO_KT } from '../core/config.js';
import { headingOf } from './state.js';

// Returns null in calm air (under half a knot).
export function windComponents(flight) {
  const kt = flight.wind.length() * MS_TO_KT;
  if (kt <= 0.5) return null;
  const from = (Math.atan2(-flight.wind.x, flight.wind.z) * 57.3 + 360) % 360;
  const rel = (from - headingOf(flight)) / 57.3;
  return { kt, from, head: Math.cos(rel) * kt, cross: Math.sin(rel) * kt };
}
