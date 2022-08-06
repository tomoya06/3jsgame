import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import timeSystem, { TimeProgressType } from "../system/time";
import { fixInRange } from "../utils/number";
import mj from "number-precision";
import { colord } from "colord";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { getColorGradientByIndex } from "../utils/skycolor";

const radius = 60,
  centerPos = [0, 0, 0],
  trackB = 120,
  trackA = 300,
  trackOffset = [200, -140, 0],
  hideHeight = -300;

interface LightGroup {
  ambient: THREE.Light;
  nightAmb: THREE.Light;
  main: THREE.Light;
  night: THREE.Light;
  defaultAmb: THREE.Light;
}

type TimePositionType = ReturnType<typeof curTimeToPosition>;

const curTimeToPosition = (time: TimeProgressType) => {
  const { sunPercent: percent } = time;
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

const initLight = (scene: THREE.Scene) => {
  const ambient = new THREE.AmbientLight(0xdedede);
  const nightAmb = new THREE.AmbientLight(0x7590bf);
  const defaultAmb = new THREE.AmbientLight(0x98bdfa, 0.3);

  const main = new THREE.DirectionalLight(0xc9c3a7);
  main.position.set(0, 0, 0).normalize();

  const night = new THREE.DirectionalLight(0x141037);
  night.position.set(0, 0, 0).normalize();

  const output = {
    ambient,
    nightAmb,
    defaultAmb,
    main,
    night,
  };

  Object.values(output).forEach((light) => scene.add(light));

  return output;
};

let lights: LightGroup;

const animateLight = (position: TimePositionType, scene: THREE.Scene) => {
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
  lights[lightKey].position.set(0, position.y, position.x).normalize();
  lights[lightKey].intensity = mj.times(position.heightPercent, 0.6);
  lights[subKey].intensity = 0;

  lights[lightAmb].intensity = mj.times(position.heightPercent, 0.6);
  lights[subAmb].intensity = 0;

  if (scene.fog) {
    scene.fog.color = new THREE.Color(
      getColorGradientByIndex(position.hour).toHex()
    );
  }
};

export default function Orbit() {
  const sunRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    lights = initLight(scene);
  }, [scene]);

  useFrame((state) => {
    if (!sunRef.current || !moonRef.current) {
      return;
    }
    const position = curTimeToPosition(timeSystem.time);

    if (position.isNight) {
      // moonRef.current.position.x = position.x + trackOffset[0];
      // moonRef.current.position.y = position.y + trackOffset[1];
      // moonRef.current.position.z = position.z + trackOffset[2];
      sunRef.current.position.y = hideHeight;
    } else {
      sunRef.current.position.x = position.x + trackOffset[0];
      sunRef.current.position.y = position.y + trackOffset[1];
      sunRef.current.position.z = position.z + trackOffset[2];
      moonRef.current.position.y = hideHeight;
    }

    animateLight(position, state.scene);
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <meshPhongMaterial
          color={0xedeb27}
          flatShading={true}
          specular={0xffffff}
          fog={false}
        />
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
    </group>
  );
}
