// Sortie 3, Ridge Run: a nine-ring slalom through the northern ridges against the clock; low flying earns a bonus.
import { ringOverGround } from '../ring-placement.js';

export function ridgeRings() {
  const path = [[-2600, -300, 120, 0], [-2300, -1000, 160, 20], [-1700, -1500, 140, 60], [-900, -2150, 200, 75], [-200, -2500, 190, 95], [600, -2350, 210, 120], [1300, -1900, 170, 140], [1900, -1300, 150, 160], [2300, -600, 120, 175]];
  return path.map(([x, z, agl, h]) => ringOverGround(x, z, agl, h, 32));
}

export const RIDGE_RUN = {
  id: 'ridge', name: 'Ridge Run', kind: 'Slalom',
  goal: 'Thread nine rings through the northern ridges against the clock. Low and fast scores best.',
  brief: 'Mountain valley race. Every second counts, and so does every scrape with the rock.',
  start: { type: 'air', x: -2700, y: 260, z: 400, heading: 355, speed: 55 }, fuel: 0.6, wind: [0, 0], turbulence: 0.4,
  rings: ridgeRings, ringNames: ['Valley gate', 'West col', 'Pine gorge', 'Saddle', 'High pass', 'Twin rocks', 'Eagle notch', 'Ridge drop', 'Home gate'],
  land: null, par: 150, timeLimit: 300,
};
