// Clusters of soft cloud puffs at 900 to 1,400 m.
import * as THREE from 'three';
import { WORLD } from '../core/config.js';
import { makeRng } from '../core/noise.js';

// Clouds are clusters of soft white puffs at 900 to 1400 m, drifting with the wind.
export function buildClouds() {
  const rng = makeRng(404);
  const group = new THREE.Group();
  const puff = new THREE.IcosahedronGeometry(1, 1);
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x6a5a50, transparent: true, opacity: 0.92, flatShading: true });
  const inst = new THREE.InstancedMesh(puff, mat, 900);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  let n = 0;
  for (let c = 0; c < 70 && n < 900; c++) {
    const cx = (rng() - 0.5) * WORLD.size * 1.4, cz = (rng() - 0.5) * WORLD.size * 1.4, cy = 950 + rng() * 450;
    const puffs = 8 + Math.floor(rng() * 6);
    for (let i = 0; i < puffs && n < 900; i++) {
      const r = 60 + rng() * 90;
      p.set(cx + (rng() - 0.5) * 360, cy + (rng() - 0.3) * 60, cz + (rng() - 0.5) * 220);
      s.set(r * 1.4, r * 0.6, r);
      m.compose(p, q, s);
      inst.setMatrixAt(n++, m);
    }
  }
  inst.count = n;
  group.add(inst);
  return group;
}
