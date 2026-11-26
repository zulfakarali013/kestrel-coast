// Converts between world positions and runway coordinates (along and across the centreline).
import * as THREE from 'three';

export function runwayAxes(field) {
  const h = THREE.MathUtils.degToRad(field.heading);
  return { fx: Math.sin(h), fz: -Math.cos(h), rx: Math.cos(h), rz: Math.sin(h) };
}

// Position of a world point in runway coordinates: along (from centre, + toward the heading) and across.
export function toRunway(field, x, z) {
  const a = runwayAxes(field);
  const dx = x - field.x, dz = z - field.z;
  return { along: dx * a.fx + dz * a.fz, across: dx * a.rx + dz * a.rz };
}

// The world point at a runway position; along < 0 is the approach end.
export function fromRunway(field, along, across = 0) {
  const a = runwayAxes(field);
  return { x: field.x + a.fx * along + a.rx * across, z: field.z + a.fz * along + a.rz * across };
}

export function onRunway(field, x, z, pad = 0) {
  const p = toRunway(field, x, z);
  return Math.abs(p.along) <= field.length / 2 + pad && Math.abs(p.across) <= field.width / 2 + pad;
}
