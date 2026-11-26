// Logbook pose state: a pilot part-way through the island — some sorties won, two crashes on record, three still to fly.
import { saveLogbook } from '../ui/logbook-store.js';
import { BEST_KEY } from '../ui/best-scores.js';

const HISTORY = {
  circuit: { flights: 2, bestScore: 846, bestStars: 3, last: { ok: true, reason: 'Stopped on KESTREL FIELD runway', time: 252 } },
  ferry: { flights: 1, bestScore: 0, bestStars: 0, last: { ok: false, reason: 'Ditched in the sea at 61 kt', time: 196 } },
  ridge: { flights: 3, bestScore: 0, bestStars: 0, last: { ok: false, reason: 'Hit the hillside at 92 kt', time: 118 } },
  meadow: { flights: 2, bestScore: 731, bestStars: 2, last: { ok: true, reason: 'Stopped on HIGH MEADOW runway', time: 184 } },
  deadstick: { flights: 1, bestScore: 655, bestStars: 2, last: { ok: true, reason: 'Stopped on KESTREL FIELD runway', time: 114 } },
};

export function seedLogbook() {
  saveLogbook(JSON.parse(JSON.stringify(HISTORY)));
  const best = {};
  for (const [id, e] of Object.entries(HISTORY)) if (e.bestStars) best[id] = { score: e.bestScore, stars: e.bestStars };
  try { localStorage.setItem(BEST_KEY, JSON.stringify(best)); } catch { /* private mode */ }
}
