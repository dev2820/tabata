export default {
  container: document.querySelector("div#app"),
  mode: "history",
  routes: [
    { path: "/", component: document.createElement("timer-page") },
    { path: "/test/:id", component: document.createElement("regex-page") },
    { path: "/404", component: document.createElement("not-found-page") },
    // { path: "*", redirect: "/404" },
  ],
};
