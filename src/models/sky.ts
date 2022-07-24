import * as THREE from "three";
import makeCloud2 from "../assets/generate/cloud";
import BaseModel from "./base";

const radius = 180,
  width = 140,
  degDelta = 3,
  heightRange = 10,
  widthDelta = width / 5;

export class Sky extends BaseModel {
  constructor() {
    super();

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
        const rotateX =
          curDeg + (Math.random() * heightRange * 2 - heightRange);
        const radiusH = radius + (Math.random() * 20 - 10);
        const z = radiusH * Math.sin(rotateX),
          y = radiusH * Math.cos(rotateX);

        const newCloud = makeCloud2();
        newCloud.position.set(x, y, z);
        newCloud.rotateX(rotateX);

        this.group.add(newCloud);
      });
    }

    this.group.position.y = 0;
    this.group.position.x = -(width / 3);
  }

  public animate(): void {
    this.group.rotation.x -= 0.0002;
  }
}
