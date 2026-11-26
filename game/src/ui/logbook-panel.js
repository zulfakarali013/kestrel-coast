// The logbook card beside the debrief: every sortie with its best stars, how the last flight ended, and what to fly next.
import { MISSIONS } from '../mission/missions.js';
import { starText } from './best-scores.js';

const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

function row(m, i, e, currentId) {
  const here = m.id === currentId ? ' here' : '';
  if (!e) return `<li class="todo${here}"><b>${i + 1}</b><span class="nm">${m.name}</span><span class="res">not flown yet</span></li>`;
  const best = e.bestStars ? `<span class="st">${starText(e.bestStars)}</span>` : '';
  const last = e.last.ok
    ? `<span class="res ok">${e.bestScore} pts · ${e.flights} flight${e.flights > 1 ? 's' : ''}</span>`
    : `<span class="res bad">✗ ${e.last.reason} · ${clock(e.last.time)}</span>`;
  return `<li class="${e.last.ok ? 'done' : 'fail'}${here}"><b>${i + 1}</b><span class="nm">${m.name}</span>${best}${last}</li>`;
}

export function logbookPanel(book, currentId) {
  const flown = MISSIONS.filter((m) => book[m.id]).length;
  const stars = MISSIONS.reduce((n, m) => n + (book[m.id]?.bestStars || 0), 0);
  const next = MISSIONS.find((m) => !book[m.id]?.bestStars && m.id !== currentId) || MISSIONS.find((m) => m.id !== currentId);
  return `
    <aside class="logbook">
      <h4>PILOT'S LOGBOOK · ${flown} OF ${MISSIONS.length} SORTIES FLOWN · ★ ${stars}/${MISSIONS.length * 3}</h4>
      <ol>${MISSIONS.map((m, i) => row(m, i, book[m.id], currentId)).join('')}</ol>
      <div class="next">NEXT ▸ <b>${next.name}</b> · ${next.goal}</div>
    </aside>`;
}
