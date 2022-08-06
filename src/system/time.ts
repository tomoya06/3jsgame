import BaseSystem from "./base";
import mj from "number-precision";
import { GUI } from "dat.gui";

const halfday = 12 * 60 * 60 * 1000;
const fullDay = 24 * 60 * 60 * 1000;
const startTime = Date.now() - halfday;
const sunPctRange = [mj.divide(4, 24), mj.divide(20, 24)];

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

  const percent = mj.divide(ts % halfday, halfday);
  const dayPercent = mj.divide(ts % fullDay, fullDay);
  const sunPercent = mj.divide(
    dayPercent - sunPctRange[0],
    sunPctRange[1] - sunPctRange[0]
  );
  const hour = Math.floor(dayPercent * 24);
  const isSun = dayPercent >= sunPctRange[0] && dayPercent <= sunPctRange[1];
  const isNight = !isSun;

  const heightPercent = mj.times(
    mj.minus(0.5, Math.abs(mj.minus(sunPercent, 0.5))),
    2
  );

  return {
    isNight,
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

export default timeSystem;
