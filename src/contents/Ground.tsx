import * as THREE from "three";
import { ThreeElements, useFrame } from "@react-three/fiber";
import * as React from "react";
import Tree from "../assets/generator/tree";
import { Euler, Vector3 } from "three";

const radius = 1000,
  width = 200,
  degDelta = 2,
  widthDelta = width / 5;

export default function Ground() {
  const groudRef = React.useRef<THREE.Group>(null);

  const trees = React.useMemo(() => {
    const output: { pos: Vector3; rotx: Euler; key: string }[] = [];
    for (let i = 0; i < 360; i += degDelta) {
      const curDeg = THREE.MathUtils.degToRad(i);

      const treeCnt = Math.floor(Math.random() * widthDelta);
      const positions = new Set(
        Array(treeCnt)
          .fill(1)
          .map((_) => Math.floor(Math.random() * width))
      );

      [...positions].forEach((pos) => {
        const x = pos;

        const rotateX = curDeg + (Math.random() * degDelta - degDelta / 2);
        const rotateY = Math.random() * 0.2 * Math.PI;
        const radiusH = radius;
        const z = radiusH * Math.sin(rotateX),
          y = radiusH * Math.cos(rotateX);

        output.push({
          key: `tree_${x}_${y}_${z}`,
          pos: new Vector3(x, y, z),
          rotx: new Euler(rotateX, rotateY, 0),
        });
      });
    }
    return output;
  }, []);

  useFrame(() => {
    if (groudRef.current) {
      groudRef.current.rotation.x -= 0.00001;
    }
  });

  return (
    <group position={[-(width / 3), -10 - radius, 0]} ref={groudRef}>
      {trees.map((treeConf) => (
        <Tree
          key={`${treeConf.key}`}
          position={treeConf.pos}
          rotation={treeConf.rotx}
        />
      ))}
      <mesh position={[width / 2, 0, 0]} rotation={[0, 0, 0.5 * Math.PI]}>
        <cylinderGeometry args={[radius, radius, width, radius * 2]} />
        <meshPhongMaterial color={0x6f9e72}></meshPhongMaterial>
      </mesh>
    </group>
  );
}
