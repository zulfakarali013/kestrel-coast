// Small readouts under the tapes: height above ground and climb rate on the right, g-load and angle of attack on the left.
import { M_TO_FT } from '../core/config.js';
import { GREEN, RED, glowText } from './style.js';

export function tapeReadouts(g, cx, cy, flight) {
  glowText(g, `AGL ${Math.round(flight.agl * M_TO_FT)}`, cx + 293, cy + 175, flight.agl < 30 ? RED : GREEN, 13);
  glowText(g, `VS ${Math.round(flight.vs * 196.85 / 10) * 10}`, cx + 293, cy + 193, GREEN, 13);
  glowText(g, `G ${flight.gForce.toFixed(1)}`, cx - 293, cy + 175, flight.gForce > 3.5 ? RED : GREEN, 13);
  glowText(g, `AOA ${(flight.aoa * 57.3).toFixed(0)}°`, cx - 293, cy + 193, flight.stalled ? RED : GREEN, 13);
}
