export const render = () => {
  window.requestAnimationFrame(() => {
    const app = document.getElementById("app");
    const virtualApp = getVirtualDom("app");
    changeDiff(document.body, app, virtualApp.view());
  });
};
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
    return this.#state;
  }
  get methods() {
    return this.#methods;
  }
  #state = {};
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

      for (let methodName in this.#methods) {
        this.#methods[methodName] = this.#methods[methodName].bind(this);
      }
    }
  }
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = "";
      this.shadowRoot.appendChild(this.#view());
      this.#created();
    }

    this.#connected();
  }

  render(callback) {
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
    this.render(this.#updated);
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

/*
@params 
- mode: <'hash'|'history'> / hash모드로 동작할지 history모드로 동작할지 결정하는 옵션
*/
export class Router {
  container = null;
  mode = "hash";
  routes = [];
  notFound = () => {
    this.container.textContent = "Page Not Found";
  };

  router = {};
  checkRoute() {
    const currentRoute = this.routes.find((route) => {
      return "#" + route.path === window.location.hash;
    });

    if (!currentRoute) {
      this.notFound();
      return;
    }
    this.container.innerHTML = "";
    this.container.appendChild(currentRoute.component);
  }
  navigate(to) {
    window.location.hash = to;
  }
  constructor({ container = document.body, mode = "hash", routes = [] }) {
    this.container = container;
    this.mode = mode;
    this.routes = routes;
    window.addEventListener("hashchange", this.checkRoute.bind(this));
    console.log(window.location.hash);
    if (!window.location.hash) {
      window.location.hash = "#/";
    }

    this.checkRoute();
  }
}

let router = null;
export const registRouter = (newRouter) => {
  router = newRouter;
};
