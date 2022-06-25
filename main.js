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
import RegexPage from "./src/pages/regexPage/regexPage";

import Timer from "./src/components/timer/timer";
import Reps from "./src/components/reps/reps";
import counterFactory from "./src/stores/counter";
import exerciseFactory from "./src/stores/exercise";
import eventbusFactory from "./eventbus";
import { createRouter, registRouter, registGlobalStore } from "./core";

import router from "./src/router";

let counter = counterFactory();
let exercise = exerciseFactory();

// 유사 lodash 추가
window._ = {
  deepCopy: (obj) => {
    let clone = Object.create(Object.getPrototypeOf(obj));
    let props = Object.getOwnPropertyNames(obj);
    props.forEach(function (key) {
      let desc = Object.getOwnPropertyDescriptor(obj, key);
      Object.defineProperty(clone, key, desc);
    });

    return clone;
  },
};
registGlobalStore("exercise", eventbusFactory(exercise));
registGlobalStore("counter", eventbusFactory(counter));
registRouter(createRouter(router));
