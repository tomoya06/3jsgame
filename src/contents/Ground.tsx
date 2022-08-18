import * as THREE from "three";
import { ThreeElements, useFrame } from "@react-three/fiber";
import * as React from "react";
import Tree from "../assets/generator/tree";
import { Euler, Quaternion, Vector3 } from "three";
import worldspin from "../system/worldspin";

const radius = 1000,
  width = 200,
  degDelta = 2,
  widthDelta = width / 5;
const groundCenter: [number, number, number] = [-(width / 3), -10 - radius, 0];
// const groundCenter: [number, number, number] = [0, 0, 0];

interface IVertices {
  [index: string]: {
    x: number;
    y: number;
    z: number;
  };
}

function GroundMesh() {
  const groudMeshRef = React.useRef<THREE.Mesh>(null);

  const trees = React.useMemo(() => {
    const output: { rot: Euler; pos: Vector3; key: string }[] = [];

    if (!groudMeshRef.current) {
      return output;
    }

    const count = Math.floor(Math.random() * radius * 4);
    const vec3 = new Vector3();

    for (let i = 0; i < count; i++) {
      const phi = Math.random() * 2 * Math.PI;
      const theta = Math.random() * 2 * Math.PI;
      const pos = vec3.setFromSphericalCoords(radius, phi, theta).clone();
      const rot = new Euler(phi, 0, theta);

      output.push({
        key: `tree_${i}`,
        pos,
        rot,
      });
    }

    return output;
  }, [groudMeshRef.current]);

  return (
    <>
      <mesh rotation={[0, 0, 0.5 * Math.PI]} ref={groudMeshRef}>
        <sphereGeometry args={[radius, radius / 4, radius / 4]} />
        <meshPhongMaterial color={0x6f9e72}></meshPhongMaterial>
      </mesh>

      {trees.map((treeConf) => (
        <Tree
          key={`${treeConf.key}`}
          position={treeConf.pos}
          rotation={treeConf.rot}
        ></Tree>
      ))}
    </>
  );
}

export default function Ground() {
  const groudRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (groudRef.current) {
      groudRef.current.rotation.x -= 0.00002 * worldspin.speed;
    }
  });

  return (
    <group position={groundCenter} ref={groudRef}>
      <GroundMesh />
    </group>
  );
}
