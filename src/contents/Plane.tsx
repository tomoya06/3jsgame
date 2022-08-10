import { useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SpotLight, useAnimations, useGLTF } from "@react-three/drei";
import { fixInRange, normalizeSpeed } from "../utils/number";
import timeSystem, { useTimeSystem } from "../system/time";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const planeSize = 2;
const planeHeight = 0;

const decerate = 0.002;
const accerate = 0.004;
const maxSpeed = 0.1;
const maxReach = [50, 20, 20];

const defaultPosition = [0, planeHeight, 0];

const accumulateKeys = [87, 83, 65, 68, 81, 69];

let outerShowLight = false;
const isKeyDown: boolean[] = Array(255).fill(false);

const updateKeyDown = (keycode: number, flag: boolean) => {
  isKeyDown[keycode] = flag;
};

const handleKeyDown = (keycode: number, flag: boolean) => {
  if (!flag) {
    return;
  }

  if (keycode === 76) {
    outerShowLight = !outerShowLight;
  }
};

const calcAcc = (delta: number) => {
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

const calcSpeed = (
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

export default function Plane() {
  const [speed, setSpeed] = useState([0, 0, 0]);
  const [position, setPosition] = useState(
    new THREE.Vector3(...defaultPosition)
  );
  const [showLight, setLight] = useState(outerShowLight);
  const [ts] = useTimeSystem();

  const rotation = useMemo(() => {
    const rotateZ = speed[0] * 4 * THREE.MathUtils.degToRad(-90);
    const rotateX = speed[1] * 2 * THREE.MathUtils.degToRad(-90);

    return new THREE.Euler(rotateX, 0, rotateZ);
  }, [speed]);

  const gltf = useGLTF("src/assets/models/cartoon_plane/scene.gltf");
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf]);

  useEffect(() => {
    gltf.scene.scale.set(planeSize, planeSize, planeSize);
    mixer.clipAction(gltf.animations[0]).play();
  }, []);

  useEffect(() => {
    onkeydown = onkeyup = (e) => {
      if (accumulateKeys.includes(e.keyCode)) {
        updateKeyDown(e.keyCode, e.type === "keydown");
      } else {
        handleKeyDown(e.keyCode, e.type === "keydown");
      }
    };
  }, []);

  const lightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    lightRef.current?.target.position.set(
      position.x,
      position.y + 10 * Math.sin(-rotation.x),
      position.z + 10 * Math.cos(-rotation.x)
    );
  }, [lightRef, position, rotation]);

  useFrame((state, delta) => {
    const acce = calcAcc(delta);
    const { newPosition, newSpeed, mixerSpeed } = calcSpeed(
      speed,
      acce,
      position,
      delta
    );
    setPosition(newPosition);
    setSpeed(newSpeed);
    mixer.update(delta * mixerSpeed);

    // setLight 建立与 react 的桥梁
    setLight(outerShowLight);
  });

  useEffect(() => {
    outerShowLight = ts.isNight;
  }, [ts.isNight]);

  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <primitive object={gltf.scene}></primitive>
      </Suspense>
      <SpotLight
        penumbra={1}
        angle={0.2}
        attenuation={10}
        intensity={10}
        distance={10}
        scale={showLight ? 1 : 0}
        anglePower={2}
        color="#ffe28a"
        position={[0, -0.2, 2]}
        ref={lightRef}
      />
    </group>
  );
}
