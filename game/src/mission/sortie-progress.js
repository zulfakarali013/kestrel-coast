// Follows a sortie as it is flown: ring passes, the landing, success and every way to fail.
import * as THREE from 'three';
import { landingField } from './missions.js';
import { onRunway } from '../airfields/runway-frame.js';
import { ringSide, ringMatGold, ringMatNext, ringMatDone } from './rings.js';
import { gradeLanding } from './landing-grade.js';
import { finish } from './scoring.js';

export function updateSortie(s, flight, dt) {
  if (s.status !== 'flying') return;
  s.time += dt;
  if (!flight.onGround) s.airborne = true;
  const m = s.mission;
  if (s.next < s.rings.length) {
    const ring = s.rings[s.next];
    const side = ringSide(ring, flight.pos);
    const prev = s.prevSide;
    s.prevSide = side;
    const d = Math.hypot(flight.pos.x - ring.x, flight.pos.y - ring.y, flight.pos.z - ring.z);
    s.closest = Math.min(s.closest, d);
    if (prev !== null && prev < 0 && side >= 0 && d < ring.radius * 4) {
      const advance = (ok) => {
        s.log.push({ t: s.time, text: `Ring ${s.next + 1} ${ok ? 'clean' : 'missed'}` });
        s.meshes[s.next].material = ringMatDone;
        s.next++;
        s.closest = Infinity;
        s.prevSide = null;
        if (ok) { s.passed++; s.justPassed = 1; } else { s.missed++; s.justMissed = 1; }
      };
      advance(d <= ring.radius);
    }
  }
  s.meshes.forEach((mesh, i) => { if (i === s.next) mesh.material = ringMatGold; else if (i > s.next) mesh.material = ringMatNext; });
  if (m.id === 'ridge' && flight.agl < 120 && !flight.onGround) s.lowBonus += dt;

  for (const ev of flight.events.splice(0)) {
    if (ev.type === 'crash') return finish(s, 'failed', ev.reason);
    if (ev.type === 'touchdown') {
      const field = landingField(m);
      if (field && ev.field === field.id) {
        s.landing = gradeLanding(ev, field);
        s.log.push({ t: s.time, text: `Touchdown ${s.landing.sinkFpm} ft/min, ${Math.abs(s.landing.across).toFixed(1)} m off centre` });
      } else if (ev.offField) s.log.push({ t: s.time, text: 'Off-field landing: airframe damaged' });
    }
  }

  const field = landingField(m);
  if (field && s.landing && flight.onGround && flight.vel.length() < 2 && onRunway(field, flight.pos.x, flight.pos.z, 6)) {
    if (s.next < s.rings.length) return finish(s, 'failed', `Landed with ${s.rings.length - s.next} ring${s.rings.length - s.next > 1 ? 's' : ''} still to fly`);
    return finish(s, 'complete', `Stopped on ${field.name} runway`);
  }
  if (field && flight.onGround && flight.vel.length() < 1 && !onRunway(field, flight.pos.x, flight.pos.z, 30) && s.time > 20 && flight.damage > 0 && s.landing === null && flight.lastTouchdown) {
    return finish(s, 'failed', 'Stopped short of the destination field');
  }
  if (!field && s.next >= s.rings.length) return finish(s, 'complete', `All ${s.rings.length} rings flown`);
  if (flight.fuel <= 0 && flight.onGround && flight.vel.length() < 1) return finish(s, 'failed', 'Out of fuel and stranded');
  if (s.time > m.timeLimit) return finish(s, 'failed', 'Ran out of daylight');
}
