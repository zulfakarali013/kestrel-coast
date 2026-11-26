// Keyboard and mouse into one set of controls: stick, rudder, throttle and brakes.
import { KEYS, PRESSED, down } from './keyboard.js';

export function createInput(canvas) {
  const st = {
    pitch: 0, roll: 0, yaw: 0, throttle: 0, flaps: 0, brakes: false,
    mouseFly: false, mx: 0, my: 0, look: { yaw: 0, pitch: 0, active: false },
  };
  addEventListener('keydown', (e) => {
    if (!KEYS.has(e.code)) PRESSED.push(e.code);
    KEYS.add(e.code);
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  });
  addEventListener('keyup', (e) => KEYS.delete(e.code));
  addEventListener('blur', () => KEYS.clear());

  // Mouse yoke: click the view to grab the mouse; moving it deflects the stick, which springs back.
  canvas.addEventListener('mousedown', (e) => {
    if (e.button === 2) { st.look.active = true; return; }
    if (document.pointerLockElement !== canvas) canvas.requestPointerLock?.();
  });
  addEventListener('mouseup', (e) => { if (e.button === 2) st.look.active = false; });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('pointerlockchange', () => { st.mouseFly = document.pointerLockElement === canvas; st.mx = st.my = 0; });
  addEventListener('mousemove', (e) => {
    if (st.look.active) { st.look.yaw -= e.movementX * 0.006; st.look.pitch = Math.max(-1.2, Math.min(0.9, st.look.pitch - e.movementY * 0.005)); }
    else if (st.mouseFly) { st.mx = Math.max(-1, Math.min(1, st.mx + e.movementX * 0.004)); st.my = Math.max(-1, Math.min(1, st.my + e.movementY * 0.004)); }
  });
  addEventListener('wheel', (e) => { st.throttle = Math.max(0, Math.min(1, st.throttle - Math.sign(e.deltaY) * 0.05)); }, { passive: true });
  return st;
}

export function approach(v, target, rate, dt) {
  const d = target - v;
  return Math.abs(d) < rate * dt ? target : v + Math.sign(d) * rate * dt;
}

export function updateInput(st, dt) {
  const kp = (down('KeyS') || down('ArrowDown') ? 1 : 0) - (down('KeyW') || down('ArrowUp') ? 1 : 0);
  const kr = (down('KeyD') || down('ArrowRight') ? 1 : 0) - (down('KeyA') || down('ArrowLeft') ? 1 : 0);
  const ky = (down('KeyE') ? 1 : 0) - (down('KeyQ') ? 1 : 0);
  if (st.mouseFly) { st.mx *= Math.pow(0.12, dt); st.my *= Math.pow(0.12, dt); }
  const mp = st.mouseFly ? -st.my : 0, mr = st.mouseFly ? st.mx : 0;
  st.pitch = approach(st.pitch, THREE_clamp(kp + mp), kp || mp ? 3 : 5, dt);
  st.roll = approach(st.roll, THREE_clamp(kr + mr), kr || mr ? 3.5 : 6, dt);
  st.yaw = approach(st.yaw, ky, 3, dt);
  if (down('ShiftLeft') || down('ShiftRight') || down('KeyR')) st.throttle = Math.min(1, st.throttle + dt * 0.5);
  if (down('ControlLeft') || down('ControlRight') || down('KeyF')) st.throttle = Math.max(0, st.throttle - dt * 0.5);
  st.brakes = down('KeyB') || down('Space');
}

export function THREE_clamp(v) { return Math.max(-1, Math.min(1, v)); }
