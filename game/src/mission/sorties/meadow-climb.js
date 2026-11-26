// Sortie 8, Meadow Climb: climb from sea level to the High Meadow strip through rising gates in rough air.
import { airfieldById } from '../../airfields/fields.js';
import { fromRunway } from '../../airfields/runway-frame.js';
import { ringPath } from '../ring-placement.js';

// Two climbing gates, then a gate on the extended centreline of High Meadow 14.
function climbRings() {
  const m = airfieldById('meadow'), g3 = fromRunway(m, -1600, 0);
  return ringPath([[900, 600, 180], [-300, -800, 300], [g3.x, g3.z, 220]], 36, 72);
}

export const MEADOW_CLIMB = {
  id: 'climb', name: 'Meadow Climb', kind: 'Climb',
  goal: 'Climb from Kestrel Field through three rising gates and land on High Meadow 14 at 1,350 ft.',
  brief: 'Full power, best climb speed, and do not let the turbulence steal your airspeed.',
  start: { type: 'runway', field: 'kestrel' }, fuel: 0.5, wind: [-3, 2], turbulence: 1.0,
  rings: climbRings, ringNames: ['Lower gate', 'Spur gate', 'Shoulder gate'],
  land: 'meadow', par: 260, timeLimit: 720,
};
