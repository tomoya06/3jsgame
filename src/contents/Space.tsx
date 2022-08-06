import { useFrame } from "@react-three/fiber";
import { colord } from "colord";
import timeSystem, { TimeProgressType } from "../system/time";
import mj from "number-precision";
import * as THREE from "three";

const curTimeToSpace = (time: TimeProgressType) => {
  const { heightPercent, isNight } = time;

  const baseColor = isNight ? colord("#000430") : colord("#d9e5fc");
  const color = baseColor.darken(mj.minus(1, heightPercent));
  return {
    color,
  };
};

export default function Space() {
  useFrame((state) => {
    const spaceConfig = curTimeToSpace(timeSystem.time);
    state.scene.background = new THREE.Color(spaceConfig.color.toHex());
  });

  return <></>;
}
