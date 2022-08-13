import { Tween } from "@tweenjs/tween.js";

class WorldSpin {
  private _speed: number;

  constructor() {
    this._speed = 1;
  }

  speedup() {
    new Tween({
      sp: 1,
    })
      .to(
        {
          sp: 10,
        },
        200
      )
      .onUpdate(({ sp }) => {
        this._speed = sp;
      })
      .start();
  }

  resetSpeed() {
    new Tween({
      sp: this._speed,
    })
      .to(
        {
          sp: 1,
        },
        200
      )
      .onUpdate(({ sp }) => {
        this._speed = sp;
      })
      .start();
  }

  get speed() {
    return this._speed;
  }
}

const worldspin = new WorldSpin();

export default worldspin;
