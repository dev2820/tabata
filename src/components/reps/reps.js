import { Component } from "../../../core";
import repsStyle from "./reps.css";
import EVENT from "../../types/event";

const createView = ({ props, state }) => {
  const newDOM = document.createElement("div");
  newDOM.classList.add("reps");
  newDOM.appendChild(
    document.querySelector("template.reps").content.cloneNode(true)
  );
  const $style = newDOM.querySelector("style");
  $style.innerHTML = repsStyle;
  const $currentReps = newDOM.querySelector("span");
  $currentReps.className = "current";
  $currentReps.innerText = state["current"];
  newDOM.innerHTML = newDOM.innerHTML.trim() + `/${state["goal"]} reps`;

  return newDOM;
};
export default class Reps extends Component {
  constructor() {
    super({
      state: {
        current: 0,
        goal: 0,
      },
      view: createView,
    });

    this.addEventListener(EVENT.SETREPS, (e) => {
      this.setState({
        current: e.detail.current,
        goal: e.detail.goal,
      });
    });
  }
}
