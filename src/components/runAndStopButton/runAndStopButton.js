import { Component, loadTemplate } from "../../../core";
import buttonStyle from "./runAndStopButton.css";
import EVENT from "../../types/event";

export default class RunAndStopButton extends Component {
  constructor() {
    super({
      state: {
        isRun: true,
      },
      view: () => {
        const DOM = loadTemplate("template.run-and-stop-button");
        DOM.classList.add(this.state.isRun ? "run" : "stop");
        const $style = document.createElement("style");
        $style.innerHTML = buttonStyle;
        DOM.querySelector("style").replaceWith($style);
        const $button = DOM.querySelector("button");
        $button.innerText = this.state.isRun ? "정지" : "계속";
        return DOM;
      },
      created() {
        this.addEventListener(EVENT.CHANGE_STATE, (ce) => {
          this.setState({
            isRun: ce.detail.state === "run",
          });
        });
      },
    });
  }
}
