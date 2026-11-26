// Moving between screens: open the mission board, start a sortie, end it with a debrief.
import * as THREE from 'three';
import { game, world, ui } from './game-state.js';
import { createFlightState, placeOnRunway, placeInAir } from '../flight/state.js';
import { airfieldById } from '../airfields/fields.js';
import { missionById, landingField } from '../mission/missions.js';
import { createSortie, disposeSortie } from '../mission/rings.js';
import { flash } from '../hud/hud.js';
import { showMenu, hide } from '../ui/mission-board.js';
import { showDebrief } from '../ui/debrief.js';

export function startSortie(id) {
  const m = missionById(id);
  game.missionId = id;
  if (game.sortie) disposeSortie(game.sortie, world.scene);
  const f = (game.flight = createFlightState());
  f.fuel = 120 * m.fuel;
  f.wind.set(m.wind[0], 0, m.wind[1]);
  f.turbulence = m.turbulence;
  if (m.start.type === 'runway') placeOnRunway(f, airfieldById(m.start.field));
  else placeInAir(f, m.start.x, m.start.y, m.start.z, m.start.heading, m.start.speed);
  game.input.throttle = f.throttle;
  game.flapStep = 0;
  game.sortie = createSortie(m, world.scene);
  const dest = landingField(m);
  game.rig.tower = dest ? new THREE.Vector3(dest.x + 140, dest.elev + 30, dest.z + 60) : null;
  game.rig.first = true;
  game.state = 'flying';
  game.paused = false;
  hide(ui.menu); hide(ui.debrief);
  flash(game.hud, m.brief, '#ffe9a8', 5);
  ui.status.textContent = `${m.name}: ${m.goal}`;
}

export function openBoard() {
  game.state = 'menu';
  hide(ui.debrief);
  if (document.pointerLockElement) document.exitPointerLock();
  showMenu(ui.menu, game.missionId, (id) => { game.missionId = id; openBoard(); }, () => startSortie(game.missionId));
}

export function endSortie() {
  game.state = 'debrief';
  if (document.pointerLockElement) document.exitPointerLock();
  showDebrief(ui.debrief, game.sortie, game.flight, () => startSortie(game.missionId), openBoard);
  ui.status.textContent = `${game.sortie.status === 'complete' ? 'Complete' : 'Failed'}: ${game.sortie.reason}`;
}
