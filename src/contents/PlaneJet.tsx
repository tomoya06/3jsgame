import { ThreeElements, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { randomInRange } from "../utils/number";
import { animate } from "../utils/animate";

export default function PlaneJet(
  props: ThreeElements["group"] & {
    count: number;
  }
) {
  const { count } = props;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const triggerAnimate = useCallback((i: number) => {
    dummy.position.set(0, 0, 0);
    dummy.scale.set(0, 0, 0);
    dummy.updateMatrix();
    mesh.current?.setMatrixAt(i, dummy.matrix);

    const target = {
      x: randomInRange(-0.4, 0.4),
      y: randomInRange(-0.4, 0.4),
      z: -10,
      rotZ: randomInRange(Math.PI * 0.3, Math.PI * 0.5),
      scale: randomInRange(0.9, 1),
    };

    new TWEEN.Tween({
      x: 0,
      y: 0,
      z: 0,
      rotZ: 0,
      scale: 0,
    })
      .to(target, 1000)
      .delay(i * 10)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate((props) => {
        dummy.position.set(props.x, props.y, props.z);
        dummy.scale.set(props.scale, props.scale, props.scale);
        dummy.rotateZ(props.rotZ);
        dummy.updateMatrix();
        if (mesh.current) {
          mesh.current.setMatrixAt(i, dummy.matrix);
          mesh.current.instanceMatrix.needsUpdate = true;
        }
      })
      .onComplete(() => {
        dummy.position.set(0, 0, 0);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.current?.setMatrixAt(i, dummy.matrix);
        triggerAnimate(i);
      })
      .start();
  }, []);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      triggerAnimate(i);
    }
    animate();
  }, [count]);

  return (
    <group {...props}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry
          attach="geometry"
          args={[undefined, 5, 5]}
        ></sphereGeometry>
        <meshLambertMaterial
          attach="material"
          color={0x696969}
        ></meshLambertMaterial>
      </instancedMesh>
    </group>
  );
}
