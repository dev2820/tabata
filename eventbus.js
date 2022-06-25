const freeze = (obj) => {
  return Object.freeze(_.deepCopy(obj));
};

export default (model) => {
  let listeners = [];
  let watchers = [];
  let state = model();
  // 이벤트 등록
  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      // unsubscriber
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  //state 변형에 따라 등록된 리스너 호출
  const invokeSubscribers = () => {
    listeners.forEach((l) => l());
  };

  // 이벤트 발생
  const dispatch = (event) => {
    const newState = model(state, event); //이벤트를 적용해 새로운 state를 생성

    if (!newState) {
      throw new Error("model should always return a value");
    }
    if (newState === state) {
      //새로운 state와 기존 state가 같다면 변화 x
      return;
    }
    watchers.forEach(({ stateName, callback }) => {
      if (state[stateName] !== newState[stateName]) {
        callback(state[stateName], newState[stateName]);
      }
    });
    state = newState; //새로운 state를 적용

    invokeSubscribers(); //state에 따른 리스너 실행
  };

  const registWatcher = (stateName, callback) => {
    //callback은 dispatch를 일으키면 안된다(무한 루프에 빠질 수 있음)
    watchers.push({
      stateName,
      callback,
    });

    return () => {
      // unwatcher
      watchers = watchers.filter((watcher) => {
        const name = watcher.stateName;
        const cb = watcher.callback;
        stateName !== name && callback !== cb;
      });
    };
  };
  return {
    registWatcher,
    subscribe,
    dispatch,
    getState: () => freeze(state),
  };
};
