import { fixInRange, normalizeSpeed } from "../utils/number";
import * as THREE from "three";
import worldspin from "./worldspin";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";

const planeHeight = 0;

const maxSpeed = 0.1;
const maxReach = [50, 20, 20];

const decerate = 0.002;
const accerate = 0.004;
const accumulateKeys = [87, 83, 65, 68, 81, 69];

export const defaultPosition = [0, planeHeight, 0];

export let outerShowLight = false;
export let outerSpeeeed = false;

export function useKeyCtrl() {
  const [showLight, setShowLight] = useState(outerShowLight);
  const [isSpeeeed, setSpeeeed] = useState(outerSpeeeed);

  useFrame(() => {
    setShowLight(outerShowLight);
    setSpeeeed(outerSpeeeed);
  });

  return [showLight, isSpeeeed];
}

const isKeyDown: boolean[] = Array(255).fill(false);
const isKeyDisabled: boolean[] = Array(255).fill(false);

const updateKeyDown = (keycode: number, flag: boolean) => {
  isKeyDown[keycode] = flag;
};

const handleKeyDown = (keycode: number, flag: boolean) => {
  if (!flag) {
    return;
  }

  // l
  if (keycode === 76) {
    outerShowLight = !outerShowLight;
  }

  // p
  if (keycode === 80 && !isKeyDisabled[keycode]) {
    isKeyDisabled[keycode] = true;
    worldspin.speedup();
    outerSpeeeed = true;
    setTimeout(() => {
      worldspin.resetSpeed();
      isKeyDisabled[keycode] = false;
      outerSpeeeed = false;
    }, 5000);
  }
};

export const calcAcc = (delta: number) => {
  const acce = [0, 0, 0];

  const accDelta = normalizeSpeed(accerate, delta);

  // https://www.toptal.com/developers/keycode/for/s
  if (isKeyDown[87]) {
    // w
    acce[2] += accDelta;
  }
  if (isKeyDown[83]) {
    // s
    acce[2] -= accDelta;
  }
  if (isKeyDown[65]) {
    // a
    acce[0] += accDelta;
  }
  if (isKeyDown[68]) {
    // d
    acce[0] -= accDelta;
  }
  if (isKeyDown[81]) {
    // q
    acce[1] += accDelta;
  }
  if (isKeyDown[69]) {
    // e
    acce[1] -= accDelta;
  }

  return acce;
};

export const calcSpeed = (
  curSpeed: number[],
  acce: number[],
  curPosition: THREE.Vector3,
  delta: number
) => {
  const decDelta = normalizeSpeed(decerate, delta);

  let newSpeed = [...curSpeed];
  for (let axis = 0; axis <= 2; axis++) {
    const axisSpeed = newSpeed[axis];
    const curAcce = acce[axis];
    if (curAcce !== 0) {
      let axisNewSpeed = axisSpeed + curAcce;
      axisNewSpeed = Math.min(axisNewSpeed, maxSpeed);
      axisNewSpeed = Math.max(axisNewSpeed, -maxSpeed);
      newSpeed[axis] = axisNewSpeed;
      continue;
    }
    if (axisSpeed === 0) {
      continue;
    }
    if (axisSpeed < 0) {
      const axisNewSpeed = Math.min(axisSpeed + decDelta, 0);
      newSpeed[axis] = axisNewSpeed;
    } else if (axisSpeed > 0) {
      const axisNewSpeed = Math.max(axisSpeed - decDelta, 0);
      newSpeed[axis] = axisNewSpeed;
    }
  }

  const newPosition = [
    curPosition.x + newSpeed[0],
    curPosition.y + newSpeed[1],
    curPosition.z + newSpeed[2],
  ].map((pos, idx) =>
    fixInRange(pos, [
      defaultPosition[idx] - maxReach[idx],
      defaultPosition[idx] + maxReach[idx],
    ])
  );

  const mixerSpeed = 1 + newSpeed[2] * 8;

  return {
    newPosition: new THREE.Vector3(...newPosition),
    newSpeed,
    mixerSpeed,
  };
};

export const onKeyHandler = (e: KeyboardEvent) => {
  if (accumulateKeys.includes(e.keyCode)) {
    updateKeyDown(e.keyCode, e.type === "keydown");
  } else {
    handleKeyDown(e.keyCode, e.type === "keydown");
  }
};

export const updateOuterLight = (flag: boolean) => {
  outerShowLight = flag;
};
