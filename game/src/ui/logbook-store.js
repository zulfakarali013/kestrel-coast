// The pilot's logbook, kept in the browser: how often each sortie was flown and how the last flight ended.

export const LOGBOOK_KEY = 'kestrel-coast-logbook';

export function loadLogbook() {
  try { return JSON.parse(localStorage.getItem(LOGBOOK_KEY) || '{}'); } catch { return {}; }
}

export function saveLogbook(book) {
  try { localStorage.setItem(LOGBOOK_KEY, JSON.stringify(book)); } catch { /* private mode: keep going */ }
  return book;
}

// One finished flight: completed or failed, why, when, and the score and stars if it was completed.
export function recordFlight(id, { ok, reason, time, score = 0, stars = 0 }) {
  const book = loadLogbook();
  const e = book[id] || { flights: 0, bestScore: 0, bestStars: 0 };
  e.flights += 1;
  e.last = { ok, reason, time: Math.round(time) };
  if (ok && score > e.bestScore) { e.bestScore = score; e.bestStars = stars; }
  book[id] = e;
  return saveLogbook(book);
}
