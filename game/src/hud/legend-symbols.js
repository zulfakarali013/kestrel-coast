// Little symbols for the legend, drawn in the same colours the world and HUD use for the real thing.
import { AMBER } from './style.js';

export function ringIcon(g, x, y, colour, alpha = 1) {
  g.save(); g.globalAlpha = alpha; g.strokeStyle = colour; g.lineWidth = 3;
  g.beginPath(); g.arc(x, y, 7, 0, 7); g.stroke(); g.restore();
}

export function runwayIcon(g, x, y) {
  g.fillStyle = '#3a3f46'; g.fillRect(x - 10, y - 5, 20, 10);
  g.fillStyle = '#ffffff';
  for (let i = 0; i < 3; i++) g.fillRect(x - 9, y - 4 + i * 3, 3, 2);
  g.fillRect(x - 3, y - 0.5, 4, 1); g.fillRect(x + 4, y - 0.5, 4, 1);
}

export function papiIcon(g, x, y) {
  ['#ff3b2e', '#ff3b2e', '#fffbe8', '#fffbe8'].forEach((c, i) => {
    g.fillStyle = c; g.beginPath(); g.arc(x - 9 + i * 6, y, 2.6, 0, 7); g.fill();
  });
}

export function arrowIcon(g, x, y) {
  g.fillStyle = AMBER;
  g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x + 6, y + 5); g.lineTo(x, y + 2); g.lineTo(x - 6, y + 5); g.fill();
}

export function youIcon(g, x, y) {
  g.save(); g.translate(x, y);
  g.fillStyle = AMBER; g.beginPath(); g.moveTo(0, -7); g.lineTo(5, 5); g.lineTo(0, 2); g.lineTo(-5, 5); g.fill();
  g.restore();
  g.strokeStyle = '#ffffff'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(x + 6, y + 6); g.lineTo(x + 11, y - 2); g.stroke();
}
