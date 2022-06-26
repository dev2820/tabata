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
      },
      store: {
        exercise: useGlobalStore("exercise"),
      },
      view: () => {
        const $timer = loadTemplate("template.timer");
        const { currentPhase } = this.store["exercise"].getState();
        $timer.classList.add(currentPhase.name);
        const $style = $timer.querySelector("style");
        $style.innerHTML = timerStyle;

        const $minutes = $timer.querySelector("span.minutes");
        $minutes.innerText = (
          "00" + (currentPhase.currentTime?.min || 0)
        ).slice(-2);

        const $seconds = $timer.querySelector("span.seconds");
        $seconds.innerText = (
          "00" + (currentPhase.currentTime?.sec || 0)
        ).slice(-2);

        if (currentPhase.currentTime?.isLeft({ sec: 0 })) {
          $timer.classList.add("time-is-up");
        } else if (currentPhase.currentTime?.isLeftLessThan({ sec: 3 })) {
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

          if (isEnd) {
            return;
          }

          this.store["exercise"].dispatch({
            type: EVENT_TYPES.RUN,
          });
        },
        run() {
          const { currentPhase } = this.store["exercise"].getState();
          //시간이 없어서 타이머를 못킴
          if (
            !currentPhase.currentTime ||
            currentPhase.currentTime.isLeft({ sec: 0 })
          )
            return;

          this.setState({
            interval: setInterval(() => {
              const { currentPhase } = this.store["exercise"].getState();
              const nextTime = currentPhase.currentTime.decrease100milliSec();
              if (nextTime.isLeft({ sec: 0 })) {
                this.methods.riseTimeover();
                return;
              }
              this.store["exercise"].dispatch({
                type: EVENT_TYPES.NEXT_TIME,
                payload: nextTime,
              });
            }, 100),
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
