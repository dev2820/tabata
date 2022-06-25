import {
  Component,
  loadTemplate,
  registComponent,
  useGlobalStore,
} from "../../../core";
import repsStyle from "./reps.css";

export default class Reps extends Component {
  constructor() {
    super({
      state: {
        current: 0,
        goal: 0,
      },
      store: {
        exercise: useGlobalStore("exercise"),
      },
      view: () => {
        const currentReps = this.store["exercise"]
          .getState()
          .getCurrentPhase().reps;

        const goal = this.store["exercise"].getState().goal;
        const newDOM = loadTemplate("template.reps");
        const $style = newDOM.querySelector("style");
        $style.innerHTML = repsStyle;
        const $currentReps = newDOM.querySelector("span.current-reps");
        $currentReps.innerText = currentReps;

        const $goalReps = newDOM.querySelector("span.goal-reps");
        $goalReps.innerText = `/${goal} reps`;

        return newDOM;
      },
    });
  }
}
registComponent("my-reps", Reps);
