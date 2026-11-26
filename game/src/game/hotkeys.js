// One-shot keys: camera, pause, mute, legend, flap notches, back to the board, start.
import { game } from './game-state.js';
import { takePressed } from '../input/keyboard.js';
import { nextView } from '../view/camera-rig.js';
import { startAudio } from '../audio/engine-sound.js';
import { startSortie, openBoard } from './session.js';

export function handleHotkeys() {
  for (const code of takePressed()) {
    startAudio(game.audio);
    if (code === 'KeyC') nextView(game.rig);
    if (code === 'KeyP' && game.state === 'flying') game.paused = !game.paused;
    if (code === 'KeyL') game.legend = !game.legend;
    if (code === 'KeyM') game.audio.muted = !game.audio.muted;
    if (code === 'KeyG') game.flapStep = Math.min(2, game.flapStep + 1);
    if (code === 'KeyV') game.flapStep = Math.max(0, game.flapStep - 1);
    if (code === 'Escape' && game.state === 'flying') openBoard();
    if ((code === 'Enter' || code === 'Space') && game.state === 'menu') startSortie(game.missionId);
  }
}
