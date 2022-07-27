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
