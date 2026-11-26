// The three camera views and switching between them.
import * as THREE from 'three';

export const OFFSET = new THREE.Vector3(0, 4.2, 17);

export const COCKPIT = new THREE.Vector3(0, 0.95, -1.2);

export const tmp = new THREE.Vector3(), tq = new THREE.Quaternion(), up = new THREE.Vector3();

export const VIEWS = ['chase', 'cockpit', 'tower'];

export function createCameraRig(camera) {
  return { camera, view: 'chase', pos: new THREE.Vector3(), look: new THREE.Vector3(), shake: 0, tower: null, first: true };
}

export function nextView(rig) {
  rig.view = VIEWS[(VIEWS.indexOf(rig.view) + 1) % VIEWS.length];
  rig.first = true;
}
