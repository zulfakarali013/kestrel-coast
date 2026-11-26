// Sortie 1, First Light: a left-hand circuit around Kestrel Field — upwind, crosswind, downwind, base, then runway 07.
import { airfieldById } from '../../airfields/fields.js';
import { fromRunway } from '../../airfields/runway-frame.js';
import { ringOverGround } from '../ring-placement.js';

export function circuitRings() {
  const f = airfieldById('kestrel');
  const pts = [[900, 0, 140], [1500, -700, 300], [0, -1100, 300], [-1500, -700, 260], [-900, 0, 25]];
  const hd = [f.heading, f.heading - 90, f.heading + 180, f.heading + 90, f.heading];
  return pts.map(([a, c, h], i) => { const p = fromRunway(f, a, c); return ringOverGround(p.x, p.z, h, hd[i], 30); });
}

export const FIRST_LIGHT = {
  id: 'circuit', name: 'First Light', kind: 'Circuit',
  goal: 'Take off from Kestrel Field, fly the five circuit rings and land back on runway 07.',
  brief: 'Dawn patrol check ride. Keep it tidy: rings, then a gentle landing on the numbers.',
  start: { type: 'runway', field: 'kestrel' }, fuel: 0.7, wind: [0, 0], turbulence: 0,
  rings: circuitRings, ringNames: ['Upwind', 'Crosswind', 'Downwind', 'Downwind turn', 'Final'],
  land: 'kestrel', par: 260, timeLimit: 600,
};
