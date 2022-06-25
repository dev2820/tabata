import Time from "../modules/Time";
import { RunPhase, BreakPhase, StartPhase, EndPhase } from "../modules/phase";
//event == action 이다
// let deepCopy = (obj) => {
//   return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
// };
let deepCopy = (obj) => {
  let clone = Object.create(Object.getPrototypeOf(obj));
  let props = Object.getOwnPropertyNames(obj);
  props.forEach(function (key) {
    let desc = Object.getOwnPropertyDescriptor(obj, key);
    Object.defineProperty(clone, key, desc);
  });

  return clone;
};
const INITIAL_STATE = {
  runTime: new Time({ min: 0, sec: 5 }),
  breakTime: new Time({ min: 0, sec: 3 }),
  goal: 0,
  phaseList: [],
  currentPhaseIndex: 0,
  get currentPhase() {
    return this.phaseList[this.currentPhaseIndex];
  },
  get currentReps() {
    return this.currentPhase?.reps;
  },
  get isStart() {
    return this.currentPhase instanceof StartPhase;
  },
  get isRun() {
    return this.currentPhase instanceof RunPhase;
  },
  get isBreak() {
    return this.currentPhase instanceof BreakPhase;
  },
  get isEnd() {
    return this.currentPhase instanceof EndPhase;
  },
};
const makePhaseList = (goal) => {
  if (goal < 1) return null;

  let reps = 0;
  const list = [];
  list.push(new StartPhase(reps));
  reps++;
  for (let i = 0; i < goal - 1; i++) {
    list.push(new RunPhase(reps));
    list.push(new BreakPhase(reps));
    reps++;
  }
  list.push(new RunPhase(reps));
  list.push(new EndPhase(reps));

  return list;
};
const initExercise = (state, action) => {
  const { runTime, breakTime, goal } = action.payload;
  if (!goal) {
    return state;
  }

  const newPhaseList = makePhaseList(goal);
  const newState = deepCopy(state);
  newState.runTime = runTime;
  newState.breakTime = breakTime;
  newState.goal = goal;
  newState.phaseList = newPhaseList;
  return newState;
};
const nextPhase = (state, action) => {
  const nextIndex = state.currentPhaseIndex + 1;
  if (nextIndex >= state.phaseList.length) {
    return state;
  }

  return {
    ...state,
    currentPhaseIndex: nextIndex,
  };
};

const prevPhase = (state, action) => {
  const prevIndex = state.currentPhaseIndex - 1;
  if (prevIndex < 0) {
    return state;
  }

  return {
    ...state,
    currentPhaseIndex: prevIndex,
  };
};

const methods = Object.freeze({
  INIT_EXERCISE: initExercise,
  NEXT_PHASE: nextPhase,
  PREV_PHASE: prevPhase,
});

export const EVENT_TYPES = Object.freeze({
  INIT_EXERCISE: "INIT_EXERCISE",
  NEXT_PHASE: "NEXT_PHASE",
  PREV_PHASE: "PREV_PHASE",
});

export default (initialState = INITIAL_STATE) => {
  return (state, action) => {
    if (!state) {
      return deepCopy(initialState);
    }
    const currentMethod = methods[action.type];
    if (!currentMethod) {
      return state;
    }
    return currentMethod(state, action);
  };
};
