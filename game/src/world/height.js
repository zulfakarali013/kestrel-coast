// Ground height anywhere on the map, with every airfield levelled; shared by meshes and the flight model.
import * as THREE from 'three';
import { WORLD } from '../core/config.js';
import { AIRFIELDS } from '../airfields/fields.js';
import { toRunway } from '../airfields/runway-frame.js';
import { rawHeight } from './islands.js';

const SLOPE = Math.tan(3 * Math.PI / 180);

// Shaves any hill out of the 3-degree approach funnel off each runway end, so a textbook approach clears the ground.
function clearApproach(h, f, p) {
  const out = Math.abs(p.along) - f.length / 2;           // metres beyond the runway end
  if (out <= 0 || out > 2600) return h;
  const dist = out + 120;                   // distance back to the aim point 120 m inside the threshold
  const cap = f.elev + SLOPE * dist - 14;                  // the ground stays 14 m under the glide slope
  if (h <= cap) return h;
  const half = 90 + out * 0.14;                            // the funnel widens with distance
  const w = (1 - THREE.MathUtils.smoothstep(Math.abs(p.across), half, half + 160)) * (1 - THREE.MathUtils.smoothstep(out, 2200, 2600));
  return h - (h - cap) * w;
}

// Height of the ground (or sea floor) in metres at world x, z, with every airfield levelled out.
export function heightAt(x, z) {
  let h = rawHeight(x, z);
  for (const f of AIRFIELDS) {
    const p = toRunway(f, x, z);
    const da = Math.max(0, Math.abs(p.along) - f.length / 2 - 60);
    const dc = Math.max(0, Math.abs(p.across) - f.width / 2 - 70);
    h = clearApproach(h, f, p);
    const d = Math.hypot(da, dc);
    if (d < 320) {
      const w = 1 - THREE.MathUtils.smoothstep(d, 0, 320);
      h = h + (f.elev - h) * w;
    }
  }
  return h;
}

export function groundAt(x, z) {
  return Math.max(heightAt(x, z), WORLD.seaLevel);
}

export function isWater(x, z) {
  return heightAt(x, z) < WORLD.seaLevel;
}
