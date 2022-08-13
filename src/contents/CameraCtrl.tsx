import { CameraShake } from "@react-three/drei";
import { useState } from "react";
import { useKeyCtrl } from "../system/keyctrl";

// TODO: 这里平稳地切换
export default function CameraCtrl() {
  const [, isSpeeeed] = useKeyCtrl();
  const [freq, setFreq] = useState(0);

  return (
    <>
      <CameraShake
        maxYaw={0.004}
        maxRoll={0.04}
        maxPitch={0.04}
        yawFrequency={freq}
        rollFrequency={freq}
        pitchFrequency={freq}
      />
    </>
  );
}
