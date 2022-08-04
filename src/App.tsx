import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import Sky from "./contents/Sky";
import Plane from "./contents/Plane";

function Controls() {
  return useFrame(({ camera }) => {
    camera.lookAt(0, 0, 0);
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
        <primitive object={new THREE.AxesHelper(10)}></primitive>
        <Controls />
      </Canvas>
    </div>
  );
}

export default App;
