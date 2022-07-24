import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import BaseModel from "./base";
import { fixInRange } from "../utils/number";

const planeSize = 2;
const planeHeight = 180;

const decerate = 0.002;
const accerate = 0.004;
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

  public init(scene: THREE.Scene): void {
    super.init(scene);

    this.bindkey();
  }

  public animate(): void {
    this.calcAcc();

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

    const rotateZ = this.speed[0] * 4 * THREE.MathUtils.degToRad(-90);
    const rotateX = this.speed[1] * 2 * THREE.MathUtils.degToRad(-90);
    console.log(
      "speed",
      this.speed,
      "acce",
      this.acce,
      "RZ",
      rotateZ,
      "RX",
      rotateX
    );

    const delta = this.clock.getDelta();
    const mixerSpeed = (1 + this.speed[2] * 8) * delta;

    this.group.position.set(newPosition[0], newPosition[1], newPosition[2]);
    this.group.rotation.set(rotateX, 0, rotateZ);

    this.mixer.update(mixerSpeed);
  }
}
