// Where the two islands are and the raw shape of their hills and northern peaks.
import * as THREE from 'three';
import { fbm, ridge } from './../core/noise.js';

export const SEED = 7;

export const ISLANDS = [
  { x: 0, z: -400, r: 3300, peak: 1 },      // Kestrel, the main island, mountains to the north
  { x: 3350, z: 1850, r: 820, peak: 0.12 }, // Gull Island, low and sandy
];

export function islandMask(x, z) {
  let m = 0;
  for (const is of ISLANDS) {
    const d = Math.hypot(x - is.x, z - is.z);
    const wobble = (fbm(x / 900, z / 900, SEED + 3, 3) - 0.5) * is.r * 0.45;
    const t = 1 - (d + wobble) / is.r;
    m = Math.max(m, THREE.MathUtils.clamp(t * 3.2, -1, 1));
  }
  return m;
}

export function rawHeight(x, z) {
  const m = islandMask(x, z);
  if (m <= 0) return -8 + m * 40;
  const north = THREE.MathUtils.smoothstep(-z, -400, 2600);          // 0 in the south, 1 in the far north
  const hills = fbm(x / 1100, z / 1100, SEED, 5) * 90;
  const peaks = Math.pow(ridge(x / 1500, z / 1500, SEED + 9), 2.2) * 820 * north;
  const shore = THREE.MathUtils.smoothstep(m, 0, 0.35);
  return (2 + hills * shore + peaks * shore * m) * shore + (shore < 1 ? -3 * (1 - shore) : 0);
}
