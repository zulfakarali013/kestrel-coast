// The sortie list in board order, and lookups by id and for the field a sortie ends at. Each sortie lives in mission/sorties/.
import { AIRFIELDS } from '../airfields/fields.js';
import { FIRST_LIGHT } from './sorties/first-light.js';
import { LIGHTHOUSE_MAIL } from './sorties/lighthouse-mail.js';
import { RIDGE_RUN } from './sorties/ridge-run.js';
import { HIGH_MEADOW_SUPPLY } from './sorties/high-meadow-supply.js';
import { DEAD_STICK } from './sorties/dead-stick.js';
import { COAST_TOUR } from './sorties/coast-tour.js';
import { GULL_RETURN } from './sorties/gull-return.js';
import { MEADOW_CLIMB } from './sorties/meadow-climb.js';

export { ringOverGround } from './ring-placement.js';

export const MISSIONS = [FIRST_LIGHT, LIGHTHOUSE_MAIL, RIDGE_RUN, HIGH_MEADOW_SUPPLY, DEAD_STICK, COAST_TOUR, GULL_RETURN, MEADOW_CLIMB];

export function missionById(id) {
  return MISSIONS.find((m) => m.id === id) ?? MISSIONS[0];
}

export function landingField(mission) {
  return mission.land ? AIRFIELDS.find((f) => f.id === mission.land) : null;
}
