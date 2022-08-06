import { useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SpotLight, useAnimations, useGLTF } from "@react-three/drei";
import { fixInRange } from "../utils/number";
import timeSystem from "../system/time";

const planeSize = 2;
const planeHeight = 0;

const decerate = 0.002;
const accerate = 0.004;
const maxSpeed = 0.1;
const maxReach = [50, 20, 20];

const defaultPosition = [0, planeHeight, 0];

const calcAcc = (isKeyDown: boolean[]) => {
  const acce = [0, 0, 0];

  // https://www.toptal.com/developers/keycode/for/s
  if (isKeyDown[87]) {
    // w
    acce[2] += accerate;
  }
  if (isKeyDown[83]) {
    // s
    acce[2] -= accerate;
  }
  if (isKeyDown[65]) {
    // a
    acce[0] += accerate;
  }
  if (isKeyDown[68]) {
    // d
    acce[0] -= accerate;
  }
  if (isKeyDown[81]) {
    // q
    acce[1] += accerate;
  }
  if (isKeyDown[69]) {
    // e
    acce[1] -= accerate;
  }

  return acce;
};

const calcSpeed = (
  curSpeed: number[],
  acce: number[],
  curPosition: THREE.Vector3
) => {
  const newSpeed = [...curSpeed];
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
      const axisNewSpeed = Math.min(axisSpeed + decerate, 0);
      newSpeed[axis] = axisNewSpeed;
    } else if (axisSpeed > 0) {
      const axisNewSpeed = Math.max(axisSpeed - decerate, 0);
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
  const [isKeyDown, setKeyDown] = useState<boolean[]>(Array(255).fill(false));
  const [speed, setSpeed] = useState([0, 0, 0]);
  const [position, setPosition] = useState(
    new THREE.Vector3(...defaultPosition)
  );
  const [showLight, setLight] = useState(false);

  const rotation = useMemo(() => {
    const rotateZ = speed[0] * 4 * THREE.MathUtils.degToRad(-90);
    const rotateX = speed[1] * 2 * THREE.MathUtils.degToRad(-90);

    return new THREE.Euler(rotateX, 0, rotateZ);
  }, [speed]);

  const updateKeyDown = (keycode: number, flag: boolean) => {
    const newKeyDown = [...isKeyDown];
    newKeyDown[keycode] = flag;
    setKeyDown(newKeyDown);
  };

  const gltf = useGLTF("src/assets/models/cartoon_plane/scene.gltf");
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf]);

  useEffect(() => {
    gltf.scene.scale.set(planeSize, planeSize, planeSize);
    mixer.clipAction(gltf.animations[0]).play();
  }, []);

  useEffect(() => {
    onkeydown = onkeyup = (e) => {
      updateKeyDown(e.keyCode, e.type === "keydown");
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
    const acce = calcAcc(isKeyDown);
    const { newPosition, newSpeed, mixerSpeed } = calcSpeed(
      speed,
      acce,
      position
    );
    setPosition(newPosition);
    setSpeed(newSpeed);
    mixer.update(delta * mixerSpeed);
  });

  useFrame(() => {
    const { isNight } = timeSystem.time;
    setLight(isNight);
  });

  return (
    <group position={position} rotation={rotation}>
      <Suspense fallback={null}>
        <primitive object={gltf.scene}></primitive>
      </Suspense>
      {showLight && (
        <SpotLight
          penumbra={1}
          angle={0.2}
          attenuation={10}
          intensity={10}
          distance={10}
          anglePower={2}
          color="#ffe28a"
          position={[0, -0.2, 2]}
          ref={lightRef}
        />
      )}
    </group>
  );
}
