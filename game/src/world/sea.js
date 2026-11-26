// The sea plane around the islands.
import * as THREE from 'three';
import { WORLD } from '../core/config.js';

export function buildSea() {
  const geo = new THREE.PlaneGeometry(WORLD.size * 4, WORLD.size * 4, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshPhongMaterial({ color: 0x2a7fa8, shininess: 90, specular: 0x9fd4ff, transparent: true, opacity: 0.9 });
  const sea = new THREE.Mesh(geo, mat);
  sea.position.y = WORLD.seaLevel;
  return sea;
}
