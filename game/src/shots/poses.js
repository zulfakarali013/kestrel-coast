// Screenshot poses: ?shot=board|cover|cockpit|ridge|landing puts the game in a fixed moment so the maker's
// screenshots are real renders of this code, the same every time. Each pose lives in its own file.
import { coverPose } from './pose-cover.js';
import { cockpitPose } from './pose-cockpit.js';
import { ridgePose } from './pose-ridge.js';
import { landingPose } from './pose-landing.js';

const POSES = { cover: coverPose, cockpit: cockpitPose, ridge: ridgePose, landing: landingPose };

export function setupShot(name, ctx) {
  const { game, startSortie, openBoard, frame } = ctx;
  let t = performance.now();
  const run = (n, step) => { for (let i = 0; i < n; i++) { if (step) step(i); t += 1000 / 60; frame(t); } };
  game.audio.muted = true;

  if (name === 'board') {
    openBoard();
    game.time = 52;
    run(3);
  } else if (POSES[name]) POSES[name](game, startSortie, run);
  window.__shotReady = true;
}
