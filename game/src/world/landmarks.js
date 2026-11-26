// The Gull Point lighthouse and the harbour village: landmarks to steer by.
import * as THREE from 'three';
import { makeRng } from '../core/noise.js';
import { heightAt } from './height.js';

// A lighthouse on the Gull Island point and a small harbour village: landmarks to steer by.
export function buildLandmarks() {
  const g = new THREE.Group();
  const lh = new THREE.Group();
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(3, 4.2, 30, 12), new THREE.MeshLambertMaterial({ color: 0xf4f1ea }));
  tower.position.y = 15;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 6, 12), new THREE.MeshLambertMaterial({ color: 0xc8342a }));
  band.position.y = 18;
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(2.6, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffe9a0 }));
  lamp.position.y = 32;
  lh.add(tower, band, lamp);
  lh.position.set(3720, heightAt(3720, 1500), 1500);
  g.add(lh);

  const rng = makeRng(99);
  const wall = new THREE.MeshLambertMaterial({ color: 0xeee2c8 });
  const roofs = [0xb8442f, 0x9c5a2c, 0x3d6c8c, 0xa83c3c].map((c) => new THREE.MeshLambertMaterial({ color: c }));
  for (let i = 0; i < 46; i++) {
    const x = 400 + (rng() - 0.5) * 520, z = 2350 + (rng() - 0.5) * 300;
    const h = heightAt(x, z);
    if (h < 2 || h > 60) continue;
    const house = new THREE.Group();
    const w = 8 + rng() * 6, d = 7 + rng() * 5, ht = 5 + rng() * 4;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, ht, d), wall);
    box.position.y = ht / 2;
    const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, 4, 4), roofs[i % 4]);
    roof.position.y = ht + 2;
    roof.rotation.y = Math.PI / 4;
    house.add(box, roof);
    house.position.set(x, h, z);
    house.rotation.y = rng() * 3;
    g.add(house);
  }
  return g;
}
