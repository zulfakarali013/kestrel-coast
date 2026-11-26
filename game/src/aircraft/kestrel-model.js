// Builds the Kestrel K-2: fuselage, high wing, tail, hinged control surfaces, prop and gear.
import * as THREE from 'three';

export const PAINT = { body: 0xf3efe6, stripe: 0xd2532b, trim: 0x23405e, metal: 0x9aa3ab, glass: 0x2b4b63, tyre: 0x1d1d1f };

export function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.1, flatShading: true, ...extra });
}

// A surface hinged at its leading edge, so it can deflect like a real aileron or elevator.
export function hinged(w, d, h, material) {
  const pivot = new THREE.Group();
  const flap = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  flap.position.z = d / 2;
  pivot.add(flap);
  return pivot;
}

// The nose points along -Z, the right wing along +X, up is +Y.
export function buildAircraft() {
  const plane = new THREE.Group();
  const body = mat(PAINT.body), stripe = mat(PAINT.stripe), trim = mat(PAINT.trim), metal = mat(PAINT.metal, { metalness: 0.6 });
  const glass = new THREE.MeshStandardMaterial({ color: PAINT.glass, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.75 });

  // Fuselage: a lathe profile from spinner to tail cone.
  const profile = [[0, -4.4], [0.45, -4.3], [0.7, -3.9], [0.78, -3.0], [0.8, -1.2], [0.74, 0.6], [0.55, 2.4], [0.3, 4.2], [0.12, 5.2], [0, 5.4]]
    .map(([r, z]) => new THREE.Vector2(r, z));
  const fuseGeo = new THREE.LatheGeometry(profile, 14);
  fuseGeo.rotateX(Math.PI / 2);
  fuseGeo.scale(1, 1.15, 1);
  const fuselage = new THREE.Mesh(fuseGeo, body);
  plane.add(fuselage);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.78, 0.5, 14, 1, true), stripe);
  band.rotation.x = Math.PI / 2;
  band.position.z = 0.2;
  band.scale.set(1, 1, 1.15);
  plane.add(band);
  const cheat = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 6.5), stripe);
  for (const s of [-1, 1]) { const c = cheat.clone(); c.position.set(s * 0.74, -0.05, 0.9); plane.add(c); }

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.72, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), glass);
  canopy.scale.set(0.95, 0.75, 1.9);
  canopy.position.set(0, 0.62, -1.4);
  plane.add(canopy);

  // High wing with a slight dihedral, ailerons and flaps.
  const wing = new THREE.Group();
  wing.position.set(0, 1.05, -1.2);
  plane.add(wing);
  const surfaces = { aileronL: null, aileronR: null, flapL: null, flapR: null, elevator: null, rudder: null };
  for (const s of [-1, 1]) {
    const half = new THREE.Group();
    half.rotation.z = s * 0.035;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.16, 1.55), body);
    panel.position.set(s * 2.95, 0, 0);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 1.5), stripe);
    tip.position.set(s * 5.72, 0, 0);
    const ail = hinged(2.2, 0.42, 0.1, trim);
    ail.position.set(s * 4.2, 0, 0.77);
    const flap = hinged(2.4, 0.42, 0.1, body);
    flap.position.set(s * 1.75, 0, 0.77);
    half.add(panel, tip, ail, flap);
    wing.add(half);
    if (s < 0) { surfaces.aileronL = ail; surfaces.flapL = flap; } else { surfaces.aileronR = ail; surfaces.flapR = flap; }
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.9), metal);
    strut.position.set(s * 1.6, 0.35, -1.0);
    strut.rotation.z = s * 1.06;
    plane.add(strut);
    const navLight = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), new THREE.MeshBasicMaterial({ color: s < 0 ? 0xff3030 : 0x30ff60 }));
    navLight.position.set(s * 5.86, 1.05, -1.2);
    plane.add(navLight);
  }

  // Tail: stabiliser with elevator, fin with rudder.
  const stab = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 0.9), body);
  stab.position.set(0, 0.25, 4.7);
  plane.add(stab);
  surfaces.elevator = hinged(3.6, 0.45, 0.08, trim);
  surfaces.elevator.position.set(0, 0.25, 5.15);
  plane.add(surfaces.elevator);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 1.1), body);
  fin.position.set(0, 1.0, 4.75);
  fin.rotation.x = -0.35;
  plane.add(fin);
  const finStripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.9), stripe);
  finStripe.position.set(0, 1.25, 4.85);
  finStripe.rotation.x = -0.35;
  plane.add(finStripe);
  surfaces.rudder = new THREE.Group();
  const rud = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.45), trim);
  rud.position.set(0, 0, 0.22);
  surfaces.rudder.add(rud);
  surfaces.rudder.position.set(0, 1.05, 5.35);
  plane.add(surfaces.rudder);

  // Nose: spinner and a three-blade prop that blurs into a disc at speed.
  const spinner = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.7, 12), stripe);
  spinner.rotation.x = -Math.PI / 2;
  spinner.position.z = -4.7;
  plane.add(spinner);
  const prop = new THREE.Group();
  prop.position.z = -4.45;
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.05, 0.05), trim);
    blade.position.y = 0.55;
    const arm = new THREE.Group();
    arm.rotation.z = (i * Math.PI * 2) / 3;
    arm.add(blade);
    prop.add(arm);
  }
  plane.add(prop);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(1.15, 24), new THREE.MeshBasicMaterial({ color: 0xdadfe4, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
  disc.position.z = -4.47;
  plane.add(disc);

  // Fixed tricycle gear with spats.
  const gear = new THREE.Group();
  const wheel = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12);
  wheel.rotateZ(Math.PI / 2);
  const tyre = mat(PAINT.tyre);
  for (const [x, z] of [[-1.15, -0.4], [1.15, -0.4], [0, -3.3]]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0), metal);
    leg.position.set(x * 0.85, -0.9, z);
    leg.rotation.z = x * 0.35;
    const w = new THREE.Mesh(wheel, tyre);
    w.position.set(x, -1.23, z);
    const spat = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), stripe);
    spat.scale.set(0.55, 0.65, 1.3);
    spat.position.set(x, -1.18, z);
    gear.add(leg, w, spat);
  }
  plane.add(gear);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff4020 }));
  beacon.position.set(0, 1.65, 4.6);
  plane.add(beacon);

  plane.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  plane.userData = { surfaces, prop, disc, beacon };
  return plane;
}
