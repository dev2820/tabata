import notFoundPageStyle from "./notFound.css";
import { Component, loadTemplate, registComponent } from "/core";

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

registComponent("not-found-page", NotFound);
