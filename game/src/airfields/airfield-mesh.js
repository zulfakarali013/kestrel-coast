// Builds an airfield: strip, edge and approach lights, hangar, tower and windsock.
import * as THREE from 'three';
import { paintRunway } from './runway-texture.js';

// Runway strip, edge lights, a windsock, a hangar and a tower: an airfield that reads from the air.
export function buildAirfield(field) {
  const group = new THREE.Group();
  group.position.set(field.x, field.elev + 0.12, field.z);
  group.rotation.y = -THREE.MathUtils.degToRad(field.heading);

  const strip = new THREE.Mesh(
    new THREE.PlaneGeometry(field.width, field.length),
    new THREE.MeshLambertMaterial({ map: paintRunway(field) }),
  );
  strip.rotation.x = -Math.PI / 2;
  group.add(strip);

  const apron = new THREE.Mesh(new THREE.PlaneGeometry(field.width * 2.8, field.length + 120), new THREE.MeshLambertMaterial({ color: 0x6f8f4e }));
  apron.rotation.x = -Math.PI / 2;
  apron.position.y = -0.06;
  group.add(apron);

  const lightGeo = new THREE.SphereGeometry(0.9, 8, 6);
  const edge = new THREE.MeshBasicMaterial({ color: 0xfff1b0 });
  const green = new THREE.MeshBasicMaterial({ color: 0x5cff7a });
  const red = new THREE.MeshBasicMaterial({ color: 0xff4a3a });
  const lights = new THREE.InstancedMesh(lightGeo, edge, 64);
  let n = 0;
  const m = new THREE.Matrix4();
  for (let i = 0; i < 16; i++) {
    const z = -field.length / 2 + (i + 0.5) * (field.length / 16);
    for (const s of [-1, 1]) { m.makeTranslation(s * (field.width / 2 + 2), 0.6, z); lights.setMatrixAt(n++, m); }
  }
  lights.count = n;
  group.add(lights);
  for (let i = -3; i <= 3; i++) {
    const a = new THREE.Mesh(lightGeo, green); a.position.set(i * 4, 0.6, field.length / 2 + 2); group.add(a);
    const b = new THREE.Mesh(lightGeo, red); b.position.set(i * 4, 0.6, -field.length / 2 - 2); group.add(b);
  }

  // Approach lights: a row of bright bars leading in from the threshold.
  for (let i = 1; i <= 6; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 0.8), edge);
    bar.position.set(0, 0.8, field.length / 2 + i * 28);
    group.add(bar);
  }

  const hangar = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(34, 12, 26), new THREE.MeshLambertMaterial({ color: 0xc9b48a }));
  body.position.y = 6;
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 34, 12, 1, false, 0, Math.PI), new THREE.MeshLambertMaterial({ color: 0x8c3b2a }));
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 12;
  hangar.add(body, roof);
  hangar.position.set(field.width / 2 + 45, 0, -field.length * 0.15);
  group.add(hangar);

  const tower = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(5, 16, 5), new THREE.MeshLambertMaterial({ color: 0xe9e4d6 }));
  shaft.position.y = 8;
  const cab = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), new THREE.MeshLambertMaterial({ color: 0x2f5d7c, emissive: 0x10283a }));
  cab.position.y = 18;
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd23a }));
  beacon.position.y = 21;
  tower.add(shaft, cab, beacon);
  tower.position.set(field.width / 2 + 40, 0, field.length * 0.12);
  group.add(tower);

  const sock = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 7), new THREE.MeshLambertMaterial({ color: 0xdddddd }));
  pole.position.y = 3.5;
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.9, 4.5, 10, 1, true), new THREE.MeshLambertMaterial({ color: 0xff6a1f, side: THREE.DoubleSide }));
  cone.rotation.z = Math.PI / 2;
  cone.position.set(2.2, 6.6, 0);
  sock.add(pole, cone);
  sock.position.set(-field.width / 2 - 20, 0, field.length * 0.35);
  group.add(sock);
  group.userData.windsock = sock;
  return group;
}
