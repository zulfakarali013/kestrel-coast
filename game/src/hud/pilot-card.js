// The pilot card: the pilot's state in a word, a sentence of advice, the stall-margin meter and the latest reaction badges.
import { MUTED, glowText, panel } from './style.js';
import { LEVEL_COLOUR, reactionBadges } from './reaction-badges.js';

// Wraps text into lines that fit width w at the current font.
function wrap(g, text, w) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (g.measureText(next).width > w && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

// state: from pilotState(); items: live reactions. Returns the card's height.
export function pilotCard(g, x, y, state, items) {
  const w = 280, col = LEVEL_COLOUR[state.level];
  g.font = 'bold 12px "Trebuchet MS", sans-serif';
  const lines = wrap(g, state.line, w - 24);
  // Measure the badges first so the frame fits them.
  const probe = (pilotCard.probe ||= document.createElement('canvas').getContext('2d'));
  const badgeH = reactionBadges(probe, x + 12, 0, w - 24, items);
  const h = 74 + lines.length * 16 + (badgeH ? badgeH + 10 : 0);
  panel(g, x, y, w, h, 'PILOT · HOW IT IS GOING', col);
  glowText(g, state.word, x + 12, y + 44, col, 20, 'left');
  lines.forEach((l, i) => glowText(g, l, x + 12, y + 68 + i * 16, MUTED, 12, 'left'));
  const my = y + 68 + lines.length * 16;
  glowText(g, 'STALL MARGIN', x + 12, my, MUTED, 11, 'left');
  g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x + 100, my - 4, w - 150, 8);
  const mcol = state.margin < 0.2 ? LEVEL_COLOUR.danger : state.margin < 0.4 ? LEVEL_COLOUR.caution : LEVEL_COLOUR.good;
  g.fillStyle = mcol; g.fillRect(x + 100, my - 4, (w - 150) * state.margin, 8);
  glowText(g, `${Math.round(state.margin * 100)}%`, x + w - 12, my, mcol, 12, 'right');
  if (badgeH) reactionBadges(g, x + 12, my + 14, w - 24, items);
  return h;
}
