// Engine spool and flap travel: how quickly the throttle and the flaps follow the pilot's controls.

export function spool(s, thrustShare, flapsCommand, dt) {
  s.throttle += (thrustShare - s.throttle) * Math.min(1, dt * 2.5);
  s.flaps += (flapsCommand - s.flaps) * Math.min(1, dt * 0.8);
}
