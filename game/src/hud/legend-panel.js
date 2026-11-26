// The "ON THE ISLAND" legend: what each ring colour, the runway, the approach lights, the arrow and the map marks mean.
import { MUTED, PAPER, glowText, panel } from './style.js';
import { ringIcon, runwayIcon, papiIcon, arrowIcon, youIcon } from './legend-symbols.js';

const ROWS = [
  [(g, x, y) => ringIcon(g, x, y, '#ffc23a'), 'Gold ring', 'fly through it next'],
  [(g, x, y) => ringIcon(g, x, y, '#ffe9a8', 0.6), 'Pale ring', 'still to come'],
  [(g, x, y) => ringIcon(g, x, y, '#7fe39a', 0.5), 'Green ring', 'cleared, +100'],
  [runwayIcon, 'Runway', 'land past the stripes'],
  [papiIcon, '2 red · 2 white', 'on the 3° slope'],
  [arrowIcon, 'Arrow', 'points to the target'],
  [youIcon, 'Map', 'you · white bar = field'],
];

// Returns the panel's height.
export function legendPanel(g, x, y) {
  const w = 260, h = 34 + ROWS.length * 20;
  panel(g, x, y, w, h, 'ON THE ISLAND');
  glowText(g, 'L · HIDE', x + w - 10, y + 12, MUTED, 10, 'right');
  ROWS.forEach(([icon, name, what], i) => {
    const yy = y + 42 + i * 20;
    icon(g, x + 22, yy);
    glowText(g, name, x + 42, yy, PAPER, 12, 'left');
    glowText(g, what, x + w - 12, yy, MUTED, 11, 'right');
  });
  return h;
}
