import * as THREE from "three";
import React, { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import Cloud from "./assets/generator/cloud";
import Sky from "./contents/Sky";

function Controls() {
  return useFrame(({camera}) => {
    camera.lookAt(0, 0, 0);
  })
}

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{
          position: [10, 10, 10],
        }}
      >
        <ambientLight color={0xffffff} />
        <pointLight position={[10, 10, 10]} />
        <Sky></Sky>
        <primitive object={new THREE.AxesHelper(10)}></primitive>
        <Controls />
      </Canvas>
    </div>
  );
}

export default App;
