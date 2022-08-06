import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import timeSystem, { TimeProgressType } from "../system/time";
import { fixInRange } from "../utils/number";
import mj from "number-precision";
import { colord } from "colord";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

const radius = 20,
  centerPos = [0, 0, 0],
  trackB = 120,
  trackA = 300,
  trackOffset = [200, -100, 0],
  hideHeight = -300;

const sunAmbColor = 0xdedede,
  nightAmbColor = 0x7590bf,
  idleAmbColor = 0x98bdfa,
  sunDirColor = 0xc9c3a7,
  nightDirColor = 0x141037,
  fogColor = 0xf7d9aa;

type TimePositionType = ReturnType<typeof curTimeToPosition>;

const curTimeToPosition = (time: TimeProgressType) => {
  const { percent } = time;
  let z = mj.times(fixInRange(2 * percent - 1, [-1, 1]), trackA);
  let y = mj.times(
    Math.sqrt(mj.minus(1, mj.divide(mj.times(z, z), mj.times(trackA, trackA)))),
    trackB
  );

  return {
    z,
    y,
    x: 0,
    ...time,
  };
};

export default function Orbit() {
  const sunRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const mainAmbRef = useRef<THREE.AmbientLight>(null);

  const [ambIndensity, setAmbIndencity] = useState(0);
  const [dirColor, setDirColor] = useState(sunDirColor);
  const [dirIndensity, setDirIndensity] = useState(0);

  useFrame((state) => {
    if (!sunRef.current || !moonRef.current || !mainAmbRef.current) {
      return;
    }
    const position = curTimeToPosition(timeSystem.time);

    if (position.isNight) {
      moonRef.current.position.x = position.x + trackOffset[0];
      moonRef.current.position.y = position.y + trackOffset[1];
      moonRef.current.position.z = position.z + trackOffset[2];
      sunRef.current.position.y = hideHeight;
    } else {
      sunRef.current.position.x = position.x + trackOffset[0];
      sunRef.current.position.y = position.y + trackOffset[1];
      sunRef.current.position.z = position.z + trackOffset[2];
      moonRef.current.position.y = hideHeight;
    }

    if (position.isNight) {
      mainAmbRef.current.color = new THREE.Color(nightAmbColor);
    } else {
      mainAmbRef.current.color = new THREE.Color(sunAmbColor);
    }
    setAmbIndencity(mj.times(position.heightPercent, 1));

    if (position.isNight) {
      setDirColor(sunDirColor);
    } else {
      setDirColor(nightDirColor);
    }
    dirRef.current?.position.set(0, position.y, position.z).normalize();
    setDirIndensity(mj.times(position.heightPercent, 1));

    if (state.scene.fog) {
      if (position.isNight) {
        state.scene.fog.color = new THREE.Color(
          colord("#311f57")
            .darken(1 - position.heightPercent)
            .toHex()
        );
      } else {
        state.scene.fog.color = new THREE.Color(
          colord("#f7d9aa")
            .darken(1 - position.heightPercent)
            .toHex()
        );
      }
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <meshPhongMaterial color={0xedeb27} flatShading={true} fog={true} />
        <octahedronGeometry args={[radius, 6]} />
      </mesh>
      <mesh ref={moonRef}>
        <meshPhongMaterial
          color={0x7b76ae}
          flatShading={true}
          fog={false}
          specular={0xffffff}
        />
        <octahedronGeometry args={[radius, 6]} />
      </mesh>
      <ambientLight key="mainAmb" ref={mainAmbRef} intensity={ambIndensity} />
      <directionalLight
        key="mainDir"
        ref={dirRef}
        color={dirColor}
        intensity={dirIndensity}
      />
      <ambientLight key="idleAmb" color={idleAmbColor} intensity={0.2} />
      <directionalLight key="orbitDir" />
    </group>
  );
}
