// 앱 실행
import App from "./src/app";
import timerTemplate from "./src/components/timer/timerTemplate";
import appTemplate from "./src/appTemplate";
import buttonTemplate from "./src/components/button/buttonTemplate.js";
import runAndStopButtonTemplate from "./src/components/runAndStopButton/runAndStopButtonTemplate.js";
import repsTemplate from "./src/components/reps/repsTemplate";
import Button from "./src/components/button/button";
import RunAndStopButton from "./src/components/runAndStopButton/runAndStopButton";
import Timer from "./src/components/timer/timer";
import Reps from "./src/components/reps/reps";
import { registApp, registTemplate, render } from "./core";

registTemplate(appTemplate);
registTemplate(timerTemplate);
// registTemplate(buttonTemplate);
registTemplate(runAndStopButtonTemplate);
registTemplate(repsTemplate);
window.customElements.define("my-app", App);
window.customElements.define("my-button", Button);
window.customElements.define("run-and-stop-button", RunAndStopButton);
window.customElements.define("my-timer", Timer);
window.customElements.define("my-reps", Reps);

const app = document.createElement("my-app");
document.body.appendChild(app);
