// Ends the flight with a crash and the plain-language reason for it.

export function crash(s, reason) {
  if (s.crashed) return;
  s.crashed = true;
  s.crashReason = reason;
  s.damage = 100;
  s.vel.multiplyScalar(0.05);
  s.events.push({ type: 'crash', reason });
}
