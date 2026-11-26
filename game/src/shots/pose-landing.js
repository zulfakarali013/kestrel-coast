// Landing pose: Lighthouse Mail flown and landed at Gull Island — the plane on the runway, the debrief and logbook beside it.
import { airfieldById } from '../airfields/fields.js';
import { fromRunway } from '../airfields/runway-frame.js';
import { placeOnRunway } from '../flight/state.js';
import { gradeLanding } from '../mission/landing-grade.js';
import { finish } from '../mission/scoring.js';
import { burst } from '../fx/bursts.js';
import { endSortie } from '../game/session.js';
import { flown } from './pose-helpers.js';
import { seedLogbook } from './pose-logbook.js';

export function landingPose(game, startSortie, run) {
  startSortie('ferry');
  const f = airfieldById('gull'), s = game.sortie;
  s.time = 231; flown(s, 2);
  s.log.unshift({ t: 0, text: 'Off Kestrel 07 with 36 L' });
  s.log = s.log.map((l, i) => (i ? { t: [0, 96, 168][i], text: l.text + (i === 1 ? ' · Harbour light' : ' · Gull Sound') } : l));
  s.landing = gradeLanding({ x: fromRunway(f, -f.length / 2 + 118, 1.4).x, z: fromRunway(f, -f.length / 2 + 118, 1.4).z, sink: 0.72, bank: 0.01 }, f);
  s.log.push({ t: 214, text: `Touchdown ${s.landing.sinkFpm} ft/min, 1.4 m off centre` }, { t: 231, text: 'Stopped on GULL ISLAND runway, 9 L left' });
  s.meshes.forEach((m) => { m.visible = false; });
  placeOnRunway(game.flight, f);
  const p = fromRunway(f, 40, 1.4);
  game.flight.pos.x = p.x; game.flight.pos.z = p.z;
  game.flight.fuel = 9; game.flight.damage = 0; game.flight.flaps = 1; game.flight.throttle = 0.05;
  finish(s, 'complete', 'Mail delivered: stopped on GULL ISLAND runway');
  game.rig.view = 'chase';
  run(20);
  burst(game.fx, game.flight.pos, 'dust');
  game.state = 'ending';
  seedLogbook();
  endSortie();
  run(8);
}
