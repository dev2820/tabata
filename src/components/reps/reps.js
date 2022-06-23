import { Component } from "../../../core";
import repsStyle from "./reps.css";
import EVENT from "../../types/event";

export default class Reps extends Component {
  constructor() {
    super({
      state: {
        current: 0,
        goal: 0,
      },
      view: () => {
        const newDOM = document.createElement("div");
        newDOM.classList.add("reps");
        newDOM.appendChild(
          document.querySelector("template.reps").content.cloneNode(true)
        );
        const $style = newDOM.querySelector("style");
        $style.innerHTML = repsStyle;
        const $currentReps = newDOM.querySelector("span.current-reps");
        $currentReps.innerText = this.state["current"];

        const $goalReps = newDOM.querySelector("span.goal-reps");
        $goalReps.innerText = `/${this.state["goal"]} reps`;

        return newDOM;
      },
      connected() {
        this.addEventListener(EVENT.SETREPS, (e) => {
          console.log(e.detail);
          this.setState({
            current: e.detail.current,
            goal: e.detail.goal,
          });
        });
      },
    });
  }
}
