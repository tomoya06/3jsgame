import * as TWEEN from "@tweenjs/tween.js";

export const animate = () => {
  if (TWEEN.update()) {
    requestAnimationFrame(animate);
  }
};
