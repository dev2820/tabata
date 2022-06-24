import { Component, registComponent, $router } from "../../../core";
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
        newDOM.href = this.getAttribute("to");
        return newDOM;
      },
      created() {
        this.addEventListener("click", (e) => {
          e.preventDefault();
          if ($router.mode === "hash") {
            $router.navigate("#" + this.getAttribute("to"));
          }
        });
      },
    });
  }
}

registComponent("router-link", RouterLink);
