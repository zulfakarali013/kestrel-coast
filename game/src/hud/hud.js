// The heads-up display drawn on a 2D canvas over the 3D view: lays out every HUD part for one frame.
import { AIRCRAFT, MS_TO_KT, M_TO_FT } from '../core/config.js';
import { headingOf, attitudeOf } from '../flight/state.js';
import { landingField } from '../mission/missions.js';
import { GREEN, AMBER, RED, glowText } from './style.js';
import { tape, headingTape } from './tapes.js';
import { pitchLadder } from './pitch-ladder.js';
import { bar } from './gauges.js';
import { minimap } from './minimap.js';
import { arrowTo } from './target-arrow.js';
import { cockpitPanel } from './cockpit-panel.js';
import { sortiePanel } from './sortie-panel.js';
import { aircraftPanel } from './aircraft-panel.js';
import { controlsBar } from './controls-bar.js';
import { approachGuide } from './approach-guide.js';
import { systemBars } from './system-bars.js';
import { tapeReadouts } from './tape-readouts.js';
import { drawWarnings } from './warnings.js';
import { drawCallouts } from './callouts.js';
import { pilotCard } from './pilot-card.js';
import { legendPanel } from './legend-panel.js';
import { worldTags } from './world-tags.js';
import { hudKeepOut } from './hud-keep-out.js';

export { flash } from './callouts.js';
export { paintCoast } from './minimap.js';

export function createHud(canvas) {
  return { canvas, g: canvas.getContext('2d'), w: 0, h: 0, dpr: 1, messages: [] };
}

export function resizeHud(hud) {
  hud.dpr = Math.min(2, devicePixelRatio || 1);
  hud.w = innerWidth;
  hud.h = innerHeight;
  hud.canvas.width = hud.w * hud.dpr;
  hud.canvas.height = hud.h * hud.dpr;
}

export function drawHud(hud, flight, sortie, view, dt, extra) {
  const { g, w, h, dpr } = hud;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  if (!flight) return;
  const cockpit = view === 'cockpit';
  const cx = w / 2, cy = h * (cockpit ? 0.4 : 0.45);
  const { pitch, bank } = attitudeOf(flight);
  const hdg = headingOf(flight);
  const kt = flight.airspeed * MS_TO_KT, ft = flight.pos.y * M_TO_FT;
  const fpa = flight.vel.length() > 3 ? Math.asin(flight.vel.y / flight.vel.length()) : pitch;

  if (cockpit) cockpitPanel(g, w, h, flight);
  if (extra.tags) worldTags(g, extra.tags, hudKeepOut(w, h, cx, cy, cockpit, sortie && extra.legend), w, h);
  pitchLadder(g, cx, cy, pitch, bank, pitch - fpa);
  const slow = kt < AIRCRAFT.stallSpeed * MS_TO_KT * 1.1;
  tape(g, cx - 330, cy, 300, kt, 5, 20, 'KT', -1, slow ? RED : GREEN);
  tape(g, cx + 256, cy, 300, ft, 20, 100, 'FT', 1, GREEN);
  headingTape(g, cx, 40, hdg);
  tapeReadouts(g, cx, cy, flight);

  if (!cockpit) {
    systemBars(g, 26, h - 168, flight);
    minimap(g, w - 196, h - 214, 176, flight, sortie, extra.coast);
    controlsBar(g, cx, h - 44, view);
  }

  if (sortie) {
    const sh = sortiePanel(g, 20, 20, sortie, extra.objective);
    if (extra.pilot) pilotCard(g, 20, 30 + sh, extra.pilot, extra.reactions || []);
    if (!cockpit && extra.legend) legendPanel(g, w - 280, 206);
    aircraftPanel(g, w - 280, 20, flight, extra.target);
    const field = landingField(sortie.mission);
    if (sortie.next >= sortie.rings.length || sortie.next === sortie.rings.length - 1) cockpit ? approachGuide(g, w - 150, 216, flight, field) : approachGuide(g, cx, h - 140, flight, field);
    if (extra.target) {
      const dx = extra.target.x - flight.pos.x, dz = extra.target.z - flight.pos.z;
      const brg = (Math.atan2(dx, -dz) * 57.3 + 360) % 360, dist = Math.hypot(dx, dz);
      arrowTo(g, cx, cy - 120, (brg - hdg) / 57.3, dist > 1000 ? `${(dist / 1852).toFixed(1)} NM` : `${Math.round(dist)} M`, extra.target.label);
    }
  }
  drawWarnings(g, cx, cy + 150, flight);
  drawCallouts(hud, g, cx, 112, dt);
}
