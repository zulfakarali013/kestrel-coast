// Kestrel Coast starts here: size the view, then open the mission board (or pose a screenshot with ?shot=).
import { game, world } from './game/game-state.js';
import { resize } from './game/resize.js';
import { startSortie, openBoard } from './game/session.js';
import { frame } from './game/frame.js';
import { stepGame } from './game/fixed-step.js';
import { startAudio } from './audio/engine-sound.js';
import { setupShot } from './shots/poses.js';

addEventListener('resize', resize);
addEventListener('mousedown', () => startAudio(game.audio));
resize();

const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot || params.has('debug')) window.__game = game; // test hooks for the screenshot and playtest tools
if (shot) {
  game.shot = shot;
  setupShot(shot, { game, scene: world.scene, plane: world.plane, startSortie, openBoard, frame, stepGame, fieldMeshes: world.fieldMeshes });
} else {
  openBoard();
  requestAnimationFrame(frame);
}
