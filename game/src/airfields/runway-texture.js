// Paints the runway surface: centreline, threshold bars and the runway numbers.
import * as THREE from 'three';

export function paintRunway(field) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#3b3d40';
  g.fillRect(0, 0, 128, 1024);
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},0.05)`;
    g.fillRect(Math.random() * 128, Math.random() * 1024, 2, 2);
  }
  g.fillStyle = '#f2f2ee';
  g.fillRect(4, 0, 4, 1024);
  g.fillRect(120, 0, 4, 1024);
  for (let y = 140; y < 884; y += 52) g.fillRect(62, y, 4, 28);
  for (const end of [0, 1]) {
    const y0 = end ? 1024 - 60 : 12;
    for (let i = 0; i < 8; i++) g.fillRect(14 + i * 13 + (i > 3 ? 8 : 0), y0, 7, 46);
  }
  g.font = 'bold 34px sans-serif';
  g.textAlign = 'center';
  const num = Math.round(field.heading / 10) % 36 || 36;
  const opp = ((num + 17) % 36) + 1;
  g.save(); g.translate(64, 1024 - 82); g.fillText(String(num).padStart(2, '0'), 0, 0); g.restore();
  g.save(); g.translate(64, 82); g.rotate(Math.PI); g.fillText(String(opp).padStart(2, '0'), 0, 0); g.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
