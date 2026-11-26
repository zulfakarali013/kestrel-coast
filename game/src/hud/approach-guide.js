// Approach lights in the HUD: four lamps like a runway's PAPI, the glide angle, and the centreline offset.
import { GREEN, AMBER, RED, PAPER, glowText, panel } from './style.js';
import { AIM, approachSlope } from '../mission/approach-slope.js';

// Shown when lined up within 4 km of the destination's approach end.
export function approachGuide(g, cx, y, flight, field) {
  const a = approachSlope(flight, field);
  if (!a) return;
  const w = 250;
  panel(g, cx - w / 2, y, w, 70, `APPROACH ${field.code} ${String(Math.round(field.heading / 10)).padStart(2, '0')}`, GREEN);
  const steps = [AIM + 0.9, AIM + 0.3, AIM - 0.3, AIM - 0.9];
  steps.forEach((s, i) => {
    const white = a.angle > s;
    g.fillStyle = white ? '#fffbe8' : '#ff3b2e'; g.shadowColor = g.fillStyle; g.shadowBlur = 10;
    g.beginPath(); g.arc(cx - 102 + i * 22, y + 46, 7, 0, 7); g.fill();
  });
  g.shadowBlur = 0;
  glowText(g, `${a.angle.toFixed(1)}° ${a.word}`, cx + 50, y + 38, Math.abs(a.off) > 1 ? AMBER : GREEN, 13);
  const side = a.across > 0 ? 'RIGHT' : 'LEFT';
  glowText(g, Math.abs(a.across) < 4 ? 'ON CENTRELINE' : `${Math.round(Math.abs(a.across))} M ${side} OF LINE`, cx + 50, y + 56, Math.abs(a.across) > 25 ? RED : PAPER, 12);
}
