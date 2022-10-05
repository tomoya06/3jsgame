import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SpotLight, useGLTF } from "@react-three/drei";
import { useTimeSystem } from "../system/time";
import {
  calcAcc,
  calcSpeed,
  defaultPosition,
  onKeyHandler,
  updateOuterLight,
  useKeyCtrl,
} from "../system/keyctrl";
import PlaneJet from "./PlaneJet";
import { useControls } from "leva";

const planeSize = 2;

export default function Plane() {
  const [speed, setSpeed] = useState([0, 0, 0]);
  const [position, setPosition] = useState(
    new THREE.Vector3(...defaultPosition)
  );
  const [showLight] = useKeyCtrl();
  const tailRef = useRef<THREE.Mesh>(null);
  const [ts] = useTimeSystem();

  const rotation = useMemo(() => {
    const rotateZ = speed[0] * 4 * THREE.MathUtils.degToRad(-90);
    const rotateX = speed[1] * 2 * THREE.MathUtils.degToRad(-90);

    return new THREE.Euler(rotateX, 0, rotateZ);
  }, [speed]);

  const tailPosition = useMemo(() => {
    const tp = new THREE.Vector3();
    tailRef.current?.getWorldPosition(tp);
    return tp;
  }, [position]);

  useControls("Controls", {
    "wsad: movement": {
      value: true,
    },
    "q/e: forward/backward": {
      value: true,
    },
    "l: light": {
      value: true,
    },
    "p: boost": {
      value: true,
    },
  });

  const gltf = useGLTF(
    "https://tomoya06.github.io/3jsgame/assets/cartoon_plane/scene.gltf"
  );
  const mixer = useMemo(() => new THREE.AnimationMixer(gltf.scene), [gltf]);

  useEffect(() => {
    gltf.scene.scale.set(planeSize, planeSize, planeSize);
    mixer.clipAction(gltf.animations[0]).play();
  }, []);

  useEffect(() => {
    onkeydown = onkeyup = (e) => {
      onKeyHandler(e);
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
  });

  useEffect(() => {
    updateOuterLight(ts.isNight);
  }, [ts.isNight]);

  return (
    <>
      <group position={position} rotation={rotation}>
        <Suspense fallback={null}>
          <primitive object={gltf.scene}></primitive>
        </Suspense>
        <mesh ref={tailRef} position={[0, 0, -1.2]}></mesh>
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
      <group position={tailPosition}>
        <PlaneJet position={[0, -0.2, 0]} />
      </group>
    </>
  );
}
