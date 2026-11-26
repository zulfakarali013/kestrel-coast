// Reactions to the flying itself: near stall, gusts, crosswind on final, a fuel verdict turning tight, and capturing the slope.
import { AIRCRAFT } from '../core/config.js';
import { react } from './reaction-feed.js';
import { reachVerdict } from '../flight/fuel-range.js';
import { windComponents } from '../flight/wind-components.js';
import { approachSlope } from '../mission/approach-slope.js';

// memo keeps what was true last step, so a reaction fires when a condition starts, not every frame.
export function watchFlight(feed, flight, target, field, memo, now) {
  if (flight.onGround || flight.crashed) return;
  const nearStall = !flight.stalled && flight.aoa > AIRCRAFT.stallAoa * 0.8;
  if (nearStall && !memo.nearStall) react(feed, 'stall', 'NEAR STALL · NOSE DOWN', 'danger', 4, now);
  memo.nearStall = nearStall;

  if (flight.gustKt >= 6) react(feed, 'gust', `GUST +${Math.round(flight.gustKt)} KT`, 'caution', 4, now);

  if (target && flight.fuel <= 0 && !memo.deadStick) { react(feed, 'fuel', 'ENGINE OUT · GLIDE 62 KT', 'danger', 8, now); memo.deadStick = true; }
  if (target && flight.fuel > 0) {
    const v = reachVerdict(flight, target.x, target.z).verdict;
    if (v !== memo.verdict && v !== 'MAKES IT') react(feed, 'fuel', `FUEL ${v} FOR ${target.label}`, v === 'TIGHT' ? 'caution' : 'danger', 8, now);
    memo.verdict = v;
  }

  const a = approachSlope(flight, field);
  const onSlope = !!a && a.word === 'ON SLOPE' && a.toTouch < 2500;
  if (onSlope && !memo.onSlope) react(feed, 'slope', `ON SLOPE · ${a.angle.toFixed(1)}°`, 'good', 6, now);
  memo.onSlope = onSlope;
  const wc = a ? windComponents(flight) : null;
  if (wc && Math.abs(wc.cross) > 8) react(feed, 'cross', `CROSSWIND ${Math.round(Math.abs(wc.cross))} KT ${wc.cross > 0 ? 'FROM RIGHT' : 'FROM LEFT'}`, 'caution', 6, now);
}
