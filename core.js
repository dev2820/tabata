export const registTemplate = (template) => {
  document.body.appendChild(template);
};

export const changeDiff = (parentNode, realNode, virtualNode) => {
  if (!realNode && !virtualNode) {
    // 두 노두 모두 없다 -> 아무것도 안함
    return;
  }

  if (realNode && !virtualNode) {
    //virtualNode가 없다 -> realNode를 삭제한다
    realNode.remove();
    return;
  }
  if (!realNode && virtualNode) {
    // realNode가 없다 -> virtualNode를 부모노드에 추가해준다.
    parentNode.appendChild(virtualNode);
    return;
  }

  //두 노두 모두 있는 경우
  //차이를 비교한다.
  if (isDiff(realNode, virtualNode)) {
    realNode.replaceWith(virtualNode);
    return;
  }
  const realChildren = [...realNode.children];
  const virtualChildren = [...virtualNode.children];
  for (
    let i = 0;
    i < Math.max(realChildren.length, virtualChildren.length);
    i++
  ) {
    const realChild = realChildren[i];
    const virtualChild = virtualChildren[i];
    changeDiff(realNode, realChild, virtualChild);
  }
};

const isDiff = (nodeA, nodeB) => {
  if (nodeA.tagName !== nodeB.tagName) {
    //태그 이름이 다르다.
    return true;
  }

  if (nodeA.attributes.length !== nodeB.attributes.length) {
    //속성 비교 - 길이가 다른가?
    return true;
  } else {
    //속성 비교 - 내용이 다른가?
    for (let i = 0; i < nodeA.attributes.length; i++) {
      const attrA = nodeA.attributes[i];

      const name = attrA.name;
      if (nodeA.getAttribute(name) !== nodeB.getAttribute(name)) {
        return true;
      }
    }
  }

  if (nodeA.className !== nodeB.className) {
    return true;
  }
  if (
    nodeA.children.length === 0 &&
    nodeB.children.length === 0 &&
    nodeA.textContent !== nodeB.textContent
  ) {
    //내용 비교
    return true;
  }

  return false;
};

export const loadTemplate = (query) => {
  const temp = document.createElement("div");
  temp.appendChild(document.querySelector(query).content.cloneNode(true));
  return temp.firstElementChild;
};

export const registComponent = (name, component) => {
  if (!window.customElements[name]) {
    window.customElements.define(name, component);
  }
};

