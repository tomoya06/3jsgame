import * as THREE from "three";
import makeTree from "../assets/generate/tree";

export class Ground {
  private group: THREE.Group;

  constructor() {
    const radius = 160,
      width = 100,
      degDelta = 3,
      widthDelta = width / 5;

    this.group = new THREE.Group();

    // 加个地面
    const earthGeo = new THREE.CylinderGeometry(
      radius,
      radius,
      width,
      radius * 2
    );
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x6f9e72,
    });
    const earchMesh = new THREE.Mesh(earthGeo, earthMat);
    earchMesh.position.set(width, 0, 0);
    earchMesh.rotateY(THREE.MathUtils.degToRad(90));
    earchMesh.rotateX(THREE.MathUtils.degToRad(90));

    this.group.add(earchMesh);

    for (let i = 0; i < 360; i += degDelta) {
      const curDeg = THREE.MathUtils.degToRad(i);

      const cloudCnt = Math.floor(Math.random() * widthDelta);
      const positions = new Set(
        Array(cloudCnt)
          .fill(1)
          .map((_) => Math.floor(Math.random() * width))
      );

      [...positions].forEach((pos) => {
        const x = pos;

        const rotateX = curDeg + (Math.random() * degDelta - degDelta / 2);
        const radiusH = radius;
        const z = radiusH * Math.sin(rotateX),
          y = radiusH * Math.cos(rotateX);

        const newCloud = makeTree();
        newCloud.position.set(x, y, z);
        newCloud.rotateX(rotateX);

        this.group.add(newCloud);
      });
    }

    this.group.position.y = 0;
    this.group.position.x = -(width / 3);
  }

  public init(scene: THREE.Scene) {
    scene.add(this.group);
  }

  public animate(): void {
    this.group.rotation.x -= 0.0002;
  }
}
