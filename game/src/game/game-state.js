// The one game object every part of the loop shares: world, flight, sortie, input, camera, HUD, sound.
import { buildWorld } from '../world/build-world.js';
import { heightAt } from '../world/height.js';
import { createFlightState } from '../flight/state.js';
import { createInput } from '../input/controls.js';
import { createCameraRig } from '../view/camera-rig.js';
import { createHud, paintCoast } from '../hud/hud.js';
import { createAudio } from '../audio/engine-sound.js';
import { createEffects } from '../fx/particles.js';
import { createFeed } from '../feedback/reaction-feed.js';

export const world = buildWorld(document.getElementById('world'));

export const game = {
  state: 'menu', missionId: 'circuit', sortie: null, flight: createFlightState(), paused: false, time: 0,
  input: createInput(world.renderer.domElement), rig: createCameraRig(world.camera), hud: createHud(document.getElementById('hud')),
  audio: createAudio(), fx: createEffects(world.scene), coast: paintCoast(heightAt), flapStep: 0,
  feed: createFeed(), legend: true,
};

export const ui = { menu: document.getElementById('menu'), debrief: document.getElementById('debrief'), status: document.getElementById('status') };
