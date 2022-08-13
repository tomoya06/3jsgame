import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Sky from "./contents/Sky";
import Plane from "./contents/Plane";
import Ground from "./contents/Ground";
import timeSystem, { TimeSystemControls } from "./system/time";
import Orbit from "./contents/Orbit";
import Space from "./contents/Space";
import {
  CameraShake,
  OrbitControls,
  PerspectiveCamera,
  Stats,
} from "@react-three/drei";
import { useControls } from "leva";
import StarSky from "./contents/StarSky";
import {
  DepthOfField,
  EffectComposer,
  GodRays,
} from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { useKeyCtrl } from "./system/keyctrl";

function Controls() {
  return useFrame(({ camera }) => {
    camera.lookAt(0, 0, 0);
  });
}

function App() {
  const [sunCur, setSunCur] = useState<THREE.Mesh | null>(null);
  const [blur, setBlur] = useState(0.1);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ zIndex: 2 }}>
        <fog attach="fog" args={[0xf7d9aa, 80, 240]} />

        <PerspectiveCamera
          makeDefault
          near={1}
          position={[-40, 10, 0]}
          far={400}
          fov={50}
        />
        <Sky />
        <Plane />
        <Ground />
        <StarSky />
        <Orbit
          ref={(node) => {
            setSunCur(node);
            setBlur(0);
          }}
        />

        <EffectComposer>
          {sunCur ? (
            <GodRays sun={sunCur} decay={0.8} exposure={1} blur={blur} />
          ) : (
            <></>
          )}
        </EffectComposer>
        {/* <primitive object={new THREE.AxesHelper(10)}></primitive> */}
        <OrbitControls />
        <Controls />
        <TimeSystemControls />
        <Stats />
      </Canvas>
      <Space />
    </div>
  );
}

export default App;
