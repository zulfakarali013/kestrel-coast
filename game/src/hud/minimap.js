// The north-up minimap: coastline, airfields, rings and the aircraft.
import { WORLD } from '../core/config.js';
import { AIRFIELDS } from '../airfields/fields.js';
import { headingOf } from '../flight/state.js';
import { GREEN, AMBER, glowText, box } from './style.js';

// A small north-up map: the coast outline, airfields, rings and you.
export function minimap(g, x, y, size, flight, sortie, coast) {
  box(g, x, y, size, size);
  g.save(); g.beginPath(); g.rect(x, y, size, size); g.clip();
  const sc = size / (WORLD.size * 0.85);
  const mx = (wx) => x + size / 2 + wx * sc, my = (wz) => y + size / 2 + wz * sc;
  if (coast) g.drawImage(coast, x, y, size, size);
  for (const f of AIRFIELDS) {
    g.strokeStyle = '#ffffff'; g.lineWidth = 3;
    const h = f.heading / 57.3, l = f.length * sc * 0.5 + 3;
    g.beginPath(); g.moveTo(mx(f.x) - Math.sin(h) * l, my(f.z) + Math.cos(h) * l); g.lineTo(mx(f.x) + Math.sin(h) * l, my(f.z) - Math.cos(h) * l); g.stroke();
    glowText(g, f.code, mx(f.x), my(f.z) - 10, '#e8f4ff', 10);
  }
  if (sortie) sortie.rings.forEach((r, i) => {
    g.strokeStyle = i === sortie.next ? AMBER : i < sortie.next ? 'rgba(157,255,176,0.4)' : 'rgba(255,233,168,0.7)';
    g.lineWidth = 2; g.beginPath(); g.arc(mx(r.x), my(r.z), i === sortie.next ? 5 : 3, 0, 7); g.stroke();
  });
  const hdg = headingOf(flight) / 57.3;
  g.save(); g.translate(mx(flight.pos.x), my(flight.pos.z)); g.rotate(hdg);
  g.fillStyle = AMBER; g.beginPath(); g.moveTo(0, -8); g.lineTo(6, 6); g.lineTo(0, 3); g.lineTo(-6, 6); g.fill();
  g.restore(); g.restore();
  glowText(g, 'N', x + size / 2, y + 10, GREEN, 11);
}

// Paint the coastline once into a small image for the minimap.
export function paintCoast(heightAt) {
  const c = document.createElement('canvas');
  c.width = c.height = 176;
  const g = c.getContext('2d');
  const img = g.createImageData(176, 176);
  const span = WORLD.size * 0.85;
  for (let j = 0; j < 176; j++) for (let i = 0; i < 176; i++) {
    const h = heightAt((i / 176 - 0.5) * span, (j / 176 - 0.5) * span);
    const k = (j * 176 + i) * 4;
    if (h < 0) { img.data[k] = 20; img.data[k + 1] = 60; img.data[k + 2] = 80; img.data[k + 3] = 150; }
    else { const v = Math.min(1, h / 700); img.data[k] = 70 + v * 120; img.data[k + 1] = 110 + v * 80; img.data[k + 2] = 60 + v * 110; img.data[k + 3] = 200; }
  }
  g.putImageData(img, 0, 0);
  return c;
}
