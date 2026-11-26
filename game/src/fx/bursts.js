// Touchdown dust and crash fireballs.
import * as THREE from 'three';
import { emit } from './particles.js';

export function burst(fx, pos, kind) {
  const n = kind === 'crash' ? 80 : 14;
  for (let i = 0; i < n; i++) {
    const v = new THREE.Vector3(Math.random() - 0.5, Math.random() * (kind === 'crash' ? 1.2 : 0.3), Math.random() - 0.5).multiplyScalar(kind === 'crash' ? 30 : 6);
    const col = kind === 'crash' ? (i % 3 === 0 ? 0x2a2420 : i % 3 === 1 ? 0xff8a2a : 0xffd04a) : 0xcdb896;
    emit(fx, pos, v, col, kind === 'crash' ? 3 + Math.random() * 4 : 1.5, kind === 'crash' ? 2 + Math.random() * 3 : 1.4, kind === 'crash' ? 3 : 2);
  }
}
