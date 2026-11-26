// The physics clock: steps the flight model at 120 Hz, then the sortie, then its chimes and callouts.
import { game } from './game-state.js';
import { updateInput } from '../input/controls.js';
import { stepFlight } from '../flight/dynamics.js';
import { updateSortie } from '../mission/sortie-progress.js';
import { describeTouchdown } from '../mission/landing-grade.js';
import { chime } from '../audio/chimes.js';
import { burst } from '../fx/bursts.js';
import { flash } from '../hud/hud.js';
import { endSortie } from './session.js';

const STEP = 1 / 120;
let acc = 0;

export function stepGame(dt) {
  const f = game.flight, inp = game.input, s = game.sortie;
  updateInput(inp, dt);
  const controls = { pitch: inp.pitch, roll: inp.roll, yaw: inp.yaw, throttle: inp.throttle, flaps: game.flapStep / 2, brakes: inp.brakes };
  f.brakes = inp.brakes;
  acc += dt;
  while (acc >= STEP) { stepFlight(f, controls, STEP, game.time); game.time += STEP; acc -= STEP; }
  const before = s.status, hadLanding = s.landing;
  updateSortie(s, f, dt);
  if (s.justPassed) { chime(game.audio, true); flash(game.hud, `RING ${s.next} ✓`, '#9dffb0', 1.4); s.justPassed = 0; }
  if (s.justMissed) { flash(game.hud, `RING ${s.next} MISSED`, '#ff5a48', 1.6); s.justMissed = 0; }
  if (!hadLanding && s.landing) { burst(game.fx, f.pos, 'dust'); flash(game.hud, `${describeTouchdown(s.landing).toUpperCase()} · ${s.landing.sinkFpm} FT/MIN`, '#ffe9a8', 2.5); }
  if (f.crashed && before === 'flying') { burst(game.fx, f.pos, 'crash'); chime(game.audio, false); game.rig.shake = 2.5; flash(game.hud, f.crashReason.toUpperCase(), '#ff5a48', 3); }
  if (s.status !== 'flying') { game.state = 'ending'; setTimeout(endSortie, f.crashed ? 2200 : 900); }
  return controls;
}
