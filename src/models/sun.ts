import BaseModel from "./base";
import * as THREE from "three";

const radius = 60,
  centerPos = [200 + radius, 180 - radius, 0],
  trackB = centerPos[1],
  trackA = trackB * 2;

const halfday = 12 * 60 * 60 * 1000;
const fullDay = 24 * 60 * 60 * 1000;
const startTime = Date.now();
const timeSpeed = 1000;

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
  const x = Math.min((2 * (ts % halfday)) / halfday - 1, 1) * trackA;
  const y = trackB * Math.sqrt(1 - (x * x) / (trackA * trackA));

  return {
    isAfternoon,
    x,
    y,
  };
};

export class Sun extends BaseModel {
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
  }

  public animate(): void {
    const position = curTimeToPosition();
    this.group.position.z = position.x;
    this.group.position.y = position.y;

    if (!this.scene) {
      return;
    }
    // 更新阳光
    const fogColor = new THREE.Color(0xf7d9aa);
    this.scene.fog = new THREE.Fog(fogColor, 80, 200);
  }
}
