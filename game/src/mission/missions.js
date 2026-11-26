// The four sorties: where they start, their rings, fuel, wind, par time and where they end.
import * as THREE from 'three';
import { AIRFIELDS, airfieldById } from '../airfields/fields.js';
import { fromRunway } from '../airfields/runway-frame.js';
import { heightAt } from '../world/height.js';

export function ringOverGround(x, z, agl, heading, radius = 26) {
  return { x, y: Math.max(heightAt(x, z), 0) + agl, z, heading, radius };
}

// A left-hand circuit around Kestrel Field: upwind, crosswind, downwind, base, then the runway.
export function circuitRings() {
  const f = airfieldById('kestrel');
  const pts = [[900, 0, 140], [1500, -700, 300], [0, -1100, 300], [-1500, -700, 260], [-900, 0, 25]];
  const hd = [f.heading, f.heading - 90, f.heading + 180, f.heading + 90, f.heading];
  return pts.map(([a, c, h], i) => { const p = fromRunway(f, a, c); return ringOverGround(p.x, p.z, h, hd[i], 30); });
}

export function ridgeRings() {
  const path = [[-2600, -300, 120, 0], [-2300, -1000, 160, 20], [-1700, -1500, 140, 60], [-900, -2150, 200, 75], [-200, -2500, 190, 95], [600, -2350, 210, 120], [1300, -1900, 170, 140], [1900, -1300, 150, 160], [2300, -600, 120, 175]];
  return path.map(([x, z, agl, h]) => ringOverGround(x, z, agl, h, 32));
}

export const MISSIONS = [
  {
    id: 'circuit', name: 'First Light', kind: 'Circuit',
    goal: 'Take off from Kestrel Field, fly the five circuit rings and land back on runway 07.',
    brief: 'Dawn patrol check ride. Keep it tidy: rings, then a gentle landing on the numbers.',
    start: { type: 'runway', field: 'kestrel' }, fuel: 0.7, wind: [0, 0], turbulence: 0,
    rings: circuitRings, land: 'kestrel', par: 260, timeLimit: 600,
  },
  {
    id: 'ferry', name: 'Lighthouse Mail', kind: 'Ferry',
    goal: 'Carry the mail sack from Kestrel Field to Gull Island and land there. Fuel is short.',
    brief: 'The tanker missed the boat. You have a third of a tank: lean the throttle and fly the line.',
    start: { type: 'runway', field: 'kestrel' }, fuel: 0.3, wind: [4, -2], turbulence: 0.6,
    rings: () => [ringOverGround(1300, 1800, 220, 85, 40), ringOverGround(2500, 1950, 180, 95, 40)],
    land: 'gull', par: 240, timeLimit: 720,
  },
  {
    id: 'ridge', name: 'Ridge Run', kind: 'Slalom',
    goal: 'Thread nine rings through the northern ridges against the clock. Low and fast scores best.',
    brief: 'Mountain valley race. Every second counts, and so does every scrape with the rock.',
    start: { type: 'air', x: -2700, y: 260, z: 400, heading: 355, speed: 55 }, fuel: 0.6, wind: [0, 0], turbulence: 0.4,
    rings: ridgeRings, land: null, par: 150, timeLimit: 300,
  },
  {
    id: 'meadow', name: 'High Meadow Supply', kind: 'Short field',
    goal: 'Deliver medicine to High Meadow: a short strip at 1,350 ft in a gusting crosswind.',
    brief: 'The mountain clinic is waiting. Flaps down, slow and steady, and stop before the trees.',
    start: { type: 'air', x: 900, y: 600, z: -400, heading: 300, speed: 52 }, fuel: 0.45, wind: [-6, 3], turbulence: 1.4,
    rings: () => { const f = airfieldById('meadow'); const p = fromRunway(f, -1200, 0); return [ringOverGround(p.x, p.z, 200, f.heading, 34)]; },
    land: 'meadow', par: 180, timeLimit: 600,
  },
];

export function missionById(id) {
  return MISSIONS.find((m) => m.id === id) ?? MISSIONS[0];
}

export function landingField(mission) {
  return mission.land ? AIRFIELDS.find((f) => f.id === mission.land) : null;
}
