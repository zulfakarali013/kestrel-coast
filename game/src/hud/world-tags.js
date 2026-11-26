// World tags in the HUD: a small labelled pill with a pointer line above each named place the camera can see.
import { AMBER, PAPER, glowText } from './style.js';

export function worldTags(g, tags) {
  for (const t of tags) {
    const col = t.kind === 'ring' ? AMBER : PAPER;
    g.font = 'bold 11px "Trebuchet MS", sans-serif';
    const tw = g.measureText(t.text).width + 14, top = t.y - 34;
    g.strokeStyle = col; g.globalAlpha = 0.7; g.lineWidth = 1;
    g.beginPath(); g.moveTo(t.x, top + 16); g.lineTo(t.x, t.y); g.stroke();
    g.globalAlpha = 1;
    g.fillStyle = 'rgba(8,14,20,0.72)';
    g.beginPath(); g.roundRect(t.x - tw / 2, top, tw, 16, 4); g.fill();
    g.strokeStyle = col; g.stroke();
    glowText(g, t.text, t.x, top + 8.5, col, 11);
  }
}
