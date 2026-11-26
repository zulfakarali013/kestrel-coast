// Approach lights in the HUD: four lamps like a runway's PAPI, the glide angle, and the centreline offset.
import { GREEN, AMBER, RED, PAPER, glowText, panel } from './style.js';
import { toRunway } from '../airfields/runway-frame.js';

const AIM = 3; // degrees: the slope a good approach flies

// Shown when lined up within 4 km of the destination's approach end.
export function approachGuide(g, cx, y, flight, field) {
  if (!field || flight.onGround) return;
  const p = toRunway(field, flight.pos.x, flight.pos.z);
  const toTouch = -field.length / 2 + 120 - p.along;
  if (toTouch < 30 || toTouch > 4000 || Math.abs(p.across) > 350) return;
  const angle = Math.atan2(flight.pos.y - 1.5 - field.elev, toTouch) * 57.3;
  const w = 250;
  panel(g, cx - w / 2, y, w, 70, `APPROACH ${field.code} ${String(Math.round(field.heading / 10)).padStart(2, '0')}`, GREEN);
  const steps = [AIM + 0.9, AIM + 0.3, AIM - 0.3, AIM - 0.9];
  steps.forEach((s, i) => {
    const white = angle > s;
    g.fillStyle = white ? '#fffbe8' : '#ff3b2e'; g.shadowColor = g.fillStyle; g.shadowBlur = 10;
    g.beginPath(); g.arc(cx - 102 + i * 22, y + 46, 7, 0, 7); g.fill();
  });
  g.shadowBlur = 0;
  const off = angle - AIM;
  const word = off > 1 ? 'HIGH' : off > 0.4 ? 'SLIGHTLY HIGH' : off < -1 ? 'LOW' : off < -0.4 ? 'SLIGHTLY LOW' : 'ON SLOPE';
  glowText(g, `${angle.toFixed(1)}° ${word}`, cx + 50, y + 38, Math.abs(off) > 1 ? AMBER : GREEN, 13);
  const side = p.across > 0 ? 'RIGHT' : 'LEFT';
  glowText(g, Math.abs(p.across) < 4 ? 'ON CENTRELINE' : `${Math.round(Math.abs(p.across))} M ${side} OF LINE`, cx + 50, y + 56, Math.abs(p.across) > 25 ? RED : PAPER, 12);
}
