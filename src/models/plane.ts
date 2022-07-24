import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import BaseModel from "./base";
import { fixInRange } from "../utils/number";

const planeSize = 2;
const planeHeight = 180;

const decerate = 0.002;
const accerate = 0.01;
const maxSpeed = 0.1;
const maxReach = 20;

const isKeyDown = Array(26).fill(false);

export class Plane extends BaseModel {
  private mixer: THREE.AnimationMixer;
  private clock: THREE.Clock;
  private speed: [number, number, number];
  private acce: [number, number, number];
  private defaultPosition: [number, number, number];

  constructor(planeModel: GLTF) {
    super();

    planeModel.scene.scale.set(planeSize, planeSize, planeSize);
    const plane = new THREE.Object3D();
    plane.add(planeModel.scene.clone());

    const wheel = plane.children[0];

    this.mixer = new THREE.AnimationMixer(wheel);
    this.mixer.clipAction(planeModel.animations[0]).play();
    this.clock = new THREE.Clock();

    this.group.add(plane);
    this.defaultPosition = [0, planeHeight, 0];
    this.group.position.set(
      this.defaultPosition[0],
      this.defaultPosition[1],
      this.defaultPosition[2]
    );

    this.speed = [0, 0, 0];
    this.acce = [0, 0, 0];
  }

  private bindkey() {
    onkeydown = onkeyup = (e) => {
      isKeyDown[e.keyCode] = e.type === "keydown";
    };
  }

  private calcAcc() {
    this.acce = [0, 0, 0];

    // https://www.toptal.com/developers/keycode/for/s
    if (isKeyDown[87]) {
      // w
      this.acce[2] += accerate;
    }
    if (isKeyDown[83]) {
      // s
      this.acce[2] -= accerate;
    }
    if (isKeyDown[65]) {
      // a
      this.acce[0] += accerate;
    }
    if (isKeyDown[68]) {
      // d
      this.acce[0] -= accerate;
    }
    if (isKeyDown[81]) {
      // q
      this.acce[1] += accerate;
    }
    if (isKeyDown[69]) {
      // e
      this.acce[1] -= accerate;
    }
  }

  private drive() {
    this.calcAcc();
    console.log(this.speed, this.acce);

    for (let axis = 0; axis <= 2; axis++) {
      const curSpeed = this.speed[axis];
      const curAcce = this.acce[axis];
      if (curAcce !== 0) {
        let axisNewSpeed = curSpeed + curAcce;
        axisNewSpeed = Math.min(axisNewSpeed, maxSpeed);
        axisNewSpeed = Math.max(axisNewSpeed, -maxSpeed);
        this.speed[axis] = axisNewSpeed;
        continue;
      }
      if (curSpeed === 0) {
        continue;
      }
      if (curSpeed < 0) {
        const axisNewSpeed = Math.min(curSpeed + decerate, 0);
        this.speed[axis] = axisNewSpeed;
      } else if (curSpeed > 0) {
        const axisNewSpeed = Math.max(curSpeed - decerate, 0);
        this.speed[axis] = axisNewSpeed;
      }
    }

    const curPosition = this.group.position;
    const newPosition = [
      curPosition.x + this.speed[0],
      curPosition.y + this.speed[1],
      curPosition.z + this.speed[2],
    ].map((pos, idx) =>
      fixInRange(pos, [
        -maxReach + this.defaultPosition[idx],
        +maxReach + this.defaultPosition[idx],
      ])
    );
    this.group.position.set(newPosition[0], newPosition[1], newPosition[2]);
  }

  public init(scene: THREE.Scene): void {
    super.init(scene);

    this.bindkey();
  }

  public animate(): void {
    const delta = this.clock.getDelta();
    this.mixer.update(delta);

    this.drive();
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
