// Sortie 2, Lighthouse Mail: a short-fuel ferry from Kestrel Field past the harbour light to Gull Island.
import { ringOverGround } from '../ring-placement.js';

export const LIGHTHOUSE_MAIL = {
  id: 'ferry', name: 'Lighthouse Mail', kind: 'Ferry',
  goal: 'Carry the mail sack from Kestrel Field to Gull Island and land there. Fuel is short.',
  brief: 'The tanker missed the boat. You have a third of a tank: lean the throttle and fly the line.',
  start: { type: 'runway', field: 'kestrel' }, fuel: 0.3, wind: [4, -2], turbulence: 0.6,
  rings: () => [ringOverGround(1300, 1800, 220, 85, 40), ringOverGround(2500, 1950, 180, 95, 40)],
  ringNames: ['Harbour light', 'Gull Sound'],
  land: 'gull', par: 240, timeLimit: 720,
};
