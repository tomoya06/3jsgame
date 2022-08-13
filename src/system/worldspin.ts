import { Tween } from "@tweenjs/tween.js";

const defaultSpeed = 1,
  maxSpeed = 20,
  duration = maxSpeed * 10;

class WorldSpin {
  private _speed: number;

  constructor() {
    this._speed = defaultSpeed;
  }

  speedup() {
    new Tween({
      sp: this._speed,
    })
      .to(
        {
          sp: maxSpeed,
        },
        duration
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
          sp: defaultSpeed,
        },
        duration
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
