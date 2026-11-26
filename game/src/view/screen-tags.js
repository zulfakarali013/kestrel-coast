// Name tags for places in the 3D view: airfields with their runway, and the next ring's name, projected onto the screen.
import * as THREE from 'three';
import { AIRFIELDS } from '../airfields/fields.js';
import { ringName } from '../mission/checklist.js';

const v = new THREE.Vector3();

// Returns [{ x, y, text, kind }] in CSS pixels for points in front of the camera and within range.
export function screenTags(camera, w, h, flight, sortie) {
  const tags = [];
  const put = (wx, wy, wz, text, kind, range) => {
    if (Math.hypot(wx - flight.pos.x, wz - flight.pos.z) > range) return;
    v.set(wx, wy, wz).project(camera);
    if (v.z > 1 || Math.abs(v.x) > 0.6 || Math.abs(v.y) > 0.9) return;
    tags.push({ x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h, text, kind });
  };
  for (const f of AIRFIELDS) {
    const rwy = String(Math.round(f.heading / 10)).padStart(2, '0');
    put(f.x, f.elev + 6, f.z, `${f.name} · RWY ${rwy}`, 'field', 3600);
  }
  if (sortie && sortie.next < sortie.rings.length) {
    const r = sortie.rings[sortie.next], name = ringName(sortie.mission, sortie.next);
    if (name) put(r.x, r.y + r.radius + 6, r.z, name.toUpperCase(), 'ring', 3000);
  }
  return tags;
}
