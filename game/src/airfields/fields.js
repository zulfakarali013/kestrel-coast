// The three airfields as data: where they are, which way the runway points, how long it is.

export const AIRFIELDS = [
  { id: 'kestrel', name: 'KESTREL FIELD', code: 'KST', x: -700, z: 1450, heading: 72, length: 950, width: 30, elev: 22 },
  { id: 'gull', name: 'GULL ISLAND', code: 'GUL', x: 3350, z: 1850, heading: 18, length: 620, width: 22, elev: 9 },
  { id: 'meadow', name: 'HIGH MEADOW', code: 'HMW', x: -1100, z: -1750, heading: 140, length: 700, width: 25, elev: 410 },
];

export function airfieldById(id) {
  return AIRFIELDS.find((a) => a.id === id);
}

export function nearestAirfield(x, z) {
  let best = null, bestD = Infinity;
  for (const f of AIRFIELDS) {
    const d = Math.hypot(x - f.x, z - f.z);
    if (d < bestD) { bestD = d; best = f; }
  }
  return { field: best, distance: bestD };
}
