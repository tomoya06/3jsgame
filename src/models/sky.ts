import * as THREE from "three";
import makeCloud2 from "../assets/generate/cloud2";

export class Sky {
  private group: THREE.Group;

  constructor() {
    const radius = 200,
      width = 100,
      degDelta = 3,
      height = 3,
      widthDelta = width / 5;

    this.group = new THREE.Group();

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

        // 角度再加一点随机偏移 防止看起来在排队- -
        const rotateX = curDeg + (Math.random() * degDelta - degDelta / 2);
        const radiusH = radius + (Math.random() * 20 - 10);
        const z = radiusH * Math.sin(rotateX),
          y = radiusH * Math.cos(rotateX);

        const newCloud = makeCloud2();
        newCloud.position.set(x, y, z);
        newCloud.rotateX(rotateX);

        this.group.add(newCloud);
      });
    }

    this.group.position.y = -(radius + height);
    this.group.position.x = -(width / 3);
  }

  public init(scene: THREE.Scene) {
    scene.add(this.group);
  }

  public animate(): void {
    this.group.rotation.x -= 0.0002;
  }
}
