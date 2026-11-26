// The mission board: pick a sortie and see its goal, fuel, weather, best score and how the last try ended.
import { MISSIONS } from '../mission/missions.js';
import { loadBest, starText } from './best-scores.js';
import { loadLogbook } from './logbook-store.js';

export function showMenu(el, selected, onPick, onStart) {
  const best = loadBest();
  const book = loadLogbook();
  el.innerHTML = `
    <h1 class="title">KESTREL COAST</h1>
    <div class="tag">${MISSIONS.length} SORTIES · ONE ISLAND · A LITTLE HIGH-WING TOURER</div>
    <div class="cards">${MISSIONS.map((m) => `
      <button class="card ${m.id === selected ? 'sel' : ''}" data-id="${m.id}">
        <h3>${m.name}</h3>
        <div class="goal">${m.goal}</div>
        <div class="meta">${m.kind} · fuel ${Math.round(m.fuel * 100)}% · ${m.turbulence > 1 ? 'gusty' : m.turbulence > 0 ? 'light chop' : 'calm'}</div>
        <div class="best">${best[m.id] ? `Best ${best[m.id].score} ${starText(best[m.id].stars)}` : 'Not flown yet'}</div>
        ${book[m.id] && !book[m.id].last.ok ? `<div class="last">Last try: ✗ ${book[m.id].last.reason}</div>` : ''}
      </button>`).join('')}
    </div>
    <button class="go">FLY ▸</button>
    <div class="keys">
      <b>W/S</b> pitch · <b>A/D</b> roll · <b>Q/E</b> rudder · <b>Shift/Ctrl</b> or <b>wheel</b> throttle · <b>G/V</b> flaps · <b>Space</b> brakes<br>
      <b>Click</b> to fly with the mouse · <b>right-drag</b> to look around · <b>C</b> camera · <b>L</b> legend · <b>P</b> pause · <b>M</b> mute · <b>Esc</b> back to the board
    </div>`;
  el.hidden = false;
  el.querySelectorAll('.card').forEach((b) => b.addEventListener('click', () => onPick(b.dataset.id)));
  el.querySelector('.go').addEventListener('click', onStart);
}

export function hide(el) { el.hidden = true; }
