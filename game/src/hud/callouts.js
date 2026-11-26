// Big centre-screen callouts ("RING 3 ✓", "GREASER") that fade after a few seconds.
import { AMBER, glowText } from './style.js';

export function flash(hud, text, colour = AMBER, secs = 2.5) {
  hud.messages.push({ text, colour, t: secs });
}

export function drawCallouts(hud, g, cx, y, dt) {
  hud.messages = hud.messages.filter((m) => (m.t -= dt) > 0);
  hud.messages.forEach((m, i) => {
    g.font = 'bold 24px "Trebuchet MS", sans-serif';
    const w = g.measureText(m.text).width + 36, yy = y + i * 40;
    g.fillStyle = 'rgba(8,14,20,0.6)';
    g.beginPath(); g.roundRect(cx - w / 2, yy - 18, w, 36, 18); g.fill();
    glowText(g, m.text, cx, yy, m.colour, 24);
  });
}
