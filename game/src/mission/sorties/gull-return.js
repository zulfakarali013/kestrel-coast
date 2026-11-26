// Sortie 7, Gull Return: from Gull Island back to Kestrel Field, landing runway 07 with a tailwind pushing you long.
import { ringOverGround } from '../ring-placement.js';

export const GULL_RETURN = {
  id: 'gullreturn', name: 'Gull Return', kind: 'Tailwind',
  goal: 'Take off from Gull Island, pass the harbour gate and land on Kestrel 07 with a tailwind.',
  brief: 'The wind has swung behind the runway. Come in slow, touch down early and brake hard.',
  start: { type: 'runway', field: 'gull' }, fuel: 0.6, wind: [3, 1], turbulence: 0.7,
  rings: () => [ringOverGround(2400, 2100, 200, 265, 40), ringOverGround(900, 2050, 160, 290, 40)],
  ringNames: ['Gull Sound', 'Harbour gate'],
  land: 'kestrel', par: 240, timeLimit: 720,
};
