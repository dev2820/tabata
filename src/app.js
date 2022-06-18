import Timer from "./components/timer/timer";
import Time from "./modules/Time";
import appStyle from "./app.css";
import { Component } from "/core";
import EVENT from "./types/event";

const createView = ({ state }) => {
  const newDOM = document.createElement("div");
  newDOM.id = "app";
  newDOM.appendChild(
    document.querySelector("template.app").content.cloneNode(true)
  );
  const style = newDOM.querySelector("style");
  style.innerHTML = appStyle;

  return newDOM;
};
export default class App extends Component {
  constructor() {
    super({
      state: {
        message: "hello",
        startTime: new Time({ min: 0, sec: 5 }),
        currentReps: 1,
        goalReps: 6,
      },
      created: () => {
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
        this.addEventListener(EVENT.TIMEOVER, this.methods.timeoverHandler);
      },
      view: createView,
    });
    this.setMethods({
      timeoverHandler: function (e) {
        if (this.state["currentReps"] + 1 > this.state["goalReps"]) {
          alert("finish");
        } else {
          this.setState({
            currentReps: this.state["currentReps"] + 1,
            startTime: new Time({ min: 0, sec: 5 }),
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
      }.bind(this),
      timerToggle: function (e) {
        const $button = this.$("run-and-stop-button.run-and-stop");
        const $timer = this.$("my-timer");

        if ($timer.getAttribute("is-run") === "true") {
          $timer.dispatchEvent(new Event(EVENT.STOP));
          $button.dispatchEvent(
            new CustomEvent(EVENT.CHANGE_STATE, {
              detail: { state: "stop" },
            })
          );
        } else {
          $timer.dispatchEvent(new Event(EVENT.RUN));
          $button.dispatchEvent(
            new CustomEvent(EVENT.CHANGE_STATE, {
              detail: { state: "run" },
            })
          );
        }
      }.bind(this),
    });
  }
}
