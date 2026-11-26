// What the pilot should do right now, and where the HUD arrow should point.
import { landingField } from './missions.js';
import { ringName } from './checklist.js';

export function objective(s) {
  if (s.next < s.rings.length) {
    const r = s.rings[s.next];
    return { text: `Fly through ring ${s.next + 1} of ${s.rings.length}: ${ringName(s.mission, s.next)}`, target: { ...r, label: `RING ${s.next + 1}` } };
  }
  const f = landingField(s.mission);
  if (f) return { text: `Land on ${f.name} and stop`, target: { x: f.x, z: f.z, label: f.code } };
  return { text: 'Sortie complete', target: null };
}
