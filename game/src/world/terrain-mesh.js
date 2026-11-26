// Builds the island mesh from the height field, flat-shaded with vertex colours.
import * as THREE from 'three';
import { WORLD } from '../core/config.js';
import { heightAt } from './height.js';
import { colourFor } from './ground-colours.js';

export function buildTerrain() {
  const size = WORLD.size, seg = WORLD.segments;
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colours = new Float32Array(pos.count * 3);
  const col = new THREE.Color();
  const e = size / seg;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = heightAt(x, z);
    pos.setY(i, h);
    const slope = Math.hypot(heightAt(x + e, z) - h, heightAt(x, z + e) - h) / e;
    colourFor(h, slope, x, z, col);
    colours[i * 3] = col.r; colours[i * 3 + 1] = col.g; colours[i * 3 + 2] = col.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colours, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  mesh.receiveShadow = true;
  return mesh;
}
