// The debrief after a sortie: what happened, the touchdown, the flight log, the score breakdown and stars.
import { describeTouchdown } from '../mission/landing-grade.js';
import { landingField } from '../mission/missions.js';
import { saveBest, starText } from './best-scores.js';
import { touchdownChart } from './touchdown-chart.js';

const clock = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export function showDebrief(el, sortie, flight, onRetry, onBoard) {
  const ok = sortie.status === 'complete';
  const b = sortie.breakdown || {};
  const rows = [
    ['Rings flown', `${sortie.passed} / ${sortie.rings.length}${sortie.missed ? ` (${sortie.missed} missed)` : ''}`],
    ['Time', `${clock(sortie.time)} (par ${clock(sortie.mission.par)})`],
    ['Fuel left', `${Math.round(flight.fuel)} L`],
    ['Airframe', `${Math.round(100 - flight.damage)}%`],
  ];
  if (sortie.landing) rows.push(['Touchdown', `${describeTouchdown(sortie.landing)} · ${sortie.landing.sinkFpm} ft/min · grade ${sortie.landing.total}/100`]);
  const score = ok ? `<table class="score">
      <tr><td>Rings</td><td>${b.ringPts}</td></tr><tr><td>Time against par</td><td>${b.timePts}</td></tr>
      <tr><td>Landing ×4</td><td>${b.landPts}</td></tr>${b.lowPts ? `<tr><td>Low flying</td><td>${b.lowPts}</td></tr>` : ''}
      <tr class="total"><td>Score</td><td>${sortie.score}</td></tr></table>` : '';
  if (ok) saveBest(sortie.mission.id, sortie.score, sortie.stars);
  const log = sortie.log.slice(-6).map((l) => `<li><span>${clock(l.t)}</span>${l.text}</li>`).join('');
  el.classList.add('side');
  el.innerHTML = `
    <div class="report">
      <h2 class="${ok ? 'ok' : 'bad'}">${ok ? 'SORTIE COMPLETE' : 'SORTIE FAILED'}</h2>
      <div class="why">${sortie.mission.name}: ${sortie.reason}</div>
      <table>${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
      ${touchdownChart(sortie.landing, landingField(sortie.mission))}
      ${log ? `<h4>FLIGHT LOG</h4><ul class="log">${log}</ul>` : ''}
      ${score}
      ${ok ? `<div class="stars">${starText(sortie.stars)}</div>` : ''}
      <div class="row"><button class="go retry">FLY AGAIN</button><button class="go board">MISSION BOARD</button></div>
    </div>`;
  el.hidden = false;
  el.querySelector('.retry').addEventListener('click', onRetry);
  el.querySelector('.board').addEventListener('click', onBoard);
}
