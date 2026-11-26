// Puts the whole world on stage: renderer, sky, island, sea, trees, landmarks, clouds, airfields and the aircraft.
import * as THREE from 'three';
import { buildSky } from '../sky/sky-dome.js';
import { buildClouds } from '../sky/clouds.js';
import { buildTerrain } from './terrain-mesh.js';
import { buildSea } from './sea.js';
import { buildTrees } from './trees.js';
import { buildLandmarks } from './landmarks.js';
import { AIRFIELDS } from '../airfields/fields.js';
import { buildAirfield } from '../airfields/airfield-mesh.js';
import { buildAircraft } from '../aircraft/kestrel-model.js';

export function buildWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.5, 30000);
  buildSky(scene);
  scene.add(buildTerrain(), buildSea(), buildTrees(), buildLandmarks(), buildClouds());
  const fieldMeshes = AIRFIELDS.map((f) => { const m = buildAirfield(f); scene.add(m); return m; });
  const plane = buildAircraft();
  scene.add(plane);
  return { renderer, scene, camera, fieldMeshes, plane };
}
