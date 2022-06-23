import Time from "/src/modules/Time";
import timerPageStyle from "./timerPage.css";
import { Component, loadTemplate } from "/core";
import EVENT from "/src/types/event";
import Exercise from "../../modules/exercise";

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
    super({
      view: () => {
        const newDOM = loadTemplate("template.timer-page");
        const $style = newDOM.querySelector("style");
        $style.innerHTML = timerPageStyle;
        const $phase = newDOM.querySelector("h2.phase");
        $phase.innerText = phase2text(this.state["exercise"].phase.name);

        newDOM
          .querySelector("run-and-stop-button")
          .addEventListener(EVENT.CLICK, this.methods.timerToggle);
        return newDOM;
      },
      state: {
        runTime: new Time({ min: 0, sec: 5 }),
        breakTime: new Time({ min: 0, sec: 3 }),
        exercise: new Exercise(3),
      },
      created() {
        this.addEventListener(EVENT.TIMEOVER, this.methods.timeoverHandler);
        this.setState({
          exercise: this.state["exercise"].next(),
        });
        this.$("my-timer").dispatchEvent(
          new CustomEvent(EVENT.SETTIME, {
            detail: { time: this.state["runTime"] },
          })
        );
        this.$("my-timer").dispatchEvent(new Event(EVENT.RUN));
        this.$("my-reps").dispatchEvent(
          new CustomEvent(EVENT.SETREPS, {
            detail: {
              current: this.state["exercise"].phase.reps,
              goal: this.state["exercise"].goal,
            },
          })
        );
      },
      connected() {},
      methods: {
        timeoverHandler(e) {
          this.state["exercise"].next();
          this.render();
          if (this.state["exercise"].phase.name === "end") {
            new CustomEvent(EVENT.SETREPS, {
              detail: {
                current: this.state["exercise"].phase.reps,
                goal: this.state["exercise"].goal,
              },
            });
          } else if (this.state["exercise"].phase.name === "run") {
            this.$("my-timer").dispatchEvent(
              new CustomEvent(EVENT.SETTIME, {
                detail: {
                  time: this.state["runTime"],
                },
              })
            );
            this.$("my-reps").dispatchEvent(
              new CustomEvent(EVENT.SETREPS, {
                detail: {
                  current: this.state["exercise"].phase.reps,
                  goal: this.state["exercise"].goal,
                },
              })
            );
            this.$("my-timer").dispatchEvent(new Event(EVENT.RUN));
          } else if (this.state["exercise"].phase.name === "break") {
            this.$("my-timer").dispatchEvent(
              new CustomEvent(EVENT.SETTIME, {
                detail: {
                  time: this.state["breakTime"],
                },
              })
            );
            this.$("my-timer").dispatchEvent(new Event(EVENT.RUN));
          }
        },
        timerToggle(e) {
          const isTimerRun = this.state["exercise"].isRun;
          if (isTimerRun) {
            this.methods.timerStop();
          } else {
            this.methods.timerContinue();
          }
        },
        timerStop() {
          this.state["exercise"].stop();
          this.$("my-timer").dispatchEvent(new Event(EVENT.STOP));
          this.$("run-and-stop-button.run-and-stop").dispatchEvent(
            new CustomEvent(EVENT.CHANGE_STATE, {
              detail: { state: "stop" },
            })
          );
        },
        timerContinue() {
          this.state["exercise"].continue();
          this.$("my-timer").dispatchEvent(new Event(EVENT.RUN));
          this.$("run-and-stop-button.run-and-stop").dispatchEvent(
            new CustomEvent(EVENT.CHANGE_STATE, {
              detail: { state: "run" },
            })
          );
        },
      },
    });
  }
}

if (!window.customElements["timer-page"]) {
  window.customElements.define("timer-page", TimerPage);
}
