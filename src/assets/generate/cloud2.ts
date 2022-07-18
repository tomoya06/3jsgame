import * as THREE from "three";

export default function makeCloud2() {
  const mesh = new THREE.Group();

  const geom = new THREE.DodecahedronGeometry(1, 0);
  const mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
  });

  const nBlocs = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < nBlocs; i++) {
    //Clone mesh geometry
    const m = new THREE.Mesh(geom, mat);
    //Randomly position each cube
    m.position.x = Math.random() * 0.4;
    m.position.z = i;
    m.position.y = Math.random() * 0.4;
    m.rotation.z = Math.random() * Math.PI * 2;
    m.rotation.y = Math.random() * Math.PI * 2;

    //Randomly scale the cubes
    const s = 0.1 + Math.random() * 0.9;
    m.scale.set(s, s, s);
    mesh.add(m);
  }

  return mesh;
}
