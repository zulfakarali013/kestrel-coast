// The K-2's windscreen seen from the left seat: roof bow, two corner pillars and the glareshield lip.
export function windscreenFrame(g, w, h, top) {
  g.fillStyle = '#2f2a25';
  g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, 14); g.quadraticCurveTo(w / 2, 30, 0, 14); g.fill();
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? 0 : w;
    g.beginPath();
    g.moveTo(x0, 0); g.lineTo(x0 + side * -70, 0); g.lineTo(x0 + side * -26, top + 30); g.lineTo(x0, top + 30);
    g.fill();
  }
  const lip = g.createLinearGradient(0, top - 26, 0, top + 6);
  lip.addColorStop(0, 'rgba(20,18,16,0)'); lip.addColorStop(1, 'rgba(20,18,16,0.85)');
  g.fillStyle = lip; g.fillRect(0, top - 26, w, 32);
}
