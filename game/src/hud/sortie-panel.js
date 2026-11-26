// Top-left card: the sortie's name, clock against par, and its checklist with ticks and misses.
import { GREEN, AMBER, RED, MUTED, PAPER, glowText, panel } from './style.js';
import { checklist } from '../mission/checklist.js';

const MARK = { done: ['✓', GREEN], missed: ['✗', RED], next: ['▸', AMBER], todo: ['○', MUTED] };
const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export function sortiePanel(g, x, y, sortie, objectiveText) {
  const all = checklist(sortie);
  // Long sorties show a window of rows around the current one.
  const cur = Math.max(0, all.findIndex((r) => r.state === 'next'));
  const start = all.length > 8 ? Math.min(Math.max(0, cur - 3), all.length - 8) : 0;
  const rows = all.slice(start, start + 8);
  const w = 280, h = 92 + rows.length * 19 + (all.length > rows.length ? 14 : 0);
  panel(g, x, y, w, h, `${sortie.mission.name.toUpperCase()} · ${sortie.mission.kind.toUpperCase()}`);
  const late = sortie.time > sortie.mission.par;
  glowText(g, `TIME ${clock(sortie.time)}`, x + 12, y + 40, late ? AMBER : GREEN, 14, 'left');
  glowText(g, `PAR ${clock(sortie.mission.par)}`, x + 120, y + 40, MUTED, 13, 'left');
  glowText(g, `RINGS ${sortie.passed}/${sortie.rings.length}`, x + w - 12, y + 40, GREEN, 14, 'right');
  rows.forEach((r, i) => {
    const [m, c] = MARK[r.state];
    const yy = y + 64 + i * 19;
    glowText(g, m, x + 18, yy, c, 14);
    glowText(g, r.text, x + 32, yy, r.state === 'todo' ? MUTED : r.state === 'next' ? PAPER : c, 13, 'left');
  });
  if (all.length > rows.length) glowText(g, `+${all.length - rows.length} more`, x + 32, y + 64 + rows.length * 19 - 4, MUTED, 11, 'left');
  glowText(g, objectiveText, x + 12, y + h - 14, AMBER, 12, 'left');
  return h;
}
