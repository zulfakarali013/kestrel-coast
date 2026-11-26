// Which keys are held and which were just pressed.

export const KEYS = new Set();

export const PRESSED = [];

export function down(code) { return KEYS.has(code); }

// Keys pressed since the last call, for one-shot actions such as camera switch or pause.
export function takePressed() { return PRESSED.splice(0, PRESSED.length); }
