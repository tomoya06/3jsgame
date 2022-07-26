import * as THREE from "three";
import makeTree from "../assets/generate/tree";
import BaseModel from "./base";

const radius = 1000,
  width = 200,
  degDelta = 2,
  widthDelta = width / 5;

export class Ground extends BaseModel {
  constructor() {
    super();

    // 加个地面
    const earthGeo = new THREE.CylinderGeometry(
      radius,
      radius,
      width,
      radius * 2
    );
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x6f9e72,
    });
    const earchMesh = new THREE.Mesh(earthGeo, earthMat);
    earchMesh.position.set(width / 2, 0, 0);
    earchMesh.rotateY(THREE.MathUtils.degToRad(90));
    earchMesh.rotateX(THREE.MathUtils.degToRad(90));

    this.group.add(earchMesh);

    for (let i = 0; i < 360; i += degDelta) {
      const curDeg = THREE.MathUtils.degToRad(i);

      const treeCnt = Math.floor(Math.random() * widthDelta);
      const positions = new Set(
        Array(treeCnt)
          .fill(1)
          .map((_) => Math.floor(Math.random() * width))
      );

      [...positions].forEach((pos) => {
        const x = pos;

        const rotateX = curDeg + (Math.random() * degDelta - degDelta / 2);
        const radiusH = radius;
        const z = radiusH * Math.sin(rotateX),
          y = radiusH * Math.cos(rotateX);

        const newTree = makeTree();
        newTree.position.set(x, y, z);
        newTree.rotateX(rotateX);

        this.group.add(newTree);
      });
    }

    this.group.position.y = 160 - radius;
    this.group.position.x = -(width / 3);
  }

  public animate(): void {
    this.group.rotation.x -= 0.00005;
  }
}
