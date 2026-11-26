// Top-right card: the aircraft's state as decisions — will the fuel reach, what is the wind doing, how hurt is it.
import { AIRCRAFT } from '../core/config.js';
import { GREEN, AMBER, RED, panel, row } from './style.js';
import { reachVerdict, rangeMetres } from '../flight/fuel-range.js';
import { windComponents } from '../flight/wind-components.js';
import { airframeNote } from '../flight/airframe-note.js';

const km = (m) => (m >= 10000 ? `${Math.round(m / 1000)}` : (m / 1000).toFixed(1)) + ' km';
const LEVEL = { ok: GREEN, caution: AMBER, danger: RED };

export function aircraftPanel(g, x, y, flight, target) {
  const w = 260;
  panel(g, x, y, w, 176, 'KESTREL K-2 · G-KSTL');
  const L = x + 12, W = w - 24;
  const fuelCol = flight.fuel < 15 ? RED : flight.fuel < 30 ? AMBER : GREEN;
  row(g, L, y + 40, W, 'FUEL', `${Math.round(flight.fuel)} / ${AIRCRAFT.fuelMax} L`, fuelCol);
  row(g, L, y + 58, W, 'RANGE AT THIS THROTTLE', km(rangeMetres(flight)), fuelCol);
  if (target) {
    const r = reachVerdict(flight, target.x, target.z);
    row(g, L, y + 76, W, `TO ${target.label}`, `${km(r.dist)} · ${r.verdict}`, r.verdict === 'MAKES IT' ? GREEN : r.verdict === 'TIGHT' ? AMBER : RED);
  }
  const wc = windComponents(flight);
  if (wc) {
    row(g, L, y + 94, W, `WIND ${String(Math.round(wc.from)).padStart(3, '0')}° ${Math.round(wc.kt)} KT`, `${wc.head >= 0 ? 'HEAD' : 'TAIL'} ${Math.abs(Math.round(wc.head))} · X ${Math.abs(Math.round(wc.cross))}`, Math.abs(wc.cross) > 8 ? AMBER : GREEN);
  } else row(g, L, y + 94, W, 'WIND', 'CALM', GREEN);
  row(g, L, y + 112, W, 'ENGINE', flight.fuel > 0 ? `${Math.round(700 + flight.throttle * 1900).toLocaleString('en')} RPM` : 'DEAD · GLIDE', flight.fuel > 0 ? GREEN : RED);
  row(g, L, y + 130, W, 'FLAPS · BRAKES', `${Math.round(flight.flaps * 30)}° · ${flight.brakes ? 'ON' : 'OFF'}`, GREEN);
  const [txt, level] = airframeNote(flight.damage);
  row(g, L, y + 152, W, '', txt, LEVEL[level]);
}
