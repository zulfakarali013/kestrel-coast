// Ridge pose: Ridge Run, three rings flown, banking hard toward ring 4 (the Saddle) along the mountain.
import * as THREE from 'three';
import { placeInAir } from '../flight/state.js';
import { flash } from '../hud/hud.js';
import { flown, aim } from './pose-helpers.js';

export function ridgePose(game, startSortie, run) {
  startSortie('ridge');
  const s = game.sortie;
  const r = s.rings[3];
  s.time = 58; flown(s, 3);
  s.meshes.forEach((m, i) => { if (i < 3) m.visible = false; });
  const back = THREE.MathUtils.degToRad(r.heading);
  placeInAir(game.flight, r.x - Math.sin(back) * 330 + 40, r.y + 8, r.z + Math.cos(back) * 330, r.heading - 12, 62);
  aim(game.flight, 1, 28);
  game.flight.throttle = 0.9; game.flight.fuel = 58;
  game.hud.messages = [];
  flash(game.hud, 'RING 3 ✓  +100 · SADDLE NEXT', '#9dffb0', 99);
  run(12);
}
