// Tuning numbers: world size, the Kestrel K-2's airframe, landing limits and unit conversions.

export const WORLD = {
  size: 9000,          // metres across the square map
  segments: 300,       // terrain grid resolution
  seaLevel: 0,
  fogNear: 900,
  fogFar: 7000,
};

// The Kestrel K-2: a two-seat high-wing tourer, light enough to throw around.
export const AIRCRAFT = {
  mass: 1050,            // kg, empty plus pilot
  wingArea: 16.2,        // m^2
  maxThrust: 5600,       // N at full throttle, sea level
  cd0: 0.052,            // parasite drag
  induced: 0.055,        // induced drag factor k in CD = cd0 + k CL^2
  clSlope: 5.1,          // lift per radian of angle of attack
  cl0: 0.32,
  clMax: 1.45,
  stallAoa: 0.27,        // radians, about 15.5 degrees
  flapCl: 0.45,
  flapDrag: 0.06,
  gearDrag: 0.012,
  rollRate: 2.1,         // rad/s at full stick and cruise speed
  pitchRate: 1.15,
  yawRate: 0.45,
  gearHeight: 1.55,      // metres from the centre of gravity down to the wheels
  fuelMax: 120,          // litres
  burnFull: 0.62,        // litres a second at full throttle
  burnIdle: 0.05,
  neverExceed: 98,       // m/s, about 190 knots
  stallSpeed: 27,
};

export const LANDING = {
  maxSinkSafe: 3.2,      // m/s: above this, a touchdown hurts the airframe
  maxSinkCrash: 7.0,     // m/s: above this, the gear folds
  maxBank: 0.26,         // rad on touchdown
  maxPitchDown: 0.08,
};

export const MS_TO_KT = 1.94384;

export const M_TO_FT = 3.28084;
