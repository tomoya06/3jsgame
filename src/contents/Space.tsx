import { useFrame } from "@react-three/fiber";
import { colord } from "colord";
import { useCallback, useEffect, useMemo, useState } from "react";
import timeSystem, { TimeProgressType } from "../system/time";
import { setCSSGradientByIndex } from "../utils/skycolor";
import * as TWEEN from "@tweenjs/tween.js";

const animate = () => {
  if (TWEEN.update()) {
    requestAnimationFrame(animate);
  }
};

export default function Space() {
  const [curHour, setCurHour] = useState(0);
  const [clns, setClns] = useState(["0", "1"]);
  const [opas, setOpas] = useState([1, 0]);

  const updateCurTime = useCallback(() => {
    setCurHour(timeSystem.time.hour);
    requestAnimationFrame(() => {
      updateCurTime();
    });
  }, []);

  useEffect(() => {
    updateCurTime();
  }, []);

  useEffect(() => {
    console.log(`curHour change`, curHour);
    new TWEEN.Tween({ opa: 1 })
      .to({ opa: 0 }, 1000)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(({ opa }) => {
        setOpas([1, 1 - opa]);
      })
      .onComplete(({ opa }) => {
        setClns([`${curHour}`, `${curHour + 1}`]);
        setOpas([1, 0]);
      })
      .start();
    animate();
  }, [curHour]);

  return (
    <>
      {[0, 1].map((val) => (
        <div
          key={`skygra_${val}`}
          className={`sky-gradient sky-gradient-${clns[val]}`}
          style={{ opacity: opas[val] }}
        ></div>
      ))}
    </>
  );
}
