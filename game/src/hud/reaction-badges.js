// Reaction badges: the feed's latest reactions as small coloured chips that wrap inside a width and fade out.
import { GREEN, AMBER, RED, PAPER, glowText } from './style.js';

export const LEVEL_COLOUR = { good: GREEN, info: PAPER, caution: AMBER, danger: RED };

// Draws the chips from (x, y) within width w; returns the height used.
export function reactionBadges(g, x, y, w, items) {
  let cx = x, cy = y;
  g.font = 'bold 11px "Trebuchet MS", sans-serif';
  for (const it of items) {
    const tw = g.measureText(it.text).width + 16;
    if (cx + tw > x + w && cx > x) { cx = x; cy += 22; }
    const col = LEVEL_COLOUR[it.level] || PAPER;
    g.save();
    g.globalAlpha = Math.min(1, it.t / 1.2);
    g.fillStyle = 'rgba(8,14,20,0.75)';
    g.beginPath(); g.roundRect(cx, cy, tw, 18, 4); g.fill();
    g.strokeStyle = col; g.lineWidth = 1.2; g.stroke();
    glowText(g, it.text, cx + tw / 2, cy + 9.5, col, 11);
    g.restore();
    g.font = 'bold 11px "Trebuchet MS", sans-serif';
    cx += tw + 6;
  }
  return items.length ? cy - y + 18 : 0;
}
