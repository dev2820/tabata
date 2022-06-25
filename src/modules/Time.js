const ONE_SECOND = 1000;
const ONE_MINUTES = 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

export default class Time {
  #milliSec = 0;
  constructor({ hr = 0, min = 0, sec = 0, milliSec = 0 }) {
    this.#milliSec += milliSec;
    this.#milliSec += sec * ONE_SECOND;
    this.#milliSec += min * ONE_MINUTES;
    this.#milliSec += hr * ONE_HOUR;
  }
  decrease1sec() {
    return new Time({ milliSec: this.#milliSec - ONE_SECOND });
  }
  get hour() {
    return (this.#milliSec / ONE_HOUR) >> 0;
  }
  get min() {
    return ((this.#milliSec % ONE_HOUR) / ONE_MINUTES) >> 0;
  }
  get sec() {
    return ((this.#milliSec % ONE_MINUTES) / ONE_SECOND) >> 0;
  }
  get milliSec() {
    return this.#milliSec % ONE_SECOND;
  }
  get sign() {
    return this.#milliSec < 0 ? "-" : "+";
  }
  isLeft({ hr, min, sec, milliSec }) {
    if (
      hr === undefined &&
      min === undefined &&
      sec === undefined &&
      milliSec === undefined
    ) {
      return false;
    }
    let expectLeft = milliSec || 0;
    expectLeft += (sec || 0) * ONE_SECOND;
    expectLeft += (min || 0) * ONE_MINUTES;
    expectLeft += (hr || 0) * ONE_HOUR;

    return expectLeft === this.#milliSec;
  }
  isLeftUnder({ hr, min, sec, milliSec }) {
    if (
      hr === undefined &&
      min === undefined &&
      sec === undefined &&
      milliSec === undefined
    ) {
      return false;
    }

    let expectLeft = milliSec || 0;
    expectLeft += (sec || 0) * ONE_SECOND;
    expectLeft += (min || 0) * ONE_MINUTES;
    expectLeft += (hr || 0) * ONE_HOUR;

    return expectLeft > this.#milliSec;
  }
  toString() {
    let hour = this.hour < 0 ? -this.hour : this.hour;
    let min = this.min < 0 ? -this.min : this.min;
    let sec = this.sec < 0 ? -this.sec : this.sec;
    return `${this.sign}${("00" + hour).slice(-2)}:${("00" + min).slice(-2)}:${(
      "00" + sec
    ).slice(-2)}`;
  }
}
