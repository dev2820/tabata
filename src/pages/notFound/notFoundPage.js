import notFoundPageStyle from "./notFound.css";
import { Component, loadTemplate } from "/core";

export default class NotFound extends Component {
  constructor() {
    super({
      view: () => {
        const newDOM = loadTemplate("template.not-found-page");
        const $style = newDOM.querySelector("style");
        $style.innerHTML = notFoundPageStyle;

        return newDOM;
      },
    });
  }
}

if (!window.customElements["not-found-page"]) {
  window.customElements.define("not-found-page", NotFound);
}
