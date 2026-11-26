// Cockpit pose: High Meadow Supply on short final, flaps 30, gusty crosswind, on the 3° slope to runway 14.
import { airfieldById } from '../airfields/fields.js';
import { fromRunway } from '../airfields/runway-frame.js';
import { placeInAir } from '../flight/state.js';
import { flash } from '../hud/hud.js';
import { flown, aim } from './pose-helpers.js';

export function cockpitPose(game, startSortie, run) {
  startSortie('meadow');
  const f = airfieldById('meadow');
  game.sortie.time = 141; flown(game.sortie, 1);
  const p = fromRunway(f, -f.length / 2 - 620, 1.5);
  placeInAir(game.flight, p.x, f.elev + Math.tan(3 * Math.PI / 180) * 740 + 1, p.z, f.heading + 0.5, 34);
  aim(game.flight, -3, -4);
  game.flight.throttle = 0.3; game.flight.fuel = 38; game.flapStep = 2; game.flight.flaps = 1; game.flight.damage = 6;
  game.rig.view = 'cockpit';
  game.hud.messages = [];
  flash(game.hud, 'SHORT FINAL · FLAPS 30 · GUSTING 14 KT', '#ffe9a8', 99);
  run(12);
}
