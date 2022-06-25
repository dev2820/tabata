import notFoundPageStyle from "./notFound.css";
import { EVENT_TYPES } from "../../stores/counter";
import {
  Component,
  loadTemplate,
  registComponent,
  useGlobalStore,
} from "/core";

export default class NotFound extends Component {
  constructor() {
    super({
      view: () => {
        const newDOM = loadTemplate("template.not-found-page");
        const $style = newDOM.querySelector("style");
        $style.innerHTML = notFoundPageStyle;
        const $span = document.createElement("span");
        const { counter } = this.store["counter"].getState();
        $span.innerText = `${counter} visited`;
        newDOM.appendChild($span);
        return newDOM;
      },
      store: {
        counter: useGlobalStore("counter"),
      },
      created() {
        this.store["counter"].dispatch({
          type: EVENT_TYPES.SET_COUNTER,
          payload: 10,
        });
      },
      connected() {
        this.store["counter"].dispatch({ type: EVENT_TYPES.INCREASE });
        if (this.store["counter"].getState().counter > 13) {
          this.unsubscribe("counter");
        }
      },
    });
  }
}

registComponent("not-found-page", NotFound);
