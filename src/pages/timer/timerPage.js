import Time from "/src/modules/Time";
import timerPageStyle from "./timerPage.css";
import {
  Component,
  loadTemplate,
  registComponent,
  useGlobalStore,
} from "/core";
import EVENT from "/src/types/event";
import Exercise from "../../modules/exercise";
import { EVENT_TYPES } from "../../stores/exercise";

const phase2text = (phase) => {
  switch (phase) {
    case "run":
      return "운동";
    case "break":
      return "휴식";
    case "end":
      return "종료";
    case "stop":
      return "정지";
  }
};

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
        const newDOM = loadTemplate("template.timer-page");
        const $style = newDOM.querySelector("style");
        $style.innerHTML = timerPageStyle;
        const $phase = newDOM.querySelector("h2.phase");
        $phase.innerText = this.store["exercise"]
          .getState()
          .getCurrentPhase().name;

        newDOM
          .querySelector("button.run-and-stop")
          .addEventListener("click", this.methods.timerToggle);
        return newDOM;
      },
      store: {
        exercise: useGlobalStore("exercise"),
      },
      state: {
        isRun: false,
      },
      methods: {
        timerToggle(e) {
          const isTimerRun = this.state["isRun"];
          if (isTimerRun) {
            this.methods.timerStop();
          } else {
            this.methods.timerContinue();
          }
        },
        timerStop() {
          this.state["exercise"].stop();
          this.$("my-timer").dispatchEvent(new Event(EVENT.STOP));
        },
        timerContinue() {
          this.state["exercise"].continue();
          this.$("my-timer").dispatchEvent(new Event(EVENT.RUN));
        },
      },
    });
  }
}

registComponent("timer-page", TimerPage);
