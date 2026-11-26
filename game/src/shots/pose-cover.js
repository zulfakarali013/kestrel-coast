// Cover pose: First Light, four rings flown, on the 3° slope 180 m behind the final gate with runway 07 ahead.
import { airfieldById } from '../airfields/fields.js';
import { fromRunway } from '../airfields/runway-frame.js';
import { placeInAir } from '../flight/state.js';
import { flash } from '../hud/hud.js';
import { flown, aim } from './pose-helpers.js';

export function coverPose(game, startSortie, run) {
  startSortie('circuit');
  const f = airfieldById('kestrel');
  const s = game.sortie;
  s.time = 196; flown(s, 4);
  s.meshes.forEach((m, i) => { if (i < 4) m.visible = false; });
  const back = 1080, p = fromRunway(f, -back, 3);   // on the 3-degree slope, 180 m behind the final gate
  placeInAir(game.flight, p.x, f.elev + Math.tan(3 * Math.PI / 180) * (back - f.length / 2 + 120), p.z, f.heading - 0.5, 39);
  aim(game.flight, -3, 3);
  game.flight.throttle = 0.42; game.input.throttle = 0.42; game.flight.fuel = 61; game.flapStep = 1; game.flight.flaps = 0.5;
  game.hud.messages = [];
  flash(game.hud, 'RING 4 ✓  +100 · FINAL GATE, THEN RUNWAY 07', '#9dffb0', 99);
  run(12);
}
