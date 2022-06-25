import Time from "../modules/Time";
import { RunPhase, BreakPhase, StartPhase, EndPhase } from "../modules/phase";
//event == action 이다
const INITIAL_STATE = {
  runTime: new Time({ min: 0, sec: 5 }),
  breakTime: new Time({ min: 0, sec: 3 }),
  goal: 0,
  phaseList: [],
  currentPhaseIndex: 0,
  isRun: false,
  getCurrentPhase() {
    return this.phaseList[this.currentPhaseIndex];
  },
  isStartPhase() {
    return this.getCurrentPhase() instanceof StartPhase;
  },
  isRunPhase() {
    return this.getCurrentPhase() instanceof RunPhase;
  },
  isBreakPhase() {
    return this.getCurrentPhase() instanceof BreakPhase;
  },
  isEndPhase() {
    return this.getCurrentPhase() instanceof EndPhase;
  },
};
const makePhaseList = ({ goal, runTime, breakTime }) => {
  if (goal < 1) return null;

  let reps = 1;
  const list = [];
  for (let i = 0; i < goal - 1; i++) {
    list.push(new RunPhase(reps, runTime));
    list.push(new BreakPhase(reps, breakTime));
    reps++;
  }
  list.push(new RunPhase(reps, runTime));
  list.push(new EndPhase(reps));

  return list;
};
const initExercise = (state, action) => {
  const { runTime, breakTime, goal } = action.payload;
  if (!goal) {
    return state;
  }

  return {
    ...state,
    runTime,
    breakTime,
    goal,
    phaseList: makePhaseList({ goal, runTime, breakTime }),
  };
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

const run = (state, action) => {
  return {
    ...state,
    isRun: true,
  };
};

const stop = (state, action) => {
  return {
    ...state,
    isRun: false,
  };
};
const methods = Object.freeze({
  INIT_EXERCISE: initExercise,
  NEXT_PHASE: nextPhase,
  PREV_PHASE: prevPhase,
  STOP: stop,
  RUN: run,
});

export const EVENT_TYPES = Object.freeze({
  INIT_EXERCISE: "INIT_EXERCISE",
  NEXT_PHASE: "NEXT_PHASE",
  PREV_PHASE: "PREV_PHASE",
  STOP: "STOP",
  RUN: "RUN",
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
