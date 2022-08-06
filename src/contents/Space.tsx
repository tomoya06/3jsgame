import { useFrame } from "@react-three/fiber";
import { colord } from "colord";
import timeSystem, { TimeProgressType } from "../system/time";
import { setCSSGradientByIndex } from "../utils/skycolor";

export default function Space() {
  useFrame(() => {
    setCSSGradientByIndex(timeSystem.time.hour);
  });

  return <></>;
}
