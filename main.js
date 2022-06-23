// 앱 실행
import TimerPage from "./src/pages/timer/timerPage";
import TimerPageTemplate from "./src/pages/timer/timerPageTemplate";
import timerTemplate from "./src/components/timer/timerTemplate";
import runAndStopButtonTemplate from "./src/components/runAndStopButton/runAndStopButtonTemplate.js";
import repsTemplate from "./src/components/reps/repsTemplate";
import RunAndStopButton from "./src/components/runAndStopButton/runAndStopButton";
import Timer from "./src/components/timer/timer";
import Reps from "./src/components/reps/reps";
import { registApp, registTemplate, render } from "./core";

registTemplate(TimerPageTemplate);
registTemplate(timerTemplate);
registTemplate(runAndStopButtonTemplate);
registTemplate(repsTemplate);
window.customElements.define("timer-page", TimerPage);
window.customElements.define("run-and-stop-button", RunAndStopButton);
window.customElements.define("my-timer", Timer);
window.customElements.define("my-reps", Reps);

const app = document.createElement("timer-page");
document.body.appendChild(app);
