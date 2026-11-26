// Ring placement helpers every sortie uses: a ring at a height above the ground, and a ring path facing its direction of travel.
import { heightAt } from '../world/height.js';
import { fromRunway } from '../airfields/runway-frame.js';
import { AIM } from './approach-slope.js';

export function ringOverGround(x, z, agl, heading, radius = 26) {
  return { x, y: Math.max(heightAt(x, z), 0) + agl, z, heading, radius };
}

// Rings along [x, z, agl] points, each facing from the previous point toward it (the first faces startHeading).
export function ringPath(points, radius, startHeading) {
  return points.map(([x, z, agl], i) => {
    const [px, pz] = i ? points[i - 1] : [x - Math.sin(startHeading / 57.3), z + Math.cos(startHeading / 57.3)];
    const heading = (Math.atan2(x - px, -(z - pz)) * 57.3 + 360) % 360;
    return ringOverGround(x, z, agl, heading, radius);
  });
}

// A gate on a runway's extended centreline, `along` metres from the runway centre (negative = approach side),
// set on the 3° approach slope to the touchdown point and facing the landing direction.
export function ringOnSlope(field, along, radius = 34) {
  const p = fromRunway(field, along, 0);
  const toTouch = -field.length / 2 + 120 - along;
  return { x: p.x, y: field.elev + 1.5 + toTouch * Math.tan(AIM / 57.3), z: p.z, heading: field.heading, radius };
}
