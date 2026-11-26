// Fuel for one physics step: burn with throttle, leak once the airframe is damaged; a dry tank starves the engine.
import { AIRCRAFT as A } from '../core/config.js';

// Burns this step's fuel and returns the share of throttle the engine can actually deliver.
export function burnFuel(s, c, dt) {
  const burn = (A.burnIdle + (A.burnFull - A.burnIdle) * c.throttle) * dt + (s.damage > 40 ? s.damage * 0.0009 * dt : 0);
  s.fuel = Math.max(0, s.fuel - burn);
  return s.fuel > 0 ? c.throttle : 0;
}
