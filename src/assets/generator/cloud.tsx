import { ThreeElements } from "react-three-fiber";
import * as THREE from "three";

const cloudGeo = new THREE.DodecahedronGeometry(1, 0);
const cloudMat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  flatShading: true,
});

function CloudBlock(props: ThreeElements["mesh"]) {
  const scale = 0.2 + Math.random() * 1.3;
  const rotz = Math.random() * Math.PI * 2;
  const roty = Math.random() * Math.PI * 2;

  return (
    <mesh
      {...props}
      visible
      geometry={cloudGeo}
      material={cloudMat}
      rotation={new THREE.Euler(0, roty, rotz)}
      scale={new THREE.Vector3(scale, scale, scale)}
    ></mesh>
  );
}

export default function Cloud(props: ThreeElements["group"]) {
  const nBlocs = 3 + Math.floor(Math.random() * 3);
  const blocsPos = Array(nBlocs)
    .fill(0)
    .map((_, i) => ({
      x: i,
      y: Math.random() * 0.4,
      z: Math.random() * 0.4,
    }));

  return (
    <group {...props}>
      {blocsPos.map(({ x, y, z }) => (
        <CloudBlock
          key={`cb_${x}_${y}_${z}`}
          position={new THREE.Vector3(x, y, z)}
        ></CloudBlock>
      ))}
    </group>
  );
}
