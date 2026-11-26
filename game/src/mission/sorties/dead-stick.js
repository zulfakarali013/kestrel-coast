// Sortie 5, Dead Stick: the engine has quit high over the island — glide to Kestrel Field and land without power.
import { airfieldById } from '../../airfields/fields.js';
import { fromRunway } from '../../airfields/runway-frame.js';
import { ringOverGround } from '../ring-placement.js';

const K = airfieldById('kestrel'), S = fromRunway(K, -3900, 350);

export const DEAD_STICK = {
  id: 'deadstick', name: 'Dead Stick', kind: 'Engine out',
  goal: 'The engine is dead at 1,600 ft. Hold the best glide, make the key gate and land on Kestrel 07.',
  brief: 'Silence up front. Nose down to 60 kt, turn for Kestrel and do not stretch the glide.',
  start: { type: 'air', x: S.x, y: K.elev + 470, z: S.z, heading: K.heading - 4, speed: 33 }, fuel: 0, wind: [0, 0], turbulence: 0.3,
  rings: () => { const f = airfieldById('kestrel'); const p = fromRunway(f, -1250, 0); return [ringOverGround(p.x, p.z, 130, f.heading, 40)]; },
  ringNames: ['Key gate'],
  land: 'kestrel', par: 150, timeLimit: 400,
};
