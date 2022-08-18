import * as THREE from "three";
import { ThreeElements } from "@react-three/fiber";
import * as React from "react";

const scale = 0.02;

export default function Tree(props: ThreeElements["group"]) {
  const matTreeLeaves = React.useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: 0x32a852,
      flatShading: true,
    });
  }, []);

  return (
    <group>
      <group scale={[scale, scale, scale]} rotation={[0, 0, 0]} {...props}>
        {/* <mesh>
          <meshBasicMaterial color={0x614719}></meshBasicMaterial>
          <boxGeometry args={[10, 20, 10]}></boxGeometry>
        </mesh> */}
        <mesh material={matTreeLeaves} position={[0, 20, 0]}>
          <cylinderGeometry args={[1, 12 * 3, 12 * 3, 4]}></cylinderGeometry>
        </mesh>
        <mesh material={matTreeLeaves} position={[0, 40, 0]}>
          <cylinderGeometry args={[1, 9 * 3, 9 * 3, 4]}></cylinderGeometry>
        </mesh>
        <mesh material={matTreeLeaves} position={[0, 55, 0]}>
          <cylinderGeometry args={[1, 6 * 3, 6 * 3, 4]}></cylinderGeometry>
        </mesh>
      </group>
    </group>
  );
}
