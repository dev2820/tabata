import { Component } from "../../../core";
export default class RouterLink extends Component {
  constructor() {
    super({
      view: () => {
        const template = `
        <a>
                    <slot></slot>
                    </a>
                `;
        const temp = document.createElement("div");
        temp.innerHTML = template;
        const newDOM = temp.firstElementChild;
        newDOM.href = "#" + this.getAttribute("to");
        newDOM.innerHTML = template;
        console.log(newDOM);
        return newDOM;
      },
    });
  }
}
