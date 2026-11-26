// Airframe condition in words: what a damage figure means to the pilot (clean, dented, bent gear, fuel leak).

// Returns [text, level] where level is 'ok', 'caution' or 'danger'.
export function airframeNote(d) {
  if (d <= 0) return ['AIRFRAME 100% · CLEAN', 'ok'];
  if (d < 20) return [`AIRFRAME ${Math.round(100 - d)}% · DENTED`, 'ok'];
  if (d < 40) return [`AIRFRAME ${Math.round(100 - d)}% · BENT GEAR`, 'caution'];
  return [`AIRFRAME ${Math.round(100 - d)}% · FUEL LEAK`, 'danger'];
}
