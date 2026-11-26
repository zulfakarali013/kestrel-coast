// The arrow that points to the next ring or the destination runway, with its distance.
import { AMBER, glowText } from './style.js';

export function arrowTo(g, cx, cy, rel, dist, label) {
  g.save(); g.translate(cx, cy); g.rotate(rel);
  g.fillStyle = AMBER; g.shadowColor = AMBER; g.shadowBlur = 8;
  g.beginPath(); g.moveTo(0, -18); g.lineTo(12, 8); g.lineTo(0, 2); g.lineTo(-12, 8); g.fill();
  g.restore(); g.shadowBlur = 0;
  glowText(g, label, cx, cy + 26, AMBER, 13);
  glowText(g, dist, cx, cy + 42, AMBER, 13);
}
