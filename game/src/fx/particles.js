// One pool of particles for smoke, dust and fire, and the damage smoke trail.
import * as THREE from 'three';

export const MAX = 400;

export function createEffects(scene) {
  const geo = new THREE.SphereGeometry(1, 6, 4);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false });
  const mesh = new THREE.InstancedMesh(geo, mat, MAX);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX * 3), 3);
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { mesh, parts: [], m: new THREE.Matrix4(), c: new THREE.Color() };
}

export function emit(fx, pos, vel, colour, size, life, grow = 1.5) {
  if (fx.parts.length >= MAX) fx.parts.shift();
  fx.parts.push({ p: pos.clone(), v: vel.clone(), colour: new THREE.Color(colour), size, life, age: 0, grow });
}

export function updateEffects(fx, dt, flight, plane) {
  if (flight && !flight.crashed && flight.damage > 30 && Math.random() < dt * (flight.damage / 8)) {
    const nose = new THREE.Vector3(0, 0.2, -3.5).applyQuaternion(plane.quaternion).add(plane.position);
    emit(fx, nose, new THREE.Vector3(0, 2, 0), flight.damage > 70 ? 0x2a2622 : 0x8a8580, 1, 3, 3);
  }
  fx.parts = fx.parts.filter((q) => (q.age += dt) < q.life);
  fx.parts.forEach((q, i) => {
    q.v.y += dt * 1.5;
    q.v.multiplyScalar(1 - dt * 0.8);
    q.p.addScaledVector(q.v, dt);
    const s = q.size * (1 + (q.age / q.life) * q.grow);
    fx.m.makeScale(s, s, s).setPosition(q.p);
    fx.mesh.setMatrixAt(i, fx.m);
    fx.mesh.setColorAt(i, fx.c.copy(q.colour).multiplyScalar(1 - (q.age / q.life) * 0.5));
  });
  fx.mesh.count = fx.parts.length;
  fx.mesh.instanceMatrix.needsUpdate = true;
  if (fx.mesh.instanceColor) fx.mesh.instanceColor.needsUpdate = true;
}
