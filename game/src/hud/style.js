// The HUD's look: its colours, glowing text and outlined boxes.

export const GREEN = '#9dffb0', AMBER = '#ffc45a', RED = '#ff5a48', INK = 'rgba(6,16,12,0.55)';

export function glowText(g, text, x, y, colour, size, align = 'center') {
  g.font = `bold ${size}px "Trebuchet MS", sans-serif`;
  g.textAlign = align;
  g.textBaseline = 'middle';
  g.shadowColor = colour;
  g.shadowBlur = 8;
  g.fillStyle = colour;
  g.fillText(text, x, y);
  g.shadowBlur = 0;
}

export function box(g, x, y, w, h, colour = GREEN) {
  g.fillStyle = INK;
  g.fillRect(x, y, w, h);
  g.strokeStyle = colour;
  g.lineWidth = 1.5;
  g.strokeRect(x, y, w, h);
}

export const MUTED = 'rgba(232,244,255,0.55)', PAPER = '#e8f4ff';

// A titled panel: dark glass with an amber title strip, the frame every HUD card shares.
export function panel(g, x, y, w, h, title, colour = AMBER) {
  g.save();
  g.fillStyle = 'rgba(8,14,20,0.62)';
  g.beginPath(); g.roundRect(x, y, w, h, 8); g.fill();
  g.strokeStyle = colour; g.globalAlpha = 0.85; g.lineWidth = 1.5; g.stroke();
  g.globalAlpha = 1;
  g.fillStyle = colour; g.globalAlpha = 0.18;
  g.beginPath(); g.roundRect(x, y, w, 24, [8, 8, 0, 0]); g.fill();
  g.restore();
  glowText(g, title, x + 10, y + 12, colour, 13, 'left');
}

// One "label ........ value" row inside a panel.
export function row(g, x, y, w, label, value, colour = GREEN) {
  glowText(g, label, x, y, MUTED, 12, 'left');
  glowText(g, value, x + w, y, colour, 13, 'right');
}
