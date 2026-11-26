// The instrument panel drawn in cockpit view: airspeed, attitude, altitude, heading, climb and fuel.
import { AIRCRAFT, MS_TO_KT, M_TO_FT } from '../core/config.js';
import { headingOf, attitudeOf } from '../flight/state.js';
import { gauge, attitudeBall } from './gauges.js';
import { windscreenFrame } from './windscreen.js';

export function cockpitPanel(g, w, h, flight) {
  const top = h * 0.66;
  const grd = g.createLinearGradient(0, top, 0, h);
  grd.addColorStop(0, '#3a3530'); grd.addColorStop(1, '#1d1a17');
  g.fillStyle = grd;
  g.beginPath(); g.moveTo(0, top + 40); g.quadraticCurveTo(w / 2, top - 30, w, top + 40); g.lineTo(w, h); g.lineTo(0, h); g.fill();
  windscreenFrame(g, w, h, top);
  const r = Math.min(64, h * 0.085), y = top + r + 30;
  const { pitch, bank } = attitudeOf(flight);
  const kt = flight.airspeed * MS_TO_KT, ft = flight.pos.y * M_TO_FT;
  const xs = [-3, -2, -1, 0, 1, 2].map((i) => w / 2 + (i + 0.5) * (r * 2 + 26));
  gauge(g, xs[0], y, r, kt / 200, 'KNOTS', String(Math.round(kt)), AIRCRAFT.neverExceed * MS_TO_KT / 200);
  attitudeBall(g, xs[1], y, r, pitch, bank);
  gauge(g, xs[2], y, r, (ft % 1000) / 1000, 'FEET', String(Math.round(ft)));
  gauge(g, xs[3], y, r, headingOf(flight) / 360, 'HEADING', String(Math.round(headingOf(flight))).padStart(3, '0'));
  gauge(g, xs[4], y, r, 0.5 + flight.vs * 196.85 / 4000, 'FT/MIN', String(Math.round(flight.vs * 196.85 / 10) * 10));
  gauge(g, xs[5], y, r, flight.fuel / AIRCRAFT.fuelMax, 'FUEL L', String(Math.round(flight.fuel)), 0);
}
