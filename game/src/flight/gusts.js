// Turbulence: the gust vector blowing through the airframe at a moment, and its size in knots for the HUD.
import * as THREE from 'three';
import { MS_TO_KT } from '../core/config.js';

// Returns the gust (m/s) at this time, or null in smooth air. Also records s.gustKt for the pilot's feedback.
export function gustAt(s, time) {
  if (!(s.turbulence > 0)) { s.gustKt = 0; return null; }
  const gust = new THREE.Vector3(Math.sin(time * 1.7) * 0.6 + Math.sin(time * 4.3), Math.sin(time * 2.9) * 1.2 + Math.sin(time * 6.1) * 0.5, Math.cos(time * 2.1)).multiplyScalar(s.turbulence);
  s.gustKt = gust.length() * MS_TO_KT;
  return gust;
}
