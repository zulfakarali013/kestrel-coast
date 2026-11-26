// Sortie 8, Meadow Climb: climb from sea level to the High Meadow strip through rising gates in rough air.
import { airfieldById } from '../../airfields/fields.js';
import { ringPath, ringOnSlope } from '../ring-placement.js';

// Two climbing gates, then a gate on the 3° approach slope of High Meadow 14, each one higher than the last.
function climbRings() {
  return [...ringPath([[900, 600, 180], [-300, -800, 150]], 36, 72), ringOnSlope(airfieldById('meadow'), -1600, 36)];
}

export const MEADOW_CLIMB = {
  id: 'climb', name: 'Meadow Climb', kind: 'Climb',
  goal: 'Climb from Kestrel Field through three rising gates and land on High Meadow 14 at 1,350 ft.',
  brief: 'Full power, best climb speed, and do not let the turbulence steal your airspeed.',
  start: { type: 'runway', field: 'kestrel' }, fuel: 0.8, wind: [-3, 2], turbulence: 1.0,
  rings: climbRings, ringNames: ['Lower gate', 'Spur gate', 'Shoulder gate'],
  land: 'meadow', par: 260, timeLimit: 720,
};
