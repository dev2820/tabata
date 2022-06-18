import timerStyle from "./timer.css";
import { Component, render, changeDiff } from "../../../core";
import EVENT from "../../types/event";
import Time from "../../modules/Time";

const createView = ({ props, state }) => {
  const $timer = document.createElement("div");
  $timer.classList.add("timer");
  $timer.appendChild(
    document.querySelector("template.timer").content.cloneNode(true)
  );
  const $style = $timer.querySelector("style");
  $style.innerHTML = timerStyle;

  const $minutes = $timer.querySelector("span.minutes");
  $minutes.innerText = ("00" + (state["time"]?.min || 0)).slice(-2);

  const $seconds = $timer.querySelector("span.seconds");
  $seconds.innerText = ("00" + (state["time"]?.sec || 0)).slice(-2);

  if (state["time"]?.isLeftUnder({ sec: 4 })) {
    $timer.classList.add("will-be-end");
  }
  return $timer;
};

export default class Timer extends Component {
  static get observedAttributes() {
    return [];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.props[name] = newValue;
  }
  constructor() {
    super({
      state: {
        interval: null,
        time: null,
        isRun: false,
      },
      view: createView,
    });
    this.setMethods({
      riseTimeover: function () {
        this.methods.stop();
        this.dispatchEvent(
          new Event(EVENT.TIMEOVER, { bubbles: true, composed: true })
        );
      }.bind(this),
      run: function () {
        const { time, isRun } = this.state;
        if (!time || time.isLeft({ sec: 0 })) {
          return; //시간이 없어서 타이머를 못킴
        }
        if (isRun === true) {
          return; //이미 돌고있어서 타이머를 못킴
        }
        this.setState({
          interval: setInterval(() => {
            const newTime = this.state["time"].decrease1sec();
            this.setState({
              time: newTime,
            });
            if (newTime.isLeft({ sec: 0 })) {
              this.methods.riseTimeover();
            }
          }, 1000),
          isRun: true,
        });
        this.setAttribute("is-run", true);
      }.bind(this),
      stop: function () {
        clearInterval(this.state["interval"]);
        this.state["isRun"] = false;

        this.setAttribute("is-run", false);
      }.bind(this),
    });
    this.onMounted(() => {
      this.methods.run();
    });
    this.addEventListener(EVENT.SETTIME, (e) => {
      this.setState({ time: e.detail.startTime });
      this.methods.run();
    });
    this.addEventListener(EVENT.RUN, (e) => {
      this.methods.run();
    });
    this.addEventListener(EVENT.STOP, (e) => {
      this.methods.stop();
    });
  }
}
