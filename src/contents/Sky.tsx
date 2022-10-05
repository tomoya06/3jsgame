import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import Cloud from "../models/generator/cloud";
import worldspin from "../system/worldspin";

const radius = 1000,
  width = 140,
  degDelta = 2,
  heightRange = 10,
  widthDelta = width / 5;

interface CloudConfig {
  pos: THREE.Vector3;
  rot: THREE.Euler;
}

export default function Sky() {
  const myMesh = useRef<THREE.Group>(null);

  const cloudConfigs = useMemo(() => {
    const output: CloudConfig[] = [];
    for (let i = 0; i < 360; i += degDelta) {
      const curDeg = THREE.MathUtils.degToRad(i);

      const cloudCnt = Math.floor(Math.random() * widthDelta);
      const positions = new Set(
        Array(cloudCnt)
          .fill(1)
          .map((_) => Math.floor(Math.random() * width))
      );

      [...positions].forEach((pos) => {
        const x = pos;

        // 角度再加一点随机偏移 防止看起来在排队- -
        const rotateX =
          curDeg + (Math.random() * heightRange * 2 - heightRange);
        const radiusH = radius + (Math.random() * 20 - 10);
        const z = radiusH * Math.sin(rotateX),
          y = radiusH * Math.cos(rotateX);

        output.push({
          pos: new THREE.Vector3(x, y, z),
          rot: new THREE.Euler(rotateX, 0.5 * Math.PI, 0),
        });
      });
    }

    return output;
  }, []);

  useFrame(() => {
    if (!myMesh.current) {
      return;
    }
    myMesh.current.rotation.x -= 0.00005 * worldspin.speed;
  });

  return (
    <group ref={myMesh} position={[-(width / 3), 2 - radius, 0]}>
      {cloudConfigs.map((_config) => (
        <Cloud
          key={`cld_${JSON.stringify(_config)}`}
          position={_config.pos}
          rotation={_config.rot}
        ></Cloud>
      ))}
    </group>
  );
}
