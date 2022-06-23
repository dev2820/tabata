export default {
  container: document.querySelector("div#app"),
  mode: "hash",
  routes: [
    { path: "/test/:id", component: document.createElement("regex-page") },
    { path: "/", component: document.createElement("timer-page") },
    { path: "/404", component: document.createElement("not-found-page") },
    // { path: "*", redirect: "/404" },
  ],
};
