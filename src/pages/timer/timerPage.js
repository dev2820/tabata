import Time from "/src/modules/Time";
import timerPageStyle from "./timerPage.css";
import {
  Component,
  loadTemplate,
  registComponent,
  useGlobalStore,
} from "/core";
import { EVENT_TYPES } from "../../stores/exercise";

export default class TimerPage extends Component {
  constructor() {
    const exercise = useGlobalStore("exercise");
    exercise.dispatch({
      type: EVENT_TYPES.INIT_EXERCISE,
      payload: {
        runTime: new Time({ min: 0, sec: 6 }),
        breakTime: new Time({ min: 0, sec: 4 }),
        goal: 3,
      },
    });
    super({
      view: () => {
        const { isRun } = this.store["exercise"].getState();
        const currentPhase = this.store["exercise"]
          .getState()
          .getCurrentPhase();
        const isEnd = this.store["exercise"].getState().isEndPhase();

        const newDOM = loadTemplate("template.timer-page");
        const $style = newDOM.querySelector("style");
        $style.innerHTML = timerPageStyle;
        const $phase = newDOM.querySelector("h2.phase");
        $phase.innerText =
          isRun === false
            ? isEnd === true
              ? currentPhase.korLabel
              : "정지"
            : currentPhase.korLabel;

        const $button = newDOM.querySelector("button.run-and-stop");
        $button.classList.add(isRun ? "run" : "stop");
        $button.innerText = isRun ? "정지" : "계속";
        $button.addEventListener("click", this.methods.timerToggle);
        return newDOM;
      },
      store: {
        exercise: useGlobalStore("exercise"),
      },
      methods: {
        timerToggle(e) {
          const isTimerRun = this.store["exercise"].getState().isRun;
          if (isTimerRun) {
            this.methods.timerStop();
          } else {
            this.methods.timerContinue();
          }
        },
        timerStop() {
          this.store["exercise"].dispatch({
            type: EVENT_TYPES.STOP,
          });
        },
        timerContinue() {
          this.store["exercise"].dispatch({
            type: EVENT_TYPES.RUN,
          });
        },
      },
    });
  }
}

registComponent("timer-page", TimerPage);
