// Plants pines and broadleaf trees on gentle green slopes, never on a runway.
import * as THREE from 'three';
import { WORLD } from '../core/config.js';
import { fbm, makeRng } from '../core/noise.js';
import { SEED } from './islands.js';
import { heightAt } from './height.js';
import { AIRFIELDS } from '../airfields/fields.js';
import { toRunway } from '../airfields/runway-frame.js';

// Low-poly pines and broadleaf trees on the gentle green slopes, never on a runway.
export function buildTrees() {
  const rng = makeRng(SEED * 31);
  const pine = new THREE.ConeGeometry(4.5, 16, 6);
  pine.translate(0, 9, 0);
  const trunkless = new THREE.InstancedMesh(pine, new THREE.MeshLambertMaterial({ color: 0x2f5a2c, flatShading: true }), 2600);
  const broad = new THREE.IcosahedronGeometry(6, 0);
  broad.translate(0, 8, 0);
  const round = new THREE.InstancedMesh(broad, new THREE.MeshLambertMaterial({ color: 0x4f7f34, flatShading: true }), 1400);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  let np = 0, nr = 0;
  for (let tries = 0; tries < 60000 && (np < 2600 || nr < 1400); tries++) {
    const x = (rng() - 0.5) * WORLD.size * 0.9, z = (rng() - 0.5) * WORLD.size * 0.9;
    const h = heightAt(x, z);
    if (h < 8 || h > 480) continue;
    if (fbm(x / 160, z / 160, SEED + 21, 3) < 0.45) continue;
    const slope = Math.abs(heightAt(x + 12, z) - h) / 12;
    if (slope > 0.6) continue;
    if (AIRFIELDS.some((f) => { const r = toRunway(f, x, z); const out = Math.abs(r.along) - f.length / 2; return (out < 260 && Math.abs(r.across) < 140) || (out < 1500 && Math.abs(r.across) < 70 + out * 0.08); })) continue; // runways and their approach lanes stay clear
    const k = 0.7 + rng() * 0.8;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rng() * 6.28);
    p.set(x, h - 1, z);
    s.set(k, k * (0.8 + rng() * 0.5), k);
    m.compose(p, q, s);
    if (h > 200 || rng() < 0.6) { if (np < 2600) trunkless.setMatrixAt(np++, m); }
    else if (nr < 1400) round.setMatrixAt(nr++, m);
  }
  trunkless.count = np;
  round.count = nr;
  const g = new THREE.Group();
  g.add(trunkless, round);
  return g;
}
