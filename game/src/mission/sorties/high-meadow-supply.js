// Sortie 4, High Meadow Supply: medicine to the short mountain strip at 1,350 ft in a gusting crosswind.
import { airfieldById } from '../../airfields/fields.js';
import { ringOnSlope } from '../ring-placement.js';

export const HIGH_MEADOW_SUPPLY = {
  id: 'meadow', name: 'High Meadow Supply', kind: 'Short field',
  goal: 'Deliver medicine to High Meadow: a short strip at 1,350 ft in a gusting crosswind.',
  brief: 'The mountain clinic is waiting. Flaps down, slow and steady, and stop before the trees.',
  start: { type: 'air', x: 900, y: 600, z: -400, heading: 300, speed: 52 }, fuel: 0.45, wind: [-6, 3], turbulence: 1.4,
  rings: () => [ringOnSlope(airfieldById('meadow'), -1200, 34)],
  ringNames: ['Clinic approach'],
  land: 'meadow', par: 180, timeLimit: 600,
};
