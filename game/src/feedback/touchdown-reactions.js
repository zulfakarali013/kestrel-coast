// Reactions to the landing: the touchdown in one word (GREASED IT, SMOOTH, FIRM, HARD) and a bounce back into the air.
import { react } from './reaction-feed.js';

export function touchdownWord(sinkFpm) {
  if (sinkFpm < 200) return ['GREASED IT', 'good'];
  if (sinkFpm < 400) return ['SMOOTH', 'good'];
  if (sinkFpm < 630) return ['FIRM', 'caution'];
  return ['HARD', 'danger'];
}

export function landingReaction(feed, landing, now) {
  const [word, level] = touchdownWord(landing.sinkFpm);
  react(feed, 'touchdown', `${word} · ${landing.sinkFpm} FT/MIN`, level, 8, now);
}

// Call every step: a lift-off within two seconds of touching down is a bounce.
export function watchBounce(feed, flight, memo, now) {
  if (flight.onGround && !memo.wasOnGround) memo.touchedAt = now;
  if (!flight.onGround && memo.wasOnGround && now - (memo.touchedAt ?? -99) < 2) react(feed, 'bounce', 'BOUNCE · HOLD THE FLARE', 'caution', 5, now);
  memo.wasOnGround = flight.onGround;
}
