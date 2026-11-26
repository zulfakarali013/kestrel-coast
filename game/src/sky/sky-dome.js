// Sky dome with the low sun, haze and the hemisphere and sun lights.
import * as THREE from 'three';
import { WORLD } from '../core/config.js';

export const SUN_DIR = new THREE.Vector3(-0.55, 0.42, 0.72).normalize();

export const HORIZON = new THREE.Color(0xf6c99a);

export const ZENITH = new THREE.Color(0x3f7fc0);

export function buildSky(scene) {
  scene.fog = new THREE.Fog(0xe9c9a6, WORLD.fogNear, WORLD.fogFar);
  scene.background = HORIZON.clone();

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(16000, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { horizon: { value: HORIZON }, zenith: { value: ZENITH }, sun: { value: SUN_DIR } },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 horizon; uniform vec3 zenith; uniform vec3 sun; varying vec3 vDir;
        void main(){ float h = clamp(vDir.y, 0.0, 1.0); vec3 c = mix(horizon, zenith, pow(h, 0.55));
        float s = max(dot(normalize(vDir), sun), 0.0); c += vec3(1.0,0.85,0.55) * (pow(s, 600.0) * 2.0 + pow(s, 12.0) * 0.35);
        if (vDir.y < 0.0) c = mix(horizon, vec3(0.55,0.62,0.66), clamp(-vDir.y*4.0,0.0,1.0)); gl_FragColor = vec4(c,1.0); }`,
    }),
  );
  dome.renderOrder = -1;
  scene.add(dome);

  const hemi = new THREE.HemisphereLight(0xcfe4ff, 0x5a6b3a, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe2b8, 2.1);
  sun.position.copy(SUN_DIR).multiplyScalar(3000);
  scene.add(sun);
  return { dome, sun };
}
