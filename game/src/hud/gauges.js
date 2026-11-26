// Bar meters for the HUD and the round lit gauges and attitude ball for the cockpit.
import { RED, glowText, box } from './style.js';

export function bar(g, x, y, w, h, frac, label, value, colour) {
  box(g, x, y, w, h, colour);
  g.fillStyle = colour;
  g.globalAlpha = 0.75;
  g.fillRect(x + 3, y + h - 3 - (h - 6) * frac, w - 6, (h - 6) * frac);
  g.globalAlpha = 1;
  glowText(g, label, x + w / 2, y + h + 12, colour, 11);
  glowText(g, value, x + w / 2, y - 11, colour, 13);
}

// Round gauge for the cockpit panel: a lit face, a scale, a needle.
export function gauge(g, x, y, r, frac, label, value, warn) {
  const grd = g.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r);
  grd.addColorStop(0, '#1c2a24'); grd.addColorStop(1, '#070d0b');
  g.fillStyle = '#2b2f33'; g.beginPath(); g.arc(x, y, r + 6, 0, 7); g.fill();
  g.fillStyle = grd; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  g.strokeStyle = 'rgba(255,214,140,0.85)'; g.lineWidth = 2;
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI * 1.25 + (i / 10) * Math.PI * 1.5;
    g.beginPath(); g.moveTo(x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78); g.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92); g.stroke();
  }
  if (warn) { g.strokeStyle = RED; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r * 0.86, -Math.PI * 1.25 + warn * Math.PI * 1.5, Math.PI * 0.25); g.stroke(); }
  const a = -Math.PI * 1.25 + Math.max(0, Math.min(1, frac)) * Math.PI * 1.5;
  g.strokeStyle = '#ffe6b0'; g.lineWidth = 3; g.shadowColor = '#ffb347'; g.shadowBlur = 8;
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); g.stroke();
  g.shadowBlur = 0;
  glowText(g, label, x, y + r * 0.42, '#ffd99a', Math.round(r * 0.2));
  glowText(g, value, x, y + r * 0.7, '#ffffff', Math.round(r * 0.24));
}

export function attitudeBall(g, x, y, r, pitch, bank) {
  g.fillStyle = '#2b2f33'; g.beginPath(); g.arc(x, y, r + 6, 0, 7); g.fill();
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
  g.translate(x, y); g.rotate(-bank);
  const off = pitch * 57.3 * (r / 30);
  g.fillStyle = '#3d86c6'; g.fillRect(-r * 2, -r * 2 + off, r * 4, r * 2);
  g.fillStyle = '#8a5a2c'; g.fillRect(-r * 2, off, r * 4, r * 2);
  g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-r, off); g.lineTo(r, off); g.stroke();
  for (const p of [-20, -10, 10, 20]) { const yy = off - p * (r / 30); g.beginPath(); g.moveTo(-r * 0.25, yy); g.lineTo(r * 0.25, yy); g.stroke(); }
  g.restore();
  g.strokeStyle = '#ffc45a'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(x - r * 0.6, y); g.lineTo(x - r * 0.2, y); g.lineTo(x, y + r * 0.12); g.lineTo(x + r * 0.2, y); g.lineTo(x + r * 0.6, y); g.stroke();
}
