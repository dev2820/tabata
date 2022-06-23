// 앱 실행
import TimerPage from "./src/pages/timer/timerPage";
import TimerPageTemplate from "./src/pages/timer/timerPageTemplate";
import NotFound from "./src/pages/notFound/notFoundPage";
import NotFoundTemplate from "./src/pages/notFound/notFoundPageTemplate";
import timerTemplate from "./src/components/timer/timerTemplate";
import runAndStopButtonTemplate from "./src/components/runAndStopButton/runAndStopButtonTemplate.js";
import repsTemplate from "./src/components/reps/repsTemplate";
import RunAndStopButton from "./src/components/runAndStopButton/runAndStopButton";
import RouterLink from "./src/components/routerLink/routerLink";

import Timer from "./src/components/timer/timer";
import Reps from "./src/components/reps/reps";
import { Router, registRouter } from "./core";

import router from "./src/router";

registRouter(new Router(router));
