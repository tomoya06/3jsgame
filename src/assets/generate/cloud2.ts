import * as THREE from "three";

export default function makeCloud2() {
  const group = new THREE.Group();

  const ballConfigs: {
    radius: number;
    detail?: number;
    pos: [number, number];
    rotate: [number, number];
    scale?: [number, number, number];
  }[] = [
    {
      radius: 1.0,
      pos: [-0.4, -2],
      rotate: [60, 45],
    },
    {
      radius: 1.8,
      pos: [0, 0],
      rotate: [80, 60],
      scale: [1, 1.2, 1.2],
    },
    { radius: 1.1, pos: [-0.6, 2.0], rotate: [0, 0] },
    { radius: 0.6, pos: [-0.8, 3.0], rotate: [40, 70], scale: [0.8, 0.8, 0.8] },
  ];
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });

  for (const config of ballConfigs) {
    const cloudBall = new THREE.IcosahedronGeometry(
      config.radius,
      config.detail || 0
    );
    const ballMesh = new THREE.Mesh(cloudBall, material);
    ballMesh.position.set(0, config.pos[0], config.pos[1]);
    ballMesh.rotation.set(
      0,
      (config.rotate[0] / 180) * Math.PI,
      (config.rotate[1] / 180) * Math.PI
    );
    if (config.scale) {
      ballMesh.scale.set(config.scale[0], config.scale[1], config.scale[2]);
    }
    group.add(ballMesh);
  }

  return group;
}
