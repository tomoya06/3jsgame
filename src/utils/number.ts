import mj from "number-precision";

mj.enableBoundaryChecking(false);

export function fixInRange(target: number, range: [number, number]) {
  if (target > range[1]) {
    return range[1];
  }
  if (target < range[0]) {
    return range[0];
  }
  return target;
}

export function randomInRange(low: number, hi: number) {
  return low + Math.random() * (hi - low);
}

export function normalizeSpeed(num: number, delta: number) {
  // console.log("normalizeSpeed", delta);
  return mj.times(mj.times(num, 60), delta);
}
