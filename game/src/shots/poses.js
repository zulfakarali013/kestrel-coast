// Screenshot poses: ?shot=cover|cockpit|ridge|board puts the game in a fixed moment so the maker's
// screenshots are real renders of this code, the same every time.
import * as THREE from 'three';
import { airfieldById } from '../airfields/fields.js';
import { fromRunway } from '../airfields/runway-frame.js';
import { placeInAir } from '../flight/state.js';
import { flash } from '../hud/hud.js';
import { placeOnRunway } from '../flight/state.js';
import { gradeLanding } from '../mission/landing-grade.js';
import { finish } from '../mission/scoring.js';
import { burst } from '../fx/bursts.js';
import { endSortie } from '../game/session.js';

// Write the rings already flown into the sortie log, as if the pilot had flown them.
function flown(s, n, missed = []) {
  s.airborne = true;
  for (let i = 0; i < n; i++) s.log.push({ t: (s.time * i) / n, text: `Ring ${i + 1} ${missed.includes(i) ? 'missed' : 'clean'}` });
  s.missed = missed.length; s.passed = n - missed.length; s.next = n;
}

function aim(flight, pitchDeg, bankDeg) {
  flight.quat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(pitchDeg), 0, THREE.MathUtils.degToRad(-bankDeg), 'XYZ')));
  const speed = flight.vel.length();
  flight.vel.set(0, 0, -1).applyQuaternion(flight.quat).multiplyScalar(speed);
}

export function setupShot(name, ctx) {
  const { game, startSortie, openBoard, frame } = ctx;
  let t = performance.now();
  const run = (n, step) => { for (let i = 0; i < n; i++) { if (step) step(i); t += 1000 / 60; frame(t); } };
  game.audio.muted = true;

  if (name === 'board') {
    openBoard();
    game.time = 52;
    run(3);
  } else if (name === 'cover') {
    startSortie('circuit');
    const f = airfieldById('kestrel');
    const s = game.sortie;
    s.time = 196; flown(s, 4);
    s.meshes.forEach((m, i) => { if (i < 4) m.visible = false; });
    const ring = s.rings[4];
    const back = 1080, p = fromRunway(f, -back, 3);   // on the 3-degree slope, 180 m behind the final gate
    placeInAir(game.flight, p.x, f.elev + Math.tan(3 * Math.PI / 180) * (back - f.length / 2 + 120), p.z, f.heading - 0.5, 39);
    aim(game.flight, -3, 3);
    game.flight.throttle = 0.42; game.input.throttle = 0.42; game.flight.fuel = 61; game.flapStep = 1; game.flight.flaps = 0.5;
    game.hud.messages = [];
    flash(game.hud, 'RING 4 ✓  +100 · FINAL GATE, THEN RUNWAY 07', '#9dffb0', 99);
    run(12);
  } else if (name === 'cockpit') {
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
  } else if (name === 'ridge') {
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
  } else if (name === 'landing') {
    // Lighthouse Mail flown and landed at Gull Island: the plane on the runway, the debrief beside it.
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
    endSortie();
    run(8);
  }
  window.__shotReady = true;
}
