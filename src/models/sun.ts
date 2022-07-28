import BaseModel from "./base";
import * as THREE from "three";
import { colord } from "colord";
import mj from "number-precision";
import { fixInRange } from "../utils/number";
import timeSystem, { TimeProgressType } from "../system/time";

const radius = 60,
  centerPos = [200 + radius, 180 - radius, 0],
  trackB = centerPos[1],
  trackA = trackB * 2;

interface LightGroup {
  ambient: THREE.Light;
  nightAmb: THREE.Light;
  main: THREE.Light;
  night: THREE.Light;
  defaultAmb: THREE.Light;
}

type TimePositionType = ReturnType<typeof curTimeToPosition>;

const curTimeToPosition = (time: TimeProgressType) => {
  const { percent } = time;
  let x = mj.times(fixInRange(2 * percent - 1, [-1, 1]), trackA);
  let y = mj.times(
    Math.sqrt(mj.minus(1, mj.divide(mj.times(x, x), mj.times(trackA, trackA)))),
    trackB
  );

  return {
    x,
    y,
    ...time,
  };
};

export class Sun extends BaseModel {
  private lights: LightGroup;
  private sun: THREE.Mesh;
  private moon: THREE.Mesh;

  constructor() {
    super();

    const sunGeom = new THREE.OctahedronGeometry(radius, 6);
    const sunMat = new THREE.MeshPhongMaterial({
      color: 0xedeb27,
      flatShading: true,
      fog: true,
    });
    this.sun = new THREE.Mesh(sunGeom, sunMat);

    this.sun.position.set(centerPos[0], centerPos[1], centerPos[2]);
    this.group.add(this.sun);

    const moonGeo = new THREE.OctahedronGeometry(radius, 4);
    const moonMat = new THREE.MeshPhongMaterial({
      color: 0x7b76ae,
      flatShading: true,
      fog: false,
      specular: 0xffffff,
    });
    this.moon = new THREE.Mesh(moonGeo, moonMat);
    this.moon.rotation.set(10, 20, 30);
    this.moon.position.set(centerPos[0], -centerPos[1], -centerPos[2]);

    this.group.add(this.moon);

    this.lights = this.initLight();
  }

  private initLight(): LightGroup {
    const ambient = new THREE.AmbientLight(0xdedede);
    const nightAmb = new THREE.AmbientLight(0x7590bf);
    const defaultAmb = new THREE.AmbientLight(0x98bdfa, 0.3);

    const main = new THREE.DirectionalLight(0xc9c3a7);
    main.position.set(0, 0, 0).normalize();

    const night = new THREE.DirectionalLight(0x141037);
    night.position.set(0, 0, 0).normalize();

    return {
      ambient,
      nightAmb,
      defaultAmb,
      main,
      night,
    };
  }

  private animateLight(position: TimePositionType) {
    let lightKey: keyof LightGroup = "main";
    let subKey: keyof LightGroup = "night";
    let lightAmb: keyof LightGroup = "ambient";
    let subAmb: keyof LightGroup = "nightAmb";
    if (position.isNight) {
      lightKey = "night";
      subKey = "main";
      lightAmb = "nightAmb";
      subAmb = "ambient";
    }
    this.lights[lightKey].position.set(0, position.y, position.x).normalize();
    this.lights[lightKey].intensity = mj.times(position.heightPercent, 0.6);
    this.lights[subKey].intensity = 0;

    this.lights[lightAmb].intensity = mj.times(position.heightPercent, 0.6);
    this.lights[subAmb].intensity = 0;
  }

  public init(scene: THREE.Scene): void {
    super.init(scene);

    Object.values(this.lights).forEach((light) => scene.add(light));

    scene.fog = new THREE.Fog(0xf7d9aa, 80, 200);
  }

  public animate(): void {
    const position = curTimeToPosition(timeSystem.time);

    if (position.isNight) {
      this.moon.position.z = position.x;
      this.moon.position.y = position.y;

      this.sun.position.y = -100;
    } else {
      this.sun.position.z = position.x;
      this.sun.position.y = position.y;
      this.moon.position.y = -100;
    }

    this.animateLight(position);

    // TODO: 日夜切换的时候会有骤变
    if (this.scene?.fog) {
      if (position.isNight) {
        this.scene.fog.color = new THREE.Color(
          colord("#311f57")
            .darken(1 - position.heightPercent)
            .toHex()
        );
      } else {
        this.scene.fog.color = new THREE.Color(
          colord("#f7d9aa")
            .darken(1 - position.heightPercent)
            .toHex()
        );
      }
    }
  }
}
