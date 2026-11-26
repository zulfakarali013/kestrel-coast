// One physics step: lift, drag, thrust, stall, fuel burn, damage, ground roll and touchdown judgement.
import * as THREE from 'three';
import { AIRCRAFT as A, LANDING } from '../core/config.js';
import { groundAt, isWater } from '../world/height.js';
import { AIRFIELDS } from '../airfields/fields.js';
import { onRunway, runwayAxes } from '../airfields/runway-frame.js';
import { FWD, UP, RIGHT, attitudeOf } from './state.js';
import { airDensity } from './atmosphere.js';
import { crash } from './crash.js';
const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3(), qd = new THREE.Quaternion();

// One fixed physics step. controls: pitch, roll, yaw in -1..1, throttle 0..1, flaps 0..1, brakes bool.
export function stepFlight(s, c, dt, time) {
  if (s.crashed) return;
  const health = 1 - s.damage / 140;

  // Fuel: burn with throttle, leak with damage; a dry tank starves the engine.
  const burn = (A.burnIdle + (A.burnFull - A.burnIdle) * c.throttle) * dt + (s.damage > 40 ? s.damage * 0.0009 * dt : 0);
  s.fuel = Math.max(0, s.fuel - burn);
  const thrustShare = s.fuel > 0 ? c.throttle : 0;
  s.throttle += (thrustShare - s.throttle) * Math.min(1, dt * 2.5);
  s.flaps += (c.flaps - s.flaps) * Math.min(1, dt * 0.8);

  const bankNow = attitudeOf(s).bank;
  const f = v1.copy(FWD).applyQuaternion(s.quat);
  const u = v2.copy(UP).applyQuaternion(s.quat);
  const r = v3.copy(RIGHT).applyQuaternion(s.quat);

  // Air-relative velocity, with gusts when turbulence is on.
  const gust = s.turbulence > 0 ? new THREE.Vector3(Math.sin(time * 1.7) * 0.6 + Math.sin(time * 4.3), Math.sin(time * 2.9) * 1.2 + Math.sin(time * 6.1) * 0.5, Math.cos(time * 2.1)).multiplyScalar(s.turbulence) : null;
  const air = s.vel.clone().sub(s.wind);
  if (gust) air.sub(gust);
  const speed = air.length();
  s.airspeed = speed;
  const vf = air.dot(f), vu = air.dot(u), vr = air.dot(r);
  const aoa = speed > 1 ? Math.atan2(-vu, Math.max(vf, 0.1)) : 0;
  s.aoa = aoa;

  const rho = airDensity(s.pos.y);
  const q = 0.5 * rho * speed * speed;
  let cl = A.cl0 + A.clSlope * aoa + A.flapCl * s.flaps;
  s.stalled = Math.abs(aoa) > A.stallAoa && speed > 5;
  if (s.stalled) cl = Math.sign(aoa) * Math.max(0.4, A.clMax - (Math.abs(aoa) - A.stallAoa) * 4);
  cl = THREE.MathUtils.clamp(cl, -1.1, A.clMax + A.flapCl * s.flaps) * (0.75 + 0.25 * health);
  const cd = A.cd0 + A.induced * cl * cl + A.flapDrag * s.flaps + A.gearDrag + (s.damage / 100) * 0.03;

  const force = new THREE.Vector3(0, -A.mass * 9.81, 0);
  force.addScaledVector(f, A.maxThrust * s.throttle * (rho / 1.225) * health);
  if (speed > 0.5) {
    const vdir = air.clone().divideScalar(speed);
    const liftDir = new THREE.Vector3().crossVectors(r, vdir).normalize();
    force.addScaledVector(liftDir, cl * q * A.wingArea);
    force.addScaledVector(vdir, -cd * q * A.wingArea);
    force.addScaledVector(r, -vr * q * 0.0022 * A.wingArea * 40 / Math.max(speed, 10)); // sideslip resistance
  }

  // Rotation: stick commands rates; authority grows with airspeed; the airframe weathervanes into the wind.
  const auth = THREE.MathUtils.clamp(speed / 48, 0.12, 1.25) * health * (s.stalled ? 0.45 : 1);
  const target = new THREE.Vector3(c.pitch * A.pitchRate * auth, -c.yaw * A.yawRate * auth, -c.roll * A.rollRate * auth);
  if (!s.onGround && speed > 8) {
    target.x += -(aoa - 0.02) * 2.4 * Math.min(auth, 1);   // pitch stability: the nose settles onto the flight path
    target.y += -(vr / speed) * 2.2;                         // weathervane: the tail pulls the nose into the airflow
    target.z += bankNow * 0.12;                              // dihedral: a gentle pull back toward wings level
    target.y += -Math.sin(bankNow) * 9.81 / Math.max(speed, 20) * 0.9; // coordinated turn: bank swings the nose round
    if (s.stalled) { target.x -= 0.5; target.z += Math.sin(time * 3) * 0.5; }
  }
  s.rates.lerp(target, Math.min(1, dt * 4));
  if (gust) { s.rates.z += gust.y * 0.02 * dt * 10; s.rates.x += gust.x * 0.01 * dt * 10; }
  qd.setFromEuler(new THREE.Euler(s.rates.x * dt, s.rates.y * dt, s.rates.z * dt, 'XYZ'));
  s.quat.multiply(qd).normalize();

  const acc = force.divideScalar(A.mass);
  s.gForce = acc.clone().add(new THREE.Vector3(0, 9.81, 0)).dot(u) / 9.81;
  s.vel.addScaledVector(acc, dt);

  // Ground handling: rolling on wheels, braking, and the touchdown judgement.
  const ground = groundAt(s.pos.x, s.pos.z);
  if (s.onGround) {
    const field = AIRFIELDS.find((af) => onRunway(af, s.pos.x, s.pos.z, 25));
    const rough = !field;
    const grip = (c.brakes ? 0.55 : 0.035) + (rough ? 0.12 : 0) + s.flaps * 0.0;
    const along = s.vel.dot(f);
    const side = s.vel.dot(r);
    s.vel.addScaledVector(f, -Math.sign(along) * Math.min(Math.abs(along), grip * 9.81 * dt));
    s.vel.addScaledVector(r, -side * Math.min(1, dt * 6));
    // Keep the wings level on the wheels; let the nose come up for rotation.
    const att = attitudeOf(s);
    s.quat.multiply(qd.setFromAxisAngle(FWD.clone().negate(), att.bank * Math.min(1, dt * 6)));
    if (att.pitch < 0) s.quat.multiply(qd.setFromAxisAngle(RIGHT, -att.pitch * Math.min(1, dt * 8)));
    else if (speed < 20 || att.pitch > 0.21) { s.quat.multiply(qd.setFromAxisAngle(RIGHT, -att.pitch * Math.min(1, dt * 3))); s.rates.x = Math.min(s.rates.x, 0); }
    if (rough && s.vel.length() > 22) { s.damage += dt * 25; if (s.damage >= 100) crash(s, 'Ran off the runway into rough ground and broke the gear'); }
    if (isWater(s.pos.x, s.pos.z)) crash(s, 'Rolled into the sea');
  }
  s.pos.addScaledVector(s.vel, dt);
  const floor = ground + A.gearHeight;
  if (s.pos.y <= floor) {
    const sink = -s.vel.y;
    if (!s.onGround) {
      const att = attitudeOf(s);
      const water = isWater(s.pos.x, s.pos.z);
      const field = AIRFIELDS.find((af) => onRunway(af, s.pos.x, s.pos.z, 4));
      const td = { sink, bank: att.bank, pitch: att.pitch, speed: s.vel.length(), field: field ? field.id : null, time, x: s.pos.x, z: s.pos.z };
      s.lastTouchdown = td;
      if (water) crash(s, `Ditched in the sea at ${Math.round(td.speed * 1.944)} kt`);
      else if (sink > LANDING.maxSinkCrash) crash(s, `Hit the ground sinking at ${Math.round(sink * 196.85)} ft/min`);
      else if (Math.abs(att.bank) > LANDING.maxBank * 1.8) crash(s, `Caught a wingtip at ${Math.round(Math.abs(att.bank) * 57.3)}° of bank`);
      else if (att.pitch < -LANDING.maxPitchDown * 2.5) crash(s, `Flew into the ground nose-down at ${Math.round(-att.pitch * 57.3)}°`);
      else if (!field && ground > 2) {
        const slope = Math.abs(groundAt(s.pos.x + 6, s.pos.z) - ground) + Math.abs(groundAt(s.pos.x, s.pos.z + 6) - ground);
        if (slope > 2.2 || td.speed > 40) crash(s, `Hit ${ground > 150 ? 'the hillside' : 'rough ground'} at ${Math.round(td.speed * 1.944)} kt`);
        else { s.onGround = true; s.damage = Math.min(99, s.damage + 30); s.events.push({ type: 'touchdown', ...td, offField: true }); }
      } else {
        if (sink > LANDING.maxSinkSafe) s.damage = Math.min(99, s.damage + (sink - LANDING.maxSinkSafe) * 18);
        s.onGround = true;
        s.events.push({ type: 'touchdown', ...td });
      }
    }
    s.pos.y = floor;
    if (s.vel.y < 0) s.vel.y = 0;
  } else if (s.onGround && s.pos.y > floor + 0.4) {
    s.onGround = false;
    s.events.push({ type: 'liftoff', time });
  }
  if (s.onGround && s.pos.y < floor + 0.05) s.pos.y = floor;

  // Overspeed and over-g bend the airframe.
  if (speed > A.neverExceed) s.damage = Math.min(99, s.damage + (speed - A.neverExceed) * dt * 3);
  if (s.gForce > 4.4 || s.gForce < -1.8) s.damage = Math.min(99, s.damage + dt * 12);

  s.agl = s.pos.y - A.gearHeight - ground;
  s.vs = s.vel.y;
}
