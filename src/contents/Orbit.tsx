import { forwardRef, Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import timeSystem, { TimeProgressType } from "../system/time";
import { fixInRange } from "../utils/number";
import mj from "number-precision";
import { colord } from "colord";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { getColorGradientByIndex } from "../utils/skycolor";
import {
  EffectComposer,
  GodRays,
  Bloom,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize, Resolution } from "postprocessing";
import { useControls } from "leva";

// TODO: GOD RAY FOR SUN
const radius = 4,
  centerPos = [0, 0, 0],
  trackB = 180,
  trackA = 300,
  trackOffset = [300, -140, 0],
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
    let fogColor = colord("#e1c45e")
      .darken(1 - position.heightPercent)
      .toHex();
    if (position.isNight) {
      fogColor = colord("#2F1107").darken(0.8).toHex();
    }
    scene.fog.color = new THREE.Color(fogColor);
  }
};

const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);

  const { value: sunColor } = useControls("sun color", { value: "#ffffff" });

  const { exposure, decay, blur } = useControls("PostProcessing - GodRays", {
    exposure: {
      value: 1,
      min: 0,
      max: 1,
    },
    decay: {
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.1,
    },
    blur: {
      value: 0,
      min: 0,
      max: 1,
    },
  });

  return (
    <Suspense fallback={null}>
      <mesh ref={sunRef}>
        <octahedronGeometry args={[radius, 6]} />
        <meshBasicMaterial color={sunColor} />
      </mesh>
      {sunRef.current && (
        <EffectComposer>
          <GodRays
            sun={sunRef.current}
            decay={decay}
            exposure={exposure}
            blur={blur}
          />
        </EffectComposer>
      )}
    </Suspense>
  );
};

export default function Orbit() {
  const groupRef = useRef<THREE.Group>(null);

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    lights = initLight(scene);
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }
    const position = curTimeToPosition(timeSystem.time);

    if (position.isNight) {
      groupRef.current.position.y = hideHeight;
    } else {
      groupRef.current.position.x = position.x + trackOffset[0];
      groupRef.current.position.y = position.y + trackOffset[1];
      groupRef.current.position.z = position.z + trackOffset[2];
    }

    animateLight(position, state.scene);
    state.camera.updateProjectionMatrix();
  });

  return (
    <group ref={groupRef}>
      <Sun />
    </group>
  );
}
