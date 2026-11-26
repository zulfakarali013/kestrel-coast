// Sortie 6, Coast Tour: six low rings around the island's south and east coast for the sightseers, no landing.
import { ringPath } from '../ring-placement.js';

export const COAST_TOUR = {
  id: 'coast', name: 'Coast Tour', kind: 'Low-level tour',
  goal: 'Fly six rings low along the south and east coast for the tourists. Smooth turns, no climbing away.',
  brief: 'Passengers want the cliffs and the surf. Keep it under 300 ft and keep the turns gentle.',
  start: { type: 'air', x: -3400, y: 160, z: 400, heading: 160, speed: 50 }, fuel: 0.55, wind: [3, 0], turbulence: 0.5,
  rings: () => ringPath([[-3100, 1600, 70], [-2000, 2700, 70], [-300, 3200, 80], [1600, 3000, 80], [3000, 2300, 75], [3700, 700, 80]], 34, 160),
  ringNames: ['West cliffs', 'Seal rocks', 'Long beach', 'Harbour mouth', 'Gull point', 'East stacks'],
  land: null, par: 210, timeLimit: 480,
};
