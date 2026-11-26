// Flashing warnings: stall, fuel, sink rate near the ground, overspeed, brakes.
import { AIRCRAFT } from '../core/config.js';
import { AMBER, RED, glowText } from './style.js';

export function warnings(flight) {
  const w = [];
  if (flight.stalled) w.push(['STALL · NOSE DOWN, POWER UP', RED]);
  if (flight.fuel <= 0) w.push(['ENGINE OUT · NO FUEL', RED]);
  else if (flight.fuel < 15) w.push(['LOW FUEL', AMBER]);
  if (!flight.onGround && flight.agl < 60 && flight.vs < -6) w.push(['SINK RATE · PULL UP', RED]);
  if (flight.airspeed > AIRCRAFT.neverExceed) w.push(['OVERSPEED', RED]);
  if (flight.brakes) w.push(['BRAKES', AMBER]);
  return w;
}

export function drawWarnings(g, cx, y, flight) {
  warnings(flight).forEach(([t, c], i) => {
    if (Math.floor(performance.now() / 350) % 2 === 0 || c === AMBER) glowText(g, t, cx, y + i * 26, c, 22);
  });
}
