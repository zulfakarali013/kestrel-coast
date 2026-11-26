// One drawn frame: step the game (or the idle flight behind the board), move the aircraft and camera, render, draw the HUD.
import * as THREE from 'three';
import { game, world } from './game-state.js';
import { placeInAir } from '../flight/state.js';
import { animateAircraft } from '../aircraft/control-surfaces.js';
import { updateEffects } from '../fx/particles.js';
import { updateCamera } from '../view/follow-camera.js';
import { updateAudio } from '../audio/engine-sound.js';
import { drawHud } from '../hud/hud.js';
import { objective } from '../mission/objective.js';
import { handleHotkeys } from './hotkeys.js';
import { stepGame } from './fixed-step.js';

let last = performance.now();
const ROLL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.35);

function idleFlight(f, dt) {
  game.time += dt;
  const t = game.time * 0.05;
  placeInAir(f, Math.cos(t) * 1500 - 300, 320, Math.sin(t) * 1500 + 600, (-t * 57.3 + 180) % 360, 50);
  f.quat.multiply(ROLL);
  f.throttle = 0.6;
}

function pausedCard(g) {
  g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(0, 0, innerWidth, innerHeight);
  g.fillStyle = '#ffd98a'; g.font = 'bold 40px sans-serif'; g.textAlign = 'center';
  g.fillText('PAUSED · P to resume', innerWidth / 2, innerHeight / 2);
}

export function frame(now) {
  const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
  last = now;
  handleHotkeys();
  const f = game.flight, { plane, scene, camera, renderer, fieldMeshes } = world;
  let controls = { pitch: 0, roll: 0, yaw: 0, flaps: game.flapStep / 2 };
  if (game.state === 'flying' && !game.paused) controls = stepGame(dt);
  else if (game.state === 'menu') idleFlight(f, dt);
  plane.position.copy(f.pos);
  plane.quaternion.copy(f.quat);
  animateAircraft(plane, { ...controls, flaps: f.flaps }, f.throttle, dt, game.time);
  updateEffects(game.fx, dt, f, plane);
  updateCamera(game.rig, plane, f, game.input.look, dt);
  for (const m of fieldMeshes) { const sock = m.userData.windsock; if (sock) sock.rotation.y = Math.atan2(f.wind.x, f.wind.z) - m.rotation.y; }
  renderer.render(scene, camera);
  const flying = game.sortie && (game.state === 'flying' || game.state === 'ending');
  const obj = flying ? objective(game.sortie) : { text: '', target: null };
  drawHud(game.hud, flying ? f : null, flying ? game.sortie : null, game.rig.view, dt, { coast: game.coast, objective: obj.text, target: obj.target });
  if (game.paused) pausedCard(game.hud.g);
  updateAudio(game.audio, game.state === 'flying' ? f : null, game.paused);
  if (!game.shot) requestAnimationFrame(frame);
}
