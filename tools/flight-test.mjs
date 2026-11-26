// Headless flight-model checks: level cruise holds, a takeoff roll lifts off, a stall happens when slow.
// Usage: node tools/flight-test.mjs
import { createFlightState, placeInAir, placeOnRunway, attitudeOf, headingOf } from '../game/src/flight/state.js';
import { stepFlight } from '../game/src/flight/dynamics.js';
import { airfieldById } from '../game/src/airfields/fields.js';

const dt = 1 / 120;
function fly(s, secs, controls, every = 5) {
  for (let t = 0, n = 0; t < secs; t += dt, n++) {
    const c = typeof controls === 'function' ? controls(s, t) : controls;
    stepFlight(s, c, dt, t);
    if (n % Math.round(every / dt) === 0) {
      const a = attitudeOf(s);
      console.log(`t=${t.toFixed(0).padStart(3)} kt=${(s.airspeed * 1.944).toFixed(0).padStart(3)} alt=${s.pos.y.toFixed(0).padStart(5)} vs=${s.vs.toFixed(1).padStart(5)} pitch=${(a.pitch * 57.3).toFixed(1).padStart(5)} bank=${(a.bank * 57.3).toFixed(0).padStart(4)} hdg=${headingOf(s).toFixed(0).padStart(3)} aoa=${(s.aoa * 57.3).toFixed(1)} g=${s.gForce.toFixed(2)} gnd=${s.onGround} stall=${s.stalled} crash=${s.crashReason}`);
    }
    if (s.crashed) break;
  }
}
const idle = (thr) => ({ pitch: 0, roll: 0, yaw: 0, throttle: thr, flaps: 0, brakes: false });

console.log('== cruise, hands off, 65% throttle');
let s = createFlightState(); placeInAir(s, 0, 800, 0, 90, 50); fly(s, 40, idle(0.65));
console.log('== 30 deg bank turn held with roll then neutral');
s = createFlightState(); placeInAir(s, 0, 800, 0, 90, 50); fly(s, 30, (st, t) => ({ ...idle(0.7), roll: t < 0.3 ? 1 : 0, pitch: t > 0.3 ? 0.25 : 0 }));
console.log('== takeoff roll at Kestrel Field');
s = createFlightState(); placeOnRunway(s, airfieldById('kestrel')); fly(s, 40, (st) => ({ ...idle(1), pitch: st.airspeed > 28 && st.pos.y < 60 ? 0.5 : 0 }), 2);
console.log('== power off, nose up: stall');
s = createFlightState(); placeInAir(s, 0, 800, 0, 0, 40); fly(s, 20, { ...idle(0), pitch: 1 }, 2);
console.log('== approach and flare onto Kestrel Field');
import { fromRunway } from '../game/src/airfields/runway-frame.js';
{
  const f = airfieldById('kestrel');
  const p = fromRunway(f, -f.length / 2 - 250, 0);
  s = createFlightState(); placeInAir(s, p.x, f.elev + 25, p.z, f.heading, 33);
  fly(s, 40, (st) => ({ ...idle(st.agl > 4 ? 0.12 : 0), flaps: 1, pitch: st.agl < 6 ? 0.35 : (st.vs < -2.5 ? 0.15 : 0), brakes: st.onGround }), 2);
  console.log('events', JSON.stringify(s.events.map((e) => ({ type: e.type, sink: e.sink && +e.sink.toFixed(2), field: e.field }))), 'damage', s.damage.toFixed(1));
}
