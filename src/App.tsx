import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Sky from "./contents/Sky";
import Plane from "./contents/Plane";
import Ground from "./contents/Ground";
import timeSystem from "./system/time";

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
      <Canvas
        camera={{
          position: [-10, 0, 0],
        }}
      >
        <ambientLight color={0xffffff} />
        <pointLight position={[10, 10, 10]} />
        <Sky />
        <Plane />
        <Ground />
        <primitive object={new THREE.AxesHelper(10)}></primitive>
        <Controls />
        <TimeSystemControls />
      </Canvas>
    </div>
  );
}

export default App;
