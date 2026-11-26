// Pitch ladder, horizon, flight-path marker and bank scale.
import { GREEN, AMBER } from './style.js';

// Pitch ladder and horizon line through the centre of the screen.
export function pitchLadder(g, cx, cy, pitch, bank, fpv) {
  g.save();
  g.translate(cx, cy);
  g.rotate(-bank);
  g.strokeStyle = GREEN; g.fillStyle = GREEN; g.lineWidth = 2;
  g.shadowColor = GREEN; g.shadowBlur = 6;
  const ppd = 9;
  for (let p = -30; p <= 30; p += 5) {
    const y = (pitch * 57.3 - p) * ppd;
    if (Math.abs(y) > 190) continue;
    const half = p === 0 ? 210 : 60;
    g.setLineDash(p < 0 ? [8, 6] : []);
    g.beginPath(); g.moveTo(-half, y); g.lineTo(-24, y); g.moveTo(24, y); g.lineTo(half, y); g.stroke();
    if (p !== 0) { g.font = '12px "Trebuchet MS", sans-serif'; g.textAlign = 'right'; g.fillText(String(p), -half - 6, y + 4); }
  }
  g.setLineDash([]);
  g.restore();
  // Fixed aircraft symbol and the flight path marker.
  g.strokeStyle = AMBER; g.lineWidth = 3; g.shadowColor = AMBER; g.shadowBlur = 6;
  g.beginPath(); g.moveTo(cx - 46, cy); g.lineTo(cx - 14, cy); g.lineTo(cx, cy + 10); g.lineTo(cx + 14, cy); g.lineTo(cx + 46, cy); g.stroke();
  g.strokeStyle = GREEN; g.lineWidth = 2;
  const fy = cy + fpv * 57.3 * 9;
  g.beginPath(); g.arc(cx, fy, 7, 0, Math.PI * 2); g.moveTo(cx - 17, fy); g.lineTo(cx - 7, fy); g.moveTo(cx + 7, fy); g.lineTo(cx + 17, fy); g.moveTo(cx, fy - 7); g.lineTo(cx, fy - 14); g.stroke();
  g.shadowBlur = 0;
  // Bank scale arc.
  g.strokeStyle = GREEN; g.lineWidth = 1.5;
  g.beginPath(); g.arc(cx, cy, 200, -Math.PI / 2 - 0.8, -Math.PI / 2 + 0.8); g.stroke();
  for (const a of [-45, -30, -20, -10, 0, 10, 20, 30, 45]) {
    const r = (a / 57.3) - Math.PI / 2;
    g.beginPath(); g.moveTo(cx + Math.cos(r) * 200, cy + Math.sin(r) * 200); g.lineTo(cx + Math.cos(r) * (a % 30 === 0 ? 214 : 208), cy + Math.sin(r) * (a % 30 === 0 ? 214 : 208)); g.stroke();
  }
  const br = -bank - Math.PI / 2;
  g.fillStyle = AMBER;
  g.beginPath(); g.moveTo(cx + Math.cos(br) * 196, cy + Math.sin(br) * 196); g.lineTo(cx + Math.cos(br + 0.04) * 182, cy + Math.sin(br + 0.04) * 182); g.lineTo(cx + Math.cos(br - 0.04) * 182, cy + Math.sin(br - 0.04) * 182); g.fill();
}
