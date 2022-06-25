//event == action 이다
const INITIAL_STATE = {
  counter: 3,
};

const increase = (state, action) => {
  return {
    ...state,
    counter: state.counter + 1,
  };
};

const setCounter = (state, action) => {
  let newCounter = action.payload;
  if (!newCounter) {
    return state;
  }

  if (typeof newCounter !== typeof 0) {
    return state;
  }

  return {
    ...state,
    counter: newCounter,
  };
};
const methods = Object.freeze({
  INCREASE: increase,
  SET_COUNTER: setCounter,
});

export const EVENT_TYPES = Object.freeze({
  INCREASE: "INCREASE",
  SET_COUNTER: "SET_COUNTER",
});

export default (initialState = INITIAL_STATE) => {
  return (state, action) => {
    if (!state) {
      return _.deepCopy(initialState);
    }
    const currentMethod = methods[action.type];
    if (!currentMethod) {
      return state;
    }
    return currentMethod(state, action);
  };
};
