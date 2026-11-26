// The sortie written out as a checklist: what is done, what was missed, what is next.
import { landingField } from './missions.js';

const RING_NAMES = {
  circuit: ['Upwind', 'Crosswind', 'Downwind', 'Downwind turn', 'Final'],
  ferry: ['Harbour light', 'Gull Sound'],
  ridge: ['Valley gate', 'West col', 'Pine gorge', 'Saddle', 'High pass', 'Twin rocks', 'Eagle notch', 'Ridge drop', 'Home gate'],
  meadow: ['Clinic approach'],
};

export function ringName(mission, i) {
  return (RING_NAMES[mission.id] || [])[i] || '';
}

function ringResult(sortie, i) {
  const entry = sortie.log.find((l) => l.text.startsWith(`Ring ${i + 1} `));
  return entry ? (entry.text.includes('missed') ? 'missed' : 'done') : null;
}

// Rows of { text, state } where state is done | missed | next | todo.
export function checklist(sortie) {
  const m = sortie.mission, rows = [];
  const field = landingField(m);
  if (m.start.type === 'runway') rows.push({ text: 'Take off', state: sortie.airborne ? 'done' : 'next' });
  sortie.rings.forEach((r, i) => {
    const res = ringResult(sortie, i);
    const state = res || (i === sortie.next && (sortie.airborne || m.start.type === 'air') ? 'next' : 'todo');
    rows.push({ text: `Ring ${i + 1} · ${ringName(m, i)}`, state });
  });
  if (field) {
    const ringsDone = sortie.next >= sortie.rings.length;
    rows.push({ text: `Land ${field.code} runway ${String(Math.round(field.heading / 10)).padStart(2, '0')}`, state: sortie.landing ? 'done' : ringsDone ? 'next' : 'todo' });
    rows.push({ text: 'Stop on the runway', state: sortie.status === 'complete' ? 'done' : sortie.landing ? 'next' : 'todo' });
  }
  return rows;
}
