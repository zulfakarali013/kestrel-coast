// Speed and altitude tapes and the heading tape.
import { GREEN, glowText, box } from './style.js';

// Vertical tape (speed on the left, altitude on the right) with a boxed readout in the middle.
export function tape(g, x, y, h, value, step, labelEvery, unit, side, colour) {
  const w = 74;
  box(g, x, y - h / 2, w, h, colour);
  g.save();
  g.beginPath(); g.rect(x, y - h / 2, w, h); g.clip();
  const px = h / (step * 10);
  const base = Math.floor(value / step) * step;
  g.strokeStyle = colour; g.fillStyle = colour; g.lineWidth = 1.5;
  for (let v = base - step * 6; v <= base + step * 6; v += step) {
    const yy = y - (v - value) * px;
    const major = v % labelEvery === 0;
    const x0 = side < 0 ? x + w : x;
    g.beginPath(); g.moveTo(x0, yy); g.lineTo(x0 + side * (major ? 14 : 7), yy); g.stroke();
    if (major) { g.font = '13px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.fillText(String(v), x + w / 2 + side * -6, yy + 4); }
  }
  g.restore();
  box(g, x - 6, y - 15, w + 12, 30, colour);
  glowText(g, String(Math.round(value)), x + w / 2, y, colour, 20);
  glowText(g, unit, x + w / 2, y - h / 2 - 12, colour, 12);
}

export function headingTape(g, cx, y, hdg) {
  const w = 360;
  box(g, cx - w / 2, y - 16, w, 32);
  g.save(); g.beginPath(); g.rect(cx - w / 2, y - 16, w, 32); g.clip();
  g.strokeStyle = GREEN; g.fillStyle = GREEN; g.lineWidth = 1.5;
  for (let d = Math.floor(hdg / 5) * 5 - 40; d <= hdg + 40; d += 5) {
    const x = cx + (d - hdg) * 4.4;
    const dd = (d + 360) % 360;
    g.beginPath(); g.moveTo(x, y + 16); g.lineTo(x, y + (dd % 10 === 0 ? 6 : 11)); g.stroke();
    if (dd % 30 === 0) {
      const lbl = { 0: 'N', 90: 'E', 180: 'S', 270: 'W' }[dd] ?? String(dd / 10).padStart(2, '0');
      g.font = 'bold 13px "Trebuchet MS", sans-serif'; g.textAlign = 'center'; g.fillText(lbl, x, y - 4);
    }
  }
  g.restore();
  box(g, cx - 28, y + 18, 56, 24);
  glowText(g, String(Math.round(hdg)).padStart(3, '0') + '°', cx, y + 30, GREEN, 16);
}
