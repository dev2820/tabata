const freeze = (obj) => {
  return Object.freeze(_.deepCopy(obj));
};

export default (model) => {
  let listeners = [];
  let state = model();
  // 이벤트 등록
  const subscribe = (listener) => {
    listeners.push(listener);

    return () => {
      // unsubscriber
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  //???
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

    state = newState; //새로운 state를 적용

    invokeSubscribers(); //state에 따른 리스너 실행
  };

  return {
    subscribe,
    dispatch,
    getState: () => freeze(state),
  };
};
