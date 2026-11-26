// Best score and stars per sortie, kept in the browser.

export const BEST_KEY = 'kestrel-coast-best';

export function loadBest() {
  try { return JSON.parse(localStorage.getItem(BEST_KEY) || '{}'); } catch { return {}; }
}

export function saveBest(id, score, stars) {
  const best = loadBest();
  if (!best[id] || score > best[id].score) best[id] = { score, stars };
  try { localStorage.setItem(BEST_KEY, JSON.stringify(best)); } catch { /* private mode: keep going */ }
  return best;
}

export function starText(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
