// One physics step, in order: fuel, spool, gusts, aerodynamic forces, rotation, motion, ground roll, touchdown, stress.
import * as THREE from 'three';
import { AIRCRAFT as A } from '../core/config.js';
import { groundAt } from '../world/height.js';
import { FWD, UP, RIGHT, attitudeOf } from './state.js';
import { burnFuel } from './fuel-burn.js';
import { spool } from './spool.js';
import { gustAt } from './gusts.js';
import { aeroForces } from './aero-forces.js';
import { rotate } from './rotation.js';
import { groundRoll } from './ground-roll.js';
import { groundContact } from './touchdown.js';
import { airframeStress } from './airframe-stress.js';

const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();

// One fixed physics step. controls: pitch, roll, yaw in -1..1, throttle 0..1, flaps 0..1, brakes bool.
export function stepFlight(s, c, dt, time) {
  if (s.crashed) return;
  const health = 1 - s.damage / 140;
  spool(s, burnFuel(s, c, dt), c.flaps, dt);

  const bankNow = attitudeOf(s).bank;
  const f = v1.copy(FWD).applyQuaternion(s.quat);
  const u = v2.copy(UP).applyQuaternion(s.quat);
  const r = v3.copy(RIGHT).applyQuaternion(s.quat);

  const gust = gustAt(s, time);
  const { force, speed, aoa, vr } = aeroForces(s, f, u, r, gust, health);
  rotate(s, c, dt, time, speed, aoa, vr, bankNow, health, gust);

  const acc = force.divideScalar(A.mass);
  s.gForce = acc.clone().add(new THREE.Vector3(0, 9.81, 0)).dot(u) / 9.81;
  s.vel.addScaledVector(acc, dt);

  const ground = groundAt(s.pos.x, s.pos.z);
  if (s.onGround) groundRoll(s, c, dt, speed, f, r);
  s.pos.addScaledVector(s.vel, dt);
  groundContact(s, ground, time);
  airframeStress(s, speed, dt);

  s.agl = s.pos.y - A.gearHeight - ground;
  s.vs = s.vel.y;
}
