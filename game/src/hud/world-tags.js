// World tags in the HUD: a small labelled pill with a pointer line above each named place the camera can see, kept clear of the HUD.
import { AMBER, PAPER, glowText } from './style.js';
import { placeTags } from './tag-placement.js';

export function worldTags(g, all, keepOut, w, h) {
  const tags = all.filter((t) => t.kind === 'ring').concat(all.filter((t) => t.kind !== 'ring'));
  g.font = 'bold 11px "Trebuchet MS", sans-serif';
  const widths = tags.map((t) => g.measureText(t.text).width + 14);
  for (const p of placeTags(tags, widths, keepOut, w, h)) {
    const t = p.tag, col = t.kind === 'ring' ? AMBER : PAPER;
    g.strokeStyle = col; g.globalAlpha = 0.7; g.lineWidth = 1;
    g.beginPath(); g.moveTo(p.px, p.top + 16); g.lineTo(t.x, t.y); g.stroke();
    g.globalAlpha = 1;
    g.fillStyle = 'rgba(8,14,20,0.72)';
    g.beginPath(); g.roundRect(p.px - p.tw / 2, p.top, p.tw, 16, 4); g.fill();
    g.strokeStyle = col; g.stroke();
    glowText(g, t.text, p.px, p.top + 8.5, col, 11);
  }
}
