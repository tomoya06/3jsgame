import * as THREE from "three";

export default function makeCloud2() {
  const group = new THREE.Group();

  const ballConfigs: [number, number, [number, number], [number, number]][] = [
    // radius, detail, [x, y]
    [1.0, 0, [-0.4, -1.4], [60, 45]],
    [1.8, 0, [0, 0], [80, 60]],
    [1.1, 0, [-0.3, 1.8], [0, 0]],
    [0.6, 0, [-0.3, 3.0], [40, 70]],
  ];
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });

  for (const config of ballConfigs) {
    const cloudBall = new THREE.IcosahedronGeometry(config[0], config[1]);
    const ballMesh = new THREE.Mesh(cloudBall, material);
    ballMesh.position.set(0, config[2][0], config[2][1]);
    ballMesh.rotation.set(
      0,
      (config[3][0] / 180) * Math.PI,
      (config[3][1] / 180) * Math.PI
    );
    group.add(ballMesh);
  }

  return group;
}
