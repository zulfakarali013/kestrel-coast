// The four bars bottom-left: throttle, fuel, flaps and hull, each turning amber then red as it matters.
import { AIRCRAFT } from '../core/config.js';
import { GREEN, AMBER, RED } from './style.js';
import { bar } from './gauges.js';

export function systemBars(g, x, y, flight) {
  bar(g, x, y, 30, 100, flight.throttle, 'THR', `${Math.round(flight.throttle * 100)}%`, GREEN);
  bar(g, x + 44, y, 30, 100, flight.fuel / AIRCRAFT.fuelMax, 'FUEL', `${Math.round(flight.fuel)}L`, flight.fuel < 15 ? RED : flight.fuel < 30 ? AMBER : GREEN);
  bar(g, x + 88, y, 30, 100, flight.flaps, 'FLAP', `${Math.round(flight.flaps * 30)}°`, GREEN);
  bar(g, x + 132, y, 30, 100, 1 - flight.damage / 100, 'HULL', `${Math.round(100 - flight.damage)}%`, flight.damage > 50 ? RED : flight.damage > 20 ? AMBER : GREEN);
}
