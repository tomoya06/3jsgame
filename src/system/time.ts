import BaseSystem from "./base";
import mj from "number-precision";
import { useEffect, useRef, useState } from "react";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";

const halfday = 12 * 60 * 60 * 1000;
const fullDay = 24 * 60 * 60 * 1000;
const startTime = Date.now() - halfday;
const sunPctRange = [mj.divide(4, 24), mj.divide(20, 24)];
const starPctRange = [mj.divide(8, 24), mj.divide(18, 24)];

const timeSpeed = 1000 * 2;
const guiMocker = {
  isControl: false,
  mockTimePercent: 0.5,
};

export type TimeProgressType = ReturnType<typeof curTimeProgress>;

const curTimeProgress = () => {
  // // FOR REALTIME
  // const midnight = new Date();
  // midnight.setHours(0, 0, 0, 0);
  // const midnightTime = midnight.getTime();
  // const curTime = Date.now();

  // FOR FAKE TIME
  const midnightTime = startTime;
  const curTime = Date.now();

  const ts = guiMocker.isControl
    ? guiMocker.mockTimePercent * fullDay
    : ((curTime - midnightTime) * timeSpeed) % fullDay;

  const percent = mj.divide(ts % halfday, halfday);
  const dayPercent = mj.divide(ts % fullDay, fullDay);
  const sunPercent = mj.divide(
    dayPercent - sunPctRange[0],
    sunPctRange[1] - sunPctRange[0]
  );
  const hour = Math.floor(dayPercent * 24);
  const isSun = dayPercent >= sunPctRange[0] && dayPercent <= sunPctRange[1];
  const isNight = !isSun;
  const noStar = dayPercent >= starPctRange[0] && dayPercent <= starPctRange[1];
  const hasStar = !noStar;

  const heightPercent = mj.times(
    mj.minus(0.5, Math.abs(mj.minus(sunPercent, 0.5))),
    2
  );

  return {
    isNight,
    hasStar,
    hour,
    percent,
    sunPercent,
    dayPercent,
    heightPercent,
  };
};

class TimeSystem extends BaseSystem {
  private curTime: TimeProgressType;

  constructor() {
    super();
    this.curTime = curTimeProgress();
  }

  public animate(): void {
    this.curTime = curTimeProgress();
  }

  public get time() {
    return this.curTime;
  }
}

const timeSystem = new TimeSystem();

export const useTimeSystem = (): [TimeProgressType] => {
  const [ts, setTs] = useState(timeSystem.time);
  const [isNight, setNight] = useState(false);

  const requestRef = useRef<number>();

  const update = () => {
    const newTime = { ...timeSystem.time };
    setTs(newTime);

    if (newTime.isNight !== isNight) {
      setNight(newTime.isNight);
    }

    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(requestRef.current || 0);
    };
  }, []);

  return [ts];
};

export function TimeSystemControls() {
  const { timePercent, isControl } = useControls("Time System", {
    timePercent: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    isControl: {
      value: false,
    },
  });

  useEffect(() => {
    guiMocker.mockTimePercent = timePercent;
    guiMocker.isControl = isControl;
  }, [timePercent, isControl]);

  return useFrame(() => {
    timeSystem.animate();
  });
}

export default timeSystem;
