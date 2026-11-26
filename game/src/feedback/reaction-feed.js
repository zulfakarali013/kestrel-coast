// The reaction feed: short badges that say what just happened ("CLEAN RING", "GUST +8 KT"), each fading after a few seconds.

const COOLDOWN = 4; // seconds before the same kind of reaction may fire again

export function createFeed() {
  return { items: [], last: {} };
}

// level: 'good', 'info', 'caution' or 'danger'. key groups reactions of one kind for the cooldown.
export function react(feed, key, text, level = 'info', secs = 6, now = 0) {
  if (feed.last[key] !== undefined && now - feed.last[key] < COOLDOWN) return;
  feed.last[key] = now;
  feed.items = feed.items.filter((it) => it.key !== key);
  feed.items.unshift({ key, text, level, t: secs, life: secs });
  feed.items.length = Math.min(feed.items.length, 6);
}

export function tickFeed(feed, dt) {
  feed.items = feed.items.filter((it) => (it.t -= dt) > 0);
}

// The newest reactions first, at most n of them.
export function liveReactions(feed, n = 4) {
  return feed.items.slice(0, n);
}
