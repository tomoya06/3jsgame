import BaseModel from "./base";
import * as THREE from "three";

const radius = 60,
  centerPos = [200 + radius, 180 - radius, 0],
  trackB = centerPos[1],
  trackA = trackB * 2;

const halfday = 12 * 60 * 60 * 1000;
const fullDay = 24 * 60 * 60 * 1000;
const startTime = Date.now();
const timeSpeed = 1000 * 5;

type PositionByTimeType = ReturnType<typeof curTimeToPosition>;
interface LightGroup {
  ambient: THREE.Light;
  main: THREE.Light;
  theme: THREE.Light;
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

  const ts = ((curTime - midnightTime) * timeSpeed) % fullDay;

  const isAfternoon = ts > halfday;
  const percent = (ts % halfday) / halfday;
  const x = Math.min(2 * percent - 1, 1) * trackA;
  const y = trackB * Math.sqrt(1 - (x * x) / (trackA * trackA));

  return {
    isAfternoon,
    percent,
    x,
    y,
  };
};

export class Sun extends BaseModel {
  private lights: LightGroup;

  constructor() {
    super();

    const sunGeom = new THREE.SphereGeometry(radius, 20, 10);
    const sunMat = new THREE.MeshPhongMaterial({
      color: 0xedeb27,
      flatShading: true,
    });
    const sun = new THREE.Mesh(sunGeom, sunMat);

    sun.castShadow = false;
    sun.receiveShadow = false;

    this.group.add(sun);
    this.group.position.set(centerPos[0], centerPos[1], centerPos[2]);

    this.lights = this.initLight();
  }

  private initLight(): LightGroup {
    const ambient = new THREE.AmbientLight(0xffffff);

    const main = new THREE.DirectionalLight(0xffffff);
    main.position.set(0, 0, 0).normalize();

    const theme = new THREE.DirectionalLight(0xff5566);
    theme.position.set(0, 0, 0).normalize();

    return {
      ambient,
      main,
      theme,
    };
  }

  private animateLight(position: PositionByTimeType) {
    this.lights.main.position.set(0, position.y, position.x).normalize();
    this.lights.main.intensity = position.percent;

    this.lights.ambient.intensity =
      (0.5 - Math.abs(position.percent - 0.5)) * 1.2;
  }

  public init(scene: THREE.Scene): void {
    super.init(scene);

    Object.values(this.lights).forEach((light) => scene.add(light));
  }

  public animate(): void {
    const position = curTimeToPosition();
    this.group.position.z = position.x;
    this.group.position.y = position.y;

    this.animateLight(position);

    if (!this.scene) {
      return;
    }
    // 更新阳光
    const fogColor = new THREE.Color(0xf7d9aa);
    this.scene.fog = new THREE.Fog(fogColor, 80, 200);
  }
}
