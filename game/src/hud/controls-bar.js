// The key strip along the bottom: every control in view, with the current camera named.
import { AMBER, MUTED, PAPER, glowText } from './style.js';

const KEYS = [['W S', 'PITCH'], ['A D', 'ROLL'], ['Q E', 'RUDDER'], ['⇧ ⌃', 'THROTTLE'], ['G V', 'FLAPS'], ['SPACE', 'BRAKES'], ['C', 'VIEW'], ['L', 'LEGEND'], ['P', 'PAUSE']];

export function controlsBar(g, cx, y, view) {
  const cw = 86, n = KEYS.length, x0 = cx - (cw * n) / 2;
  KEYS.forEach(([k, what], i) => {
    const x = x0 + i * cw;
    g.fillStyle = 'rgba(8,14,20,0.6)';
    g.beginPath(); g.roundRect(x + 3, y, cw - 6, 34, 6); g.fill();
    g.strokeStyle = 'rgba(255,196,90,0.5)'; g.lineWidth = 1; g.stroke();
    glowText(g, k, x + cw / 2, y + 11, PAPER, 12);
    glowText(g, what === 'VIEW' ? view.toUpperCase() : what, x + cw / 2, y + 25, what === 'VIEW' ? AMBER : MUTED, 10);
  });
}
