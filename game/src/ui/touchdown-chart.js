// A small drawing of the runway seen from above, with the touchdown zone and where the wheels met it.
export function touchdownChart(landing, field) {
  if (!landing || !field) return '';
  const W = 300, H = 64, len = field.length, sx = (W - 20) / len;
  const x = 10 + Math.max(0, Math.min(len, landing.fromThreshold)) * sx;
  const y = H / 2 + Math.max(-1, Math.min(1, landing.across / (field.width / 2))) * 14;
  const zone = len * 0.35 * sx;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Touchdown point on the runway">
    <rect x="10" y="${H / 2 - 16}" width="${W - 20}" height="32" rx="2" fill="#3a3f45" stroke="#9aa3ab"/>
    <rect x="10" y="${H / 2 - 16}" width="${zone}" height="32" fill="rgba(157,255,176,0.18)"/>
    <line x1="14" x2="${W - 14}" y1="${H / 2}" y2="${H / 2}" stroke="#f4f1ea" stroke-dasharray="10 8"/>
    <text x="12" y="${H - 2}" fill="#8fb3cc" font-size="10">RWY ${String(Math.round(field.heading / 10)).padStart(2, '0')}</text>
    <text x="12" y="10" fill="#9fe39a" font-size="10">TOUCHDOWN ZONE ▸</text>
    <circle cx="${x}" cy="${y}" r="6" fill="#ffc45a" stroke="#2a1606" stroke-width="2"/>
    <text x="${x + 10}" y="${H - 2}" fill="#ffd98a" font-size="11" text-anchor="start">${landing.fromThreshold} m in · ${Math.abs(landing.across).toFixed(1)} m ${landing.across > 0 ? 'right' : 'left'}</text>
  </svg>`;
}
