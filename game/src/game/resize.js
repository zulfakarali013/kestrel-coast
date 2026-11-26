// Keeps the 3D view and the HUD canvas the size of the window.
import { game, world } from './game-state.js';
import { resizeHud } from '../hud/hud.js';

export function resize() {
  world.renderer.setSize(innerWidth, innerHeight, false);
  world.camera.aspect = innerWidth / innerHeight;
  world.camera.updateProjectionMatrix();
  resizeHud(game.hud);
}
