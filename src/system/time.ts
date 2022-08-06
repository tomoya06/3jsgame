import BaseSystem from "./base";
import mj from "number-precision";
import { GUI } from "dat.gui";

// TODO: 时间处理拎出去
const halfday = 12 * 60 * 60 * 1000;
const fullDay = 24 * 60 * 60 * 1000;
const startTime = Date.now() - halfday;
const timeSpeed = 1000 * 3;
const guiMocker = {
  mockTimePercent: 0.5,
};

const gui = new GUI();
const timeFolder = gui.addFolder("TIME");
timeFolder.add(guiMocker, "mockTimePercent", 0, 1, 0.001);
timeFolder.open();

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

  const ts = ((curTime - midnightTime) * timeSpeed) % fullDay;
  // const ts = guiMocker.mockTimePercent * fullDay;

  const isNight = ts >= halfday;
  let percent = mj.divide(ts % halfday, halfday);
  const heightPercent = mj.times(
    mj.minus(0.5, Math.abs(mj.minus(percent, 0.5))),
    2
  );

  return {
    isNight,
    percent,
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

export default timeSystem;
