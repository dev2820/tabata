import { Component } from "../../../core";
import buttonStyle from "./button.css";
import EVENT from "../../types/event";
const createView = ({}) => {
  const DOM = document.createElement("div");
  DOM.className = "custom-button";
  DOM.appendChild(
    document.querySelector("template.button").content.cloneNode(true)
  );
  const style = document.createElement("style");
  style.innerHTML = buttonStyle;
  DOM.querySelector("style").replaceWith(style);
  return DOM;
};

export default class Button extends Component {
  static get observedAttributes() {
    return [];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.props[name] = newValue;
  }
  constructor() {
    super({
      state: {
        label: "",
      },
      view: createView,
    });
    this.addEventListener(EVENT.CHANGE_LABEL, (ce) => {
      this.setState({
        label: ce.detail.newLabel,
      });
    });
  }
}
