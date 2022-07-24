import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import BaseModel from "./base";

export class Plane extends BaseModel {
  private mixer: THREE.AnimationMixer;
  private clock: THREE.Clock;

  constructor(planeModel: GLTF) {
    super();

    const planeSize = 2;
    const planeHeight = 150;
    planeModel.scene.scale.set(planeSize, planeSize, planeSize);
    const plane = new THREE.Object3D();
    plane.add(planeModel.scene.clone());
    plane.position.set(0, planeHeight, 0);

    const wheel = plane.children[0];

    this.mixer = new THREE.AnimationMixer(wheel);
    this.mixer.clipAction(planeModel.animations[0]).play();
    this.clock = new THREE.Clock();

    this.group.add(plane);
  }

  public animate(): void {
    const delta = this.clock.getDelta();
    this.mixer.update(delta);
  }
}

// // 移动飞机
// function movePlane(params: { direction: EnumDirection }) {
//   const moveUnit = 5;
//   const leanUnit = 20;
//   let nextPos = plane.position;
//   let midAngle = { x: 0, y: 0, z: 0 };
//   switch (params.direction) {
//     case EnumDirection.UP:
//       nextPos = new THREE.Vector3(
//         undefined,
//         plane.position.y + moveUnit,
//         undefined
//       );
//       midAngle = { x: THREE.MathUtils.degToRad(-leanUnit), y: 0, z: 0 };
//       break;
//     case EnumDirection.DOWN:
//       nextPos = new THREE.Vector3(
//         undefined,
//         plane.position.y - moveUnit,
//         undefined
//       );
//       midAngle = { x: THREE.MathUtils.degToRad(leanUnit), y: 0, z: 0 };
//       break;
//     case EnumDirection.LEFT:
//       nextPos = new THREE.Vector3(
//         plane.position.x + moveUnit,
//         undefined,
//         undefined
//       );
//       midAngle = { x: 0, y: 0, z: THREE.MathUtils.degToRad(-leanUnit) };
//       break;
//     case EnumDirection.RIGHT:
//       nextPos = new THREE.Vector3(
//         plane.position.x - moveUnit,
//         undefined,
//         undefined
//       );
//       midAngle = { x: 0, y: 0, z: THREE.MathUtils.degToRad(leanUnit) };
//       break;
//     case EnumDirection.FRONT:
//       nextPos = new THREE.Vector3(
//         undefined,
//         undefined,
//         plane.position.z + moveUnit
//       );
//       break;
//     case EnumDirection.BACK:
//       nextPos = new THREE.Vector3(
//         undefined,
//         undefined,
//         plane.position.z - moveUnit
//       );
//       break;
//   }
//   const endAngle = { x: 0, y: 0, z: 0 };

//   new TWEEN.Tween(plane.position)
//     .delay(60)
//     .to(nextPos, 600)
//     .easing(TWEEN.Easing.Quadratic.InOut)
//     .onUpdate(({ x, y, z }) => {
//       plane.position.x = x;
//       plane.position.y = y;
//       plane.position.z = z;
//     })
//     .start();
//   new TWEEN.Tween(plane.rotation)
//     .to(midAngle, 250)
//     .easing(TWEEN.Easing.Cubic.Out)
//     .delay(100)
//     .chain(
//       new TWEEN.Tween(plane.rotation)
//         .to(endAngle, 250)
//         .easing(TWEEN.Easing.Cubic.In)
//     )
//     .onUpdate(({ x, y, z }) => {
//       plane.rotateX(x);
//       plane.rotateY(y);
//       plane.rotateZ(z);
//     })
//     .start();
// }
