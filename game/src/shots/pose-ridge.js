// Ridge pose: Ridge Run, eight rings flown, running down off the ridges toward ring 9 (Home gate) with the east coast ahead.
import * as THREE from 'three';
import { placeInAir } from '../flight/state.js';
import { flash } from '../hud/hud.js';
import { flown, aim } from './pose-helpers.js';

export function ridgePose(game, startSortie, run) {
  startSortie('ridge');
  const s = game.sortie;
  const prev = s.rings[7], r = s.rings[8];
  s.time = 160; flown(s, 8);
  s.meshes.forEach((m, i) => { if (i < 8) m.visible = false; });
  const inbound = Math.atan2(r.x - prev.x, -(r.z - prev.z));
  const hdg = THREE.MathUtils.radToDeg(inbound);
  const back = 420, left = 110, above = 40; // left of the inbound line and a little high, so the ring sits right of the nose
  placeInAir(game.flight, r.x - Math.sin(inbound) * back - Math.cos(inbound) * left, r.y + above, r.z + Math.cos(inbound) * back - Math.sin(inbound) * left, hdg - 2, 62);
  aim(game.flight, 1, 18);
  game.flight.throttle = 0.9; game.flight.fuel = 36;
  game.hud.messages = [];
  flash(game.hud, 'RING 8 ✓  +100 · HOME GATE NEXT', '#9dffb0', 99);
  run(12);
}
