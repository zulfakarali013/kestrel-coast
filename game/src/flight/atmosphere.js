// Air density falling off with altitude.

export function airDensity(alt) {
  return 1.225 * Math.exp(-Math.max(alt, 0) / 8500);
}
