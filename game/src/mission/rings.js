// Puts a sortie's rings in the world and tells which side of a ring the aircraft is on.
import * as THREE from 'three';

export const ringMatGold = new THREE.MeshBasicMaterial({ color: 0xffc23a, transparent: true, opacity: 0.95 });

export const ringMatNext = new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.5 });

export const ringMatDone = new THREE.MeshBasicMaterial({ color: 0x7fe39a, transparent: true, opacity: 0.25 });

export function createSortie(mission, scene) {
  const rings = mission.rings();
  const group = new THREE.Group();
  const meshes = rings.map((r) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r.radius, 2.2, 10, 40), ringMatNext);
    m.position.set(r.x, r.y, r.z);
    m.rotation.y = -THREE.MathUtils.degToRad(r.heading);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1, 6), new THREE.MeshBasicMaterial({ color: 0xffc23a, transparent: true, opacity: 0.3 }));
    post.scale.y = Math.max(1, r.y - 2);
    post.position.set(r.x, r.y / 2, r.z);
    group.add(m, post);
    return m;
  });
  scene.add(group);
  return {
    mission, rings, meshes, group, next: 0, time: 0, passed: 0, missed: 0, closest: Infinity,
    status: 'flying', reason: '', landing: null, score: 0, stars: 0, log: [], lowBonus: 0,
    lastSide: null, prevSide: null,
  };
}

export function disposeSortie(sortie, scene) {
  scene.remove(sortie.group);
}

export function ringSide(ring, pos) {
  const h = THREE.MathUtils.degToRad(ring.heading);
  return (pos.x - ring.x) * Math.sin(h) + (pos.z - ring.z) * -Math.cos(h);
}
