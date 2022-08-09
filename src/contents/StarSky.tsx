import { Stars } from "@react-three/drei";
import { useEffect } from "react";
import { useTimeSystem } from "../system/time";

export default function StarSky() {
  const [ts] = useTimeSystem();

  if (!ts.hasStar) {
    return null;
  }

  return <Stars />;
}
