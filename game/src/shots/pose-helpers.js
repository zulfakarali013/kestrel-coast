// Helpers every screenshot pose shares: write the rings already flown into a sortie, and point the aircraft.
import * as THREE from 'three';

// Write the rings already flown into the sortie log, as if the pilot had flown them.
// The last one flown is recorded as a pass 40% of the radius from the centre, so the pilot card can react to it.
export function flown(s, n, missed = []) {
  s.airborne = true;
  for (let i = 0; i < n; i++) s.log.push({ t: (s.time * i) / n, text: `Ring ${i + 1} ${missed.includes(i) ? 'missed' : 'clean'}` });
  s.missed = missed.length; s.passed = n - missed.length; s.next = n;
  if (n > 0) { const r = s.rings[n - 1]; s.lastPass = { ok: !missed.includes(n - 1), d: r.radius * 0.4, radius: r.radius, index: n - 1 }; }
}

// Pitch and bank the aircraft from its current attitude, keeping its speed along the new nose direction.
export function aim(flight, pitchDeg, bankDeg) {
  flight.quat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(pitchDeg), 0, THREE.MathUtils.degToRad(-bankDeg), 'XYZ')));
  const speed = flight.vel.length();
  flight.vel.set(0, 0, -1).applyQuaternion(flight.quat).multiplyScalar(speed);
}
