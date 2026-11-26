// Sortie 3, Ridge Run: a nine-ring slalom through the northern ridges against the clock; low flying earns a bonus.
import { ringOverGround } from '../ring-placement.js';

export function ridgeRings() {
  const path = [[-2600, -300, 121, 16], [-2300, -1000, 139, 60], [-1400, -900, 141, 95], [-400, -820, 162, 91], [600, -850, 185, 37], [420, -1550, 155, 352], [850, -1950, 84, 70], [1350, -1420, 115, 134], [2300, -600, 145, 131]];
  return path.map(([x, z, agl, h]) => ringOverGround(x, z, agl, h, 32));
}

export const RIDGE_RUN = {
  id: 'ridge', name: 'Ridge Run', kind: 'Slalom',
  goal: 'Thread nine rings through the northern ridges against the clock. Low and fast scores best.',
  brief: 'Mountain valley race. Every second counts, and so does every scrape with the rock.',
  start: { type: 'air', x: -2700, y: 260, z: 400, heading: 355, speed: 55 }, fuel: 0.6, wind: [0, 0], turbulence: 0.4,
  rings: ridgeRings, ringNames: ['Valley gate', 'West col', 'Pine gorge', 'Saddle', 'High pass', 'Twin rocks', 'Eagle notch', 'Ridge drop', 'Home gate'],
  land: null, par: 205, timeLimit: 300,
};
