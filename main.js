// 앱 실행
import TimerPage from "./src/pages/timer/timerPage";
import TimerPageTemplate from "./src/pages/timer/timerPageTemplate";
import NotFound from "./src/pages/notFound/notFoundPage";
import NotFoundTemplate from "./src/pages/notFound/notFoundPageTemplate";
import timerTemplate from "./src/components/timer/timerTemplate";
import runAndStopButtonTemplate from "./src/components/runAndStopButton/runAndStopButtonTemplate.js";
import repsTemplate from "./src/components/reps/repsTemplate";
import RunAndStopButton from "./src/components/runAndStopButton/runAndStopButton";
import Timer from "./src/components/timer/timer";
import Reps from "./src/components/reps/reps";
import {
  registApp,
  registTemplate,
  render,
  Router,
  registRouter,
} from "./core";

import router from "./src/router";
import RouterLink from "./src/components/routerLink/routerLink";

registTemplate(TimerPageTemplate);
registTemplate(timerTemplate);
registTemplate(runAndStopButtonTemplate);
registTemplate(repsTemplate);
registTemplate(NotFoundTemplate);
window.customElements.define("timer-page", TimerPage);
window.customElements.define("not-found-page", NotFound);

window.customElements.define("run-and-stop-button", RunAndStopButton);
window.customElements.define("my-timer", Timer);
window.customElements.define("my-reps", Reps);

window.customElements.define("router-link", RouterLink);

registRouter(new Router(router));
