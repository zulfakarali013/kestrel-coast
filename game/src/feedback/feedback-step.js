// Feedback for one game step: feeds every watcher (rings, landing, bounce, flight) into the reaction feed.
import { tickFeed } from './reaction-feed.js';
import { ringReaction } from './ring-reactions.js';
import { landingReaction, watchBounce } from './touchdown-reactions.js';
import { watchFlight } from './flight-reactions.js';

// feed: the reaction feed; s: the sortie; target and field: what the pilot is flying to now.
export function feedbackStep(feed, flight, s, target, field, dt, now) {
  const memo = feed.memo || (feed.memo = {});
  if (s.lastPass && s.lastPass !== memo.pass) { ringReaction(feed, s.lastPass, now); memo.pass = s.lastPass; }
  if (s.landing && s.landing !== memo.landing) { landingReaction(feed, s.landing, now); memo.landing = s.landing; }
  watchBounce(feed, flight, memo, now);
  watchFlight(feed, flight, target, field, memo, now);
  tickFeed(feed, dt);
}
