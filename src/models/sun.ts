import BaseModel from "./base";
import * as THREE from "three";
import { fixInRange } from "../utils/number";
import { GUI } from "dat.gui";

const radius = 60,
  centerPos = [200 + radius, 180 - radius, 0],
  trackB = centerPos[1],
  trackA = trackB * 2;

// TODO: 时间处理拎出去
const halfday = 12 * 60 * 60 * 1000;
const fullDay = 24 * 60 * 60 * 1000;
const startTime = Date.now() - halfday;
const timeSpeed = 1000 * 3;
const guiMocker = {
  mockTimePercent: 0.75,
};

const gui = new GUI();
const timeFolder = gui.addFolder("TIME");
timeFolder.add(guiMocker, "mockTimePercent", 0, 1);
timeFolder.open();

type PositionByTimeType = ReturnType<typeof curTimeToPosition>;
interface LightGroup {
  ambient: THREE.Light;
  main: THREE.Light;
  night: THREE.Light;
}

const curTimeToPosition = () => {
  // // FOR REALTIME
  // const midnight = new Date();
  // midnight.setHours(0, 0, 0, 0);
  // const midnightTime = midnight.getTime();
  // const curTime = Date.now();

  // FOR FAKE TIME
  const midnightTime = startTime;
  const curTime = Date.now();

  // const ts = ((curTime - midnightTime) * timeSpeed) % fullDay;
  const ts = guiMocker.mockTimePercent * fullDay;

  const isNight = ts > halfday;
  let percent = (ts % halfday) / halfday;
  let x = fixInRange(2 * percent - 1, [-1, 1]) * trackA;
  let y = trackB * Math.sqrt(1 - (x * x) / (trackA * trackA));

  return {
    isNight,
    percent,
    x,
    y,
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
    const ambient = new THREE.AmbientLight(0xffffff);

    const main = new THREE.DirectionalLight(0xffffff);
    main.position.set(0, 0, 0).normalize();

    const night = new THREE.DirectionalLight(0x141037);
    night.position.set(0, 0, 0).normalize();

    return {
      ambient,
      main,
      night,
    };
  }

  private animateLight(position: PositionByTimeType) {
    let lightKey: keyof LightGroup = "main";
    let subKey: keyof LightGroup = "night";
    if (position.isNight) {
      lightKey = "night";
      subKey = "main";
    }
    this.lights[lightKey].position.set(0, position.y, position.x).normalize();
    this.lights[lightKey].intensity = position.percent;
    this.lights[subKey].intensity = 0;

    this.lights.ambient.intensity =
      (0.5 - Math.abs(position.percent - 0.5)) * 1 + 0.1;
  }

  public init(scene: THREE.Scene): void {
    super.init(scene);

    Object.values(this.lights).forEach((light) => scene.add(light));

    scene.fog = new THREE.Fog(0xf7d9aa, 80, 200);
  }

  public animate(): void {
    const position = curTimeToPosition();

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
        this.scene.fog.color = new THREE.Color(0x311f57);
      } else {
        this.scene.fog.color = new THREE.Color(0xf7d9aa);
      }
    }
  }
}
