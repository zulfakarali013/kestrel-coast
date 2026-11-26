// Moves the ailerons, elevator, rudder and flaps and spins the prop from the pilot's inputs.
import * as THREE from 'three';

// Move the control surfaces to match the stick, and spin the prop with the throttle.
export function animateAircraft(plane, controls, throttle, dt, time) {
  const { surfaces, prop, disc, beacon } = plane.userData;
  surfaces.aileronL.rotation.x = controls.roll * 0.45;
  surfaces.aileronR.rotation.x = -controls.roll * 0.45;
  surfaces.elevator.rotation.x = -controls.pitch * 0.4;
  surfaces.rudder.rotation.y = -controls.yaw * 0.45;
  const flap = controls.flaps * 0.55;
  surfaces.flapL.rotation.x = flap;
  surfaces.flapR.rotation.x = flap;
  const rpm = 6 + throttle * 60;
  prop.rotation.z += rpm * dt;
  prop.visible = throttle < 0.25;
  disc.material.opacity = 0.08 + throttle * 0.22;
  beacon.visible = Math.floor(time * 1.5) % 2 === 0;
}
