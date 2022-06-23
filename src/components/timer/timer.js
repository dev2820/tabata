import timerStyle from "./timer.css";
import { Component, loadTemplate } from "../../../core";
import EVENT from "../../types/event";
import Time from "../../modules/Time";

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
        phase: "stop",
      },
      view: () => {
        const $timer = loadTemplate("template.timer");

        $timer.classList.add(this.state["phase"]);
        const $style = $timer.querySelector("style");
        $style.innerHTML = timerStyle;

        const $minutes = $timer.querySelector("span.minutes");
        $minutes.innerText = ("00" + (this.state["time"]?.min || 0)).slice(-2);

        const $seconds = $timer.querySelector("span.seconds");
        $seconds.innerText = ("00" + (this.state["time"]?.sec || 0)).slice(-2);

        if (this.state["time"]?.isLeft({ sec: 0 })) {
          $timer.classList.remove("stop");
          $timer.classList.add("end");
        } else if (this.state["time"]?.isLeftUnder({ sec: 4 })) {
          $timer.classList.add("will-be-end");
        }
        return $timer;
      },
      created() {
        this.addEventListener(EVENT.SETTIME, (e) => {
          this.setState({ time: e.detail.time });
          this.methods.run();
        });
        this.addEventListener(EVENT.RUN, (e) => {
          this.methods.run();
        });
        this.addEventListener(EVENT.STOP, (e) => {
          this.methods.stop();
        });
      },
      methods: {
        riseTimeover() {
          this.methods.stop();
          this.dispatchEvent(
            new Event(EVENT.TIMEOVER, { bubbles: true, composed: true })
          );
        },
        run() {
          const { time, phase } = this.state;
          //시간이 없어서 타이머를 못킴
          if (!time || time.isLeft({ sec: 0 })) return;
          //이미 돌고있어서 타이머를 못킴
          if (phase === "run") return;

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
            phase: "run",
          });
        },
        stop() {
          clearInterval(this.state["interval"]);
          this.setState({
            phase: "stop",
          });
        },
      },
    });
  }
}
