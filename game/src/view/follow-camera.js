// Moves the camera each frame: a lagging chase view, the cockpit eye, or the tower.
import * as THREE from 'three';
import { OFFSET, COCKPIT, tmp, tq, up } from './camera-rig.js';

// Follow the aircraft; lookYaw and lookPitch come from holding the right mouse button.
export function updateCamera(rig, plane, flight, look, dt) {
  const cam = rig.camera;
  if (rig.view === 'cockpit') {
    plane.visible = false;
    cam.position.copy(COCKPIT).applyQuaternion(flight.quat).add(flight.pos);
    tq.copy(flight.quat).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(look.pitch - 0.08, look.yaw, 0, 'YXZ')));
    cam.quaternion.copy(tq);
    cam.fov = 72;
  } else if (rig.view === 'tower' && rig.tower) {
    plane.visible = true;
    cam.position.copy(rig.tower);
    cam.lookAt(flight.pos);
    const d = cam.position.distanceTo(flight.pos);
    cam.fov = THREE.MathUtils.clamp(2400 / Math.max(d, 1), 6, 60);
  } else {
    plane.visible = true;
    // Orbit offset around the aircraft's heading, levelled so the horizon stays readable.
    const yawOnly = new THREE.Quaternion();
    const f = tmp.set(0, 0, -1).applyQuaternion(flight.quat);
    const hdg = Math.atan2(f.x, -f.z);
    yawOnly.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -hdg + look.yaw);
    const pitchTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.asin(THREE.MathUtils.clamp(f.y, -1, 1)) * 0.6 + look.pitch * 0.8);
    const want = OFFSET.clone().applyQuaternion(pitchTilt).applyQuaternion(yawOnly).add(flight.pos);
    const k = rig.first ? 1 : 1 - Math.pow(0.0009, dt);
    rig.pos.lerp(want, k);
    rig.look.lerp(tmp.set(0, 0, -30).applyQuaternion(flight.quat).add(flight.pos), rig.first ? 1 : 1 - Math.pow(0.0004, dt));
    cam.position.copy(rig.pos);
    up.set(0, 1, 0).lerp(new THREE.Vector3(0, 1, 0).applyQuaternion(flight.quat), 0.25).normalize();
    cam.up.copy(up);
    cam.lookAt(rig.look);
    cam.fov = 60 + Math.min(14, flight.airspeed * 0.08);
  }
  if (rig.shake > 0) {
    cam.position.x += (Math.random() - 0.5) * rig.shake;
    cam.position.y += (Math.random() - 0.5) * rig.shake;
    rig.shake = Math.max(0, rig.shake - dt * 2);
  }
  rig.first = false;
  cam.updateProjectionMatrix();
}
