import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Sky from "./contents/Sky";
import Plane from "./contents/Plane";
import Ground from "./contents/Ground";
import timeSystem from "./system/time";
import Orbit from "./contents/Orbit";
import Space from "./contents/Space";
import { PerspectiveCamera } from "@react-three/drei";

function Controls() {
  return useFrame(({ camera }) => {
    camera.lookAt(0, 0, 0);
  });
}

function TimeSystemControls() {
  return useFrame(() => {
    timeSystem.animate();
  });
}

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <fog attach="fog" args={[0xf7d9aa, 80, 200]} />

        <PerspectiveCamera
          makeDefault
          position={[-40, 10, 0]}
          near={1}
          far={400}
          fov={50}
        />
        <Sky />
        <Plane />
        <Ground />
        <Orbit />
        <Space />
        <primitive object={new THREE.AxesHelper(10)}></primitive>
        <Controls />
        <TimeSystemControls />
      </Canvas>
    </div>
  );
}

export default App;
