export default class Time {
  #sec = 0;
  constructor({ hr = 0, min = 0, sec = 0 }) {
    this.#sec += sec;
    this.#sec += min * 60;
    this.#sec += hr * 60 * 60;
  }
  decrease1sec() {
    return new Time({ sec: this.#sec - 1 });
  }
  get hour() {
    return (this.#sec / 3600) >> 0;
  }
  get min() {
    return ((this.#sec / 60) >> 0) % 60;
  }
  get sec() {
    return this.#sec % 60;
  }
  get sign() {
    return this.#sec < 0 ? "-" : "+";
  }
  isLeft({ hr, min, sec }) {
    if (hr === undefined && min === undefined && sec === undefined) {
      return false;
    }
    let expectLeft = sec || 0;
    expectLeft += (min || 0) * 60;
    expectLeft += (hr || 0) * 60 * 60;

    return expectLeft === this.#sec;
  }
  isLeftUnder({ hr, min, sec }) {
    if (hr === undefined && min === undefined && sec === undefined) {
      return false;
    }
    let expectLeft = sec || 0;
    expectLeft += (min || 0) * 60;
    expectLeft += (hr || 0) * 60 * 60;

    return expectLeft > this.#sec;
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
