// Ring placement helpers every sortie uses: a ring at a height above the ground, and a ring path facing its direction of travel.
import { heightAt } from '../world/height.js';

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
