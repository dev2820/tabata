import { Component, loadTemplate } from "../../../core";
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
        const newDOM = loadTemplate("template.reps");
        const $style = newDOM.querySelector("style");
        $style.innerHTML = repsStyle;
        const $currentReps = newDOM.querySelector("span.current-reps");
        $currentReps.innerText = this.state["current"];

        const $goalReps = newDOM.querySelector("span.goal-reps");
        $goalReps.innerText = `/${this.state["goal"]} reps`;

        return newDOM;
      },
      created() {
        this.addEventListener(EVENT.SETREPS, (e) => {
          this.setState({
            current: e.detail.current,
            goal: e.detail.goal,
          });
        });
      },
    });
  }
}
