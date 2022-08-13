import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Sky from "./contents/Sky";
import Plane from "./contents/Plane";
import Ground from "./contents/Ground";
import { TimeSystemControls } from "./system/time";
import Orbit from "./contents/Orbit";
import Space from "./contents/Space";
import { OrbitControls, Stats } from "@react-three/drei";
import StarSky from "./contents/StarSky";
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { useState } from "react";
import CameraCtrl from "./contents/CameraCtrl";

function App() {
  const [sunCur, setSunCur] = useState<THREE.Mesh | null>(null);
  const [blur, setBlur] = useState(0.1);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        style={{ zIndex: 2 }}
        camera={{ position: [-40, 10, 0], far: 400, fov: 50, near: 1 }}
      >
        <fog attach="fog" args={[0xf7d9aa, 80, 240]} />

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
        <TimeSystemControls />
        <Stats />
        <CameraCtrl />
      </Canvas>
      <Space />
    </div>
  );
}

export default App;
