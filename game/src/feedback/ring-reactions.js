// Reactions to a ring pass: how close to the centre the aircraft went through, or how wide it missed.
import { react } from './reaction-feed.js';

// pass: { ok, d, radius, index } recorded by the sortie when a ring is passed or missed.
export function ringReaction(feed, pass, now) {
  if (!pass) return;
  const n = pass.index + 1;
  if (!pass.ok) return react(feed, 'ring', `RING ${n} MISSED · ${Math.round(pass.d - pass.radius)} M WIDE`, 'danger', 6, now);
  const share = pass.d / pass.radius;
  if (share < 0.25) react(feed, 'ring', `DEAD CENTRE · RING ${n}`, 'good', 6, now);
  else if (share < 0.7) react(feed, 'ring', `CLEAN RING ${n}`, 'good', 6, now);
  else react(feed, 'ring', `EDGE OF RING ${n} · ${Math.round(pass.radius - pass.d)} M SPARE`, 'caution', 6, now);
}
