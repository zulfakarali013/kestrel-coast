// Sand, grass, forest, rock and snow: the colour of the ground by height and slope.
import * as THREE from 'three';
import { fbm } from '../core/noise.js';
import { SEED } from './islands.js';

export const C = {
  deep: new THREE.Color(0x1d5a7a), sand: new THREE.Color(0xe3cf98), grass: new THREE.Color(0x7aa848),
  meadow: new THREE.Color(0x9bbf55), forest: new THREE.Color(0x3f6e33), rock: new THREE.Color(0x8a7d6c),
  cliff: new THREE.Color(0x6b6258), snow: new THREE.Color(0xf4f6f8),
};

export function colourFor(h, slope, x, z, out) {
  const n = fbm(x / 160, z / 160, SEED + 21, 3);
  if (h < 1.5) out.copy(C.sand);
  else if (h < 6) out.copy(C.sand).lerp(C.grass, (h - 1.5) / 4.5);
  else if (h < 260) out.copy(C.grass).lerp(C.forest, THREE.MathUtils.clamp((n - 0.42) * 3.2, 0, 1)).lerp(C.meadow, THREE.MathUtils.clamp((0.4 - n) * 3, 0, 0.6));
  else if (h < 520) out.copy(C.forest).lerp(C.rock, (h - 260) / 260);
  else out.copy(C.rock).lerp(C.snow, THREE.MathUtils.clamp((h - 520 + n * 120) / 140, 0, 1));
  if (slope > 0.55 && h > 3) out.lerp(C.cliff, THREE.MathUtils.clamp((slope - 0.55) * 2.5, 0, 0.85));
  if (h < 0) out.copy(C.deep);
  return out;
}
