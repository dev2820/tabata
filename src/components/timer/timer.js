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
        } else if (this.state["time"]?.isLeftLessThan({ sec: 3 })) {
          $timer.classList.add("will-be-end");
        }
        return $timer;
      },
      created() {
        this.store["exercise"].registWatcher("isRun", (oldValue, newValue) => {
          if (newValue) {
            this.methods.run();
          } else {
            this.methods.stop();
          }
        });
        this.setState({
          time: this.store["exercise"].getState().getCurrentPhase().time,
        });
        this.store["exercise"].dispatch({
          type: EVENT_TYPES.RUN,
        });
      },
      methods: {
        riseTimeover() {
          this.store["exercise"].dispatch({
            type: EVENT_TYPES.STOP,
          });

          this.store["exercise"].dispatch({
            type: EVENT_TYPES.NEXT_PHASE,
          });

          const isEnd = this.store["exercise"].getState().isEndPhase();
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

          this.store["exercise"].dispatch({
            type: EVENT_TYPES.RUN,
          });
        },
        run() {
          const { time } = this.state;
          //시간이 없어서 타이머를 못킴
          if (!time || time.isLeft({ sec: 0 })) return;

          this.setState({
            interval: setInterval(() => {
              const nextTime = this.state["time"].decrease10milliSec();
              if (nextTime.isLeft({ sec: 0 })) {
                this.methods.riseTimeover();
                if (this.store["exercise"].getState().isEndPhase()) {
                  this.setState({
                    time: nextTime,
                  });
                }
                return;
              }
              this.setState({
                time: nextTime,
              });
            }, 10),
          });
        },
        stop() {
          clearInterval(this.state["interval"]);
        },
      },
    });
  }
}

registComponent("my-timer", Timer);
