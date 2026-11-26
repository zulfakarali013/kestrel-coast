// The approach geometry to a runway: glide angle against the 3° aim, the word for it, and the centreline offset.
import { toRunway } from '../airfields/runway-frame.js';

export const AIM = 3; // degrees: the slope a good approach flies

// Returns null unless the aircraft is airborne, lined up, and 30 m–4 km short of the touchdown point.
export function approachSlope(flight, field) {
  if (!field || flight.onGround) return null;
  const p = toRunway(field, flight.pos.x, flight.pos.z);
  const toTouch = -field.length / 2 + 120 - p.along;
  if (toTouch < 30 || toTouch > 4000 || Math.abs(p.across) > 350) return null;
  const angle = Math.atan2(flight.pos.y - 1.5 - field.elev, toTouch) * 57.3;
  const off = angle - AIM;
  const word = off > 1 ? 'HIGH' : off > 0.4 ? 'SLIGHTLY HIGH' : off < -1 ? 'LOW' : off < -0.4 ? 'SLIGHTLY LOW' : 'ON SLOPE';
  return { angle, off, word, across: p.across, toTouch };
}
