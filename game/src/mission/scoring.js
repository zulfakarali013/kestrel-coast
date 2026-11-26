// Scores a finished sortie: rings, time against par, the landing and low flying, then the stars.

export function finish(s, status, reason) {
  s.status = status;
  s.reason = reason;
  if (status !== 'complete') { s.score = Math.round(s.passed * 60); s.stars = 0; return; }
  const ringPts = s.passed * 100 - s.missed * 40;
  const timePts = Math.max(0, Math.round((s.mission.par * 1.6 - s.time) * 2));
  const landPts = s.landing ? s.landing.total * 4 : 0;
  const lowPts = Math.round(s.lowBonus * 3);
  s.breakdown = { ringPts, timePts, landPts, lowPts };
  s.score = Math.max(0, ringPts + timePts + landPts + lowPts);
  const max = s.rings.length * 100 + s.mission.par * 1.2 + (s.landing ? 400 : 150);
  s.stars = s.score > max * 0.85 ? 3 : s.score > max * 0.55 ? 2 : 1;
}
