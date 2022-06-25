import timerStyle from "./timer.css";
import {
  Component,
  loadTemplate,
  registComponent,
  useGlobalStore,
} from "../../../core";
import { EVENT_TYPES } from "../../stores/exercise";

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
      store: {
        exercise: useGlobalStore("exercise"),
      },
      view: () => {
        const $timer = loadTemplate("template.timer");
        $timer.classList.add(
          this.store["exercise"].getState().getCurrentPhase().name
        );
        const $style = $timer.querySelector("style");
        $style.innerHTML = timerStyle;

        const $minutes = $timer.querySelector("span.minutes");
        $minutes.innerText = ("00" + (this.state["time"]?.min || 0)).slice(-2);

        const $seconds = $timer.querySelector("span.seconds");
        $seconds.innerText = ("00" + (this.state["time"]?.sec || 0)).slice(-2);

        if (this.state["time"]?.isLeft({ sec: 0 })) {
          $timer.classList.add("time-is-up");
        } else if (this.state["time"]?.isLeftUnder({ sec: 4 })) {
          $timer.classList.add("will-be-end");
        }
        return $timer;
      },
      created() {
        this.setState({
          time: this.store["exercise"].getState().getCurrentPhase().time,
        });
        this.methods.run();
      },
      methods: {
        riseTimeover() {
          this.methods.stop();
          this.store["exercise"].dispatch({
            type: EVENT_TYPES.NEXT_PHASE,
          });

          const isEnd = this.store["exercise"].getState().isEnd();
          const currentPhase = this.store["exercise"]
            .getState()
            .getCurrentPhase();

          if (isEnd) {
            return;
          }

          this.setState({
            time: currentPhase.time,
            phase: currentPhase,
          });

          this.methods.run();
        },
        run() {
          const { time, isRun } = this.state;
          //시간이 없어서 타이머를 못킴
          if (!time || time.isLeft({ sec: 0 })) return;
          //이미 돌고있어서 타이머를 못킴
          if (isRun) return;

          this.setState({
            interval: setInterval(() => {
              this.setState({
                time: this.state["time"].decrease1sec(),
              });
              if (this.state["time"].isLeft({ sec: 0 })) {
                this.methods.riseTimeover();
              }
            }, 1000),
            isRun: true,
          });
        },
        stop() {
          clearInterval(this.state["interval"]);
          this.setState({
            isRun: false,
          });
        },
      },
    });
  }
}

registComponent("my-timer", Timer);