export class Component extends HTMLElement {
  $ = (query) => {
    return this.shadowRoot.querySelector(query);
  };
  get $el() {
    return this.shadowRoot.firstElementChild;
  }
  get state() {
    return Object.freeze(_.deepCopy(this.#state));
  }
  get methods() {
    return this.#methods;
  }
  get store() {
    return this.#store;
  }
  #unsubscribeList = new Map();
  #state = {};
  #store = {};
  #methods = {};
  #view = () => {
    return null;
  };
  constructor(setup) {
    super();
    if (setup) {
      setup.created && (this.#created = setup.created.bind(this));
      setup.updated && (this.#updated = setup.updated.bind(this));
      setup.connected && (this.#connected = setup.connected.bind(this));
      setup.state && (this.#state = setup.state);
      setup.methods && (this.#methods = setup.methods);
      setup.view && (this.#view = setup.view);
      setup.store && (this.#store = setup.store);

      for (let methodName in this.#methods) {
        this.#methods[methodName] = this.#methods[methodName].bind(this);
      }

      for (let storeName in this.#store) {
        let unsubscribe = this.#store[storeName].subscribe(
          this.#render.bind(this)
        );
        this.#unsubscribeList.set(storeName, unsubscribe);
      }
    }
  }
  unsubscribe(name) {
    if (this.#unsubscribeList.has(name)) {
      this.#unsubscribeList.get(name)();
      this.#unsubscribeList.delete(name);
    }
  }
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = "";
      this.shadowRoot.appendChild(this.#view());
      this.#created();
    } else {
      this.#render(this.#connected);
    }
  }

  #render(callback) {
    window.requestAnimationFrame(() => {
      const virtualDOM = this.#view();
      changeDiff(
        this.shadowRoot,
        this.shadowRoot.firstElementChild,
        virtualDOM
      );
      if (callback) callback();
    });
  }
  #created = function () {};
  #update() {
    this.#render(this.#updated);
  }
  #connected = function () {}; //first) this가 텅 빈 상태 (state 등은 있지만 내부 요소가 없음) => 이벤트 등은 여기서 걸어주자.
  #updated = function () {};
  setView(view) {
    this.#view = view;
  }
  setMethods(methods) {
    this.#methods = {
      ...this.#methods,
      ...methods,
    };
  }
  setState(newState) {
    this.#state = {
      ...this.#state,
      ...newState,
    };
    this.#update();
  }
}

const ROUTE_PARAMETER_REGEXP = /:(\w+)/g;
const URL_FRAGMENT_REGEXP = "([^\\/]+)";
/*
@params 
- mode: <'hash'|'history'> / hash모드로 동작할지 history모드로 동작할지 결정하는 옵션
*/
class Router {
  container = null;
  mode = "hash";
  routes = [];

  router = {};
  _findRoute(path) {
    return this.routes.find((route) => {
      return route.testRegExp.test(path);
    });
  }
  notFound() {
    this.container.textContent = "Page Not Found";
  }

  _checkRoute() {
    if (!this.currentRoute) {
      this.notFound();
      return;
    }

    this.container.innerHTML = "";
    this.container.appendChild(this.currentRoute.component);
  }
  _extractUrlParams(route, pathname) {
    const params = {};
    if (route.params.length === 0) {
      return params;
    }
    const matches = pathname.match(route.testRegExp);

    matches.shift(); // 불필요한 정보 제거
    matches.forEach((paramValue, index) => {
      const paramName = route.params[index];
      params[paramName] = paramValue;
    });

    return params;
  }
  constructor({ container = document.body, mode, routes }) {
    this.container = container;
    this.mode = mode;
    this.routes = routes;
  }
}

export class HashRouter extends Router {
  router = {};
  get currentRoute() {
    return super._findRoute(window.location.hash);
  }
  navigate(to) {
    window.location.hash = to;
  }
  extractUrlParams() {
    return super._extractUrlParams(this.currentRoute, window.location.hash);
  }
  constructor({ container = document.body, routes }) {
    const newRoutes = routes.map(({ path, component }) => {
      const params = [];
      const parsedPath = path
        .replace(ROUTE_PARAMETER_REGEXP, (match, paramName) => {
          params.push(paramName);
          return URL_FRAGMENT_REGEXP;
        })
        .replace(/\//g, "\\/");

      return {
        testRegExp: new RegExp(`^#${parsedPath}$`),
        params,
        component: component(),
      };
    });

    super({
      container,
      mode: "hash",
      routes: newRoutes,
    });
    window.addEventListener("hashchange", super._checkRoute.bind(this));
    if (!window.location.hash) {
      window.location.hash = "#/";
    }

    super._checkRoute();
  }
}
export class HistoryRouter extends Router {
  router = {};
  lastPathName = "";

  get currentRoute() {
    return super._findRoute(window.location.pathname);
  }
  constructor({ container = document.body, routes = [] }) {
    const newRoutes = routes.map(({ path, component }) => {
      const params = [];
      const parsedPath = path
        .replace(ROUTE_PARAMETER_REGEXP, (match, paramName) => {
          params.push(paramName);
          return URL_FRAGMENT_REGEXP;
        })
        .replace(/\//g, "\\/");

      return {
        testRegExp: new RegExp(`^${parsedPath}$`),
        params,
        component: component(),
      };
    });

    super({
      container,
      mode: "history",
      routes: newRoutes,
    });
    window.addEventListener("popstate", this.checkRoute.bind(this));
    this.checkRoute();
  }

  checkRoute() {
    super._checkRoute();
  }

  extractUrlParams() {
    return super._extractUrlParams(this.currentRoute, window.location.pathname);
  }
  go(index) {
    window.history.go(index);
    this.checkRoute();
  }
  back() {
    window.history.back();
    this.checkRoute();
  }
  forward() {
    window.history.forward();
    this.checkRoute();
  }
  push(to) {
    window.history.pushState(null, "", to);
    this.checkRoute();
  }
  replace(to) {
    window.history.replaceState(null, "", to);
    this.checkRoute();
  }
}

let router = null;
export const createRouter = (options) => {
  if (options.mode === "history") {
    return new HistoryRouter(options);
  } else if (options.mode === "hash") {
    return new HashRouter(options);
  } else {
    throw Error(`${options.mode} is not defined`);
  }
};
export const registRouter = (newRouter) => {
  router = newRouter;
};

export const $router = new Proxy(
  {},
  {
    get: function (target, name) {
      return router[name];
    },
  }
);
export const $route = new Proxy(
  {},
  {
    get: function (target, name) {
      if (name === "params") {
        if (router instanceof Router) {
          const urlParams = router.extractUrlParams();
          return urlParams;
        }
        return {};
      }
    },
  }
);

let globalStore = new Map();
export const registGlobalStore = (name, newStore) => {
  globalStore.set(name, newStore);
};

export const useGlobalStore = (name) => {
  return globalStore.get(name);
};
