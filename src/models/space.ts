import BaseModel from "./base";
import * as THREE from "three";
import timeSystem, { TimeProgressType } from "../system/time";
import { colord } from "colord";

const curTimeToSpace = (time: TimeProgressType) => {
  const { heightPercent, isNight } = time;

  const baseColor = isNight ? colord("#000430") : colord("#d9e5fc");
  const color = baseColor.darken(1 - heightPercent);
  return {
    color,
  };
};

export default class Space extends BaseModel {
  constructor() {
    super();
  }

  public animate(): void {
    if (!this.scene) {
      return;
    }
    const spaceConfig = curTimeToSpace(timeSystem.time);
    this.scene.background = new THREE.Color(spaceConfig.color.toHex());
  }
}
