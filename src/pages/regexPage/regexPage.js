import { Component, loadTemplate, registComponent, $route } from "/core";

export default class RegexPage extends Component {
  constructor() {
    super({
      view: () => {
        const template = `
            <p>url id: ${$route.params.id}</p>
        `;
        const newDOM = document.createElement("div");
        newDOM.innerHTML = template;
        return newDOM;
      },
    });
  }
}

registComponent("regex-page", RegexPage);
