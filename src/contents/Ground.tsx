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

interface IVertices {
  [index: string]: {
    x: number;
    y: number;
    z: number;
  };
}

function GroundMesh() {
  const groudMeshRef = React.useRef<THREE.Mesh>(null);
  const treeGroupRef = React.useRef<THREE.Group>(null);
  const trees = React.useMemo(() => {
    const output: { rot: Euler; pos: Vector3; key: string }[] = [];

    if (!groudMeshRef.current) {
      return output;
    }

    const positionAttribute =
      groudMeshRef.current.geometry.getAttribute("position");
    const point = new Vector3();
    const visited = new Set();
    const quaternion = new THREE.Quaternion();

    // https://stackoverflow.com/a/67865461/8356786
    // Go thru all points and collect points on same vertex with a hashmap
    for (let i = 0; i < positionAttribute.count; i += 0) {
      point.fromBufferAttribute(positionAttribute, i);

      const key = [point.x, point.y, point.z].join(",");
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);
      const pos = new Vector3(point.x, point.y, point.z);
      const rot = new Euler();
      output.push({
        key,
        pos,
        rot,
      });

      i += Math.floor(Math.random() * 200 + 300);
    }

    return output;
  }, [groudMeshRef.current]);

  React.useEffect(() => {
    if (!treeGroupRef.current) {
      return;
    }

    treeGroupRef.current.children.forEach((obj) => {
      obj.lookAt(...groundCenter);
    });
  }, [treeGroupRef.current?.children]);

  return (
    <>
      <mesh rotation={[0, 0, 0.5 * Math.PI]} ref={groudMeshRef}>
        <sphereGeometry args={[radius, radius / 4, radius / 4]} />
        <meshPhongMaterial color={0x6f9e72}></meshPhongMaterial>
      </mesh>

      <group ref={treeGroupRef}>
        {trees.map((treeConf) => (
          <Tree key={`${treeConf.key}`} position={treeConf.pos}></Tree>
        ))}
      </group>
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
