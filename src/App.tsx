import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Sky from "./contents/Sky";
import Plane from "./contents/Plane";
import Ground from "./contents/Ground";
import timeSystem, { TimeSystemControls } from "./system/time";
import Orbit from "./contents/Orbit";
import Space from "./contents/Space";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useControls } from "leva";

function Controls() {
  return useFrame(({ camera }) => {
    camera.lookAt(200, 0, 0);
  });
}

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ zIndex: 2 }}>
        <fog attach="fog" args={[0xf7d9aa, 80, 240]} />

        <PerspectiveCamera
          makeDefault
          position={[100, 10, 0]}
          near={1}
          far={400}
          fov={50}
        />
        <Sky />
        <Plane />
        <Ground />
        <Orbit />
        <primitive object={new THREE.AxesHelper(10)}></primitive>
        <OrbitControls />
        <Controls />
        <TimeSystemControls />
      </Canvas>
      <Space />
    </div>
  );
}

export default App;
