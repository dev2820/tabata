import Time from "/src/modules/Time";
import timerPageStyle from "./timerPage.css";
import { Component } from "/core";
import EVENT from "/src/types/event";

const createView = ({ state }) => {
  const newDOM = document.createElement("div");
  newDOM.id = "app";
  newDOM.appendChild(
    document.querySelector("template.timer-page").content.cloneNode(true)
  );
  const style = newDOM.querySelector("style");
  style.innerHTML = timerPageStyle;

  return newDOM;
};
export default class App extends Component {
  constructor() {
    super({
      view: createView,
      state: {
        message: "hello",
        startTime: new Time({ min: 0, sec: 200 }),
        currentReps: 1,
        goalReps: 6,
      },
      connected() {
        this.addEventListener(EVENT.TIMEOVER, this.methods.timeoverHandler);
      },
      created() {
        this.$("my-timer").dispatchEvent(
          new CustomEvent(EVENT.SETTIME, {
            detail: { startTime: this.state["startTime"] },
          })
        );
        this.$("my-reps").dispatchEvent(
          new CustomEvent(EVENT.SETREPS, {
            detail: {
              current: this.state["currentReps"],
              goal: this.state["goalReps"],
            },
          })
        );
        this.$("run-and-stop-button").addEventListener(
          EVENT.CLICK,
          this.methods.timerToggle
        );
      },
      methods: {
        timeoverHandler(e) {
          if (this.state["currentReps"] + 1 > this.state["goalReps"]) {
            alert("finish");
          } else {
            this.setState({
              currentReps: this.state["currentReps"] + 1,
              startTime: new Time({ min: 0, sec: 2 }),
            });
            this.$("my-timer").dispatchEvent(
              new CustomEvent(EVENT.SETTIME, {
                detail: { startTime: this.state["startTime"] },
              })
            );
            this.$("my-reps").dispatchEvent(
              new CustomEvent(EVENT.SETREPS, {
                detail: {
                  current: this.state["currentReps"],
                  goal: this.state["goalReps"],
                },
              })
            );
          }
        },
        timerToggle(e) {
          const $button = this.$("run-and-stop-button.run-and-stop");
          const $timer = this.$("my-timer");

          const isTimerRun = $timer.getAttribute("is-run") === "true";
          $timer.dispatchEvent(new Event(isTimerRun ? EVENT.STOP : EVENT.RUN));
          $button.dispatchEvent(
            new CustomEvent(EVENT.CHANGE_STATE, {
              detail: { state: isTimerRun ? "stop" : "run" },
            })
          );
        },
      },
    });
  }
}