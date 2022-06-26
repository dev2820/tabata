import Time from "../modules/time";
import Phase, {
  RunPhase,
  BreakPhase,
  StartPhase,
  EndPhase,
  RunTickPhase,
  BreakTickPhase,
} from "../modules/phase";
//event == action 이다
const INITIAL_STATE = {
  runTime: new Time({ min: 0, sec: 5 }),
  breakTime: new Time({ min: 0, sec: 3 }),
  goal: 0,
  phaseList: [],
  currentPhaseIndex: 0,
  currentPhase: new Phase(),
  isRun: false,
  isStartPhase() {
    return this.currentPhase instanceof StartPhase;
  },
  isRunPhase() {
    return this.currentPhase instanceof RunPhase;
  },
  isBreakPhase() {
    return this.currentPhase instanceof BreakPhase;
  },
  isEndPhase() {
    return this.currentPhase instanceof EndPhase;
  },
};
const makePhaseList = ({ goal, runTime, breakTime }) => {
  if (goal < 1) return null;

  let reps = 1;
  const list = [];
  for (let i = 0; i < goal - 1; i++) {
    list.push(new RunTickPhase(reps));
    list.push(new RunPhase(reps, runTime));
    list.push(new BreakTickPhase(reps));
    list.push(new BreakPhase(reps, breakTime));
    reps++;
  }
  list.push(new RunTickPhase(reps));
  list.push(new RunPhase(reps, runTime));
  list.push(new EndPhase(reps));

  return list;
};
const initExercise = (state, action) => {
  const { runTime, breakTime, goal } = action.payload;
  if (!goal) {
    return state;
  }
  const newPhaseList = makePhaseList({ goal, runTime, breakTime });
  return {
    ...state,
    runTime,
    breakTime,
    goal,
    phaseList: newPhaseList,
    currentPhaseIndex: 0,
    currentPhase: newPhaseList[0],
  };
};
const nextPhase = (state, action) => {
  const nextIndex = state.currentPhaseIndex + 1;
  if (nextIndex >= state.phaseList.length) {
    const currentIndex = state.currentPhaseIndex;
    state.phaseList[currentIndex].currentTime =
      state.phaseList[currentIndex].startTime;
    return {
      ...state,
    };
  }
  state.phaseList[nextIndex].currentTime = state.phaseList[nextIndex].startTime;
  return {
    ...state,
    currentPhaseIndex: nextIndex,
    currentPhase: state.phaseList[nextIndex],
  };
};

const prevPhase = (state, action) => {
  const prevIndex = state.currentPhaseIndex - 1;

  if (prevIndex < 0) {
    const currentIndex = state.currentPhaseIndex;
    state.phaseList[currentIndex].currentTime =
      state.phaseList[currentIndex].startTime;
    return {
      ...state,
    };
  }

  state.phaseList[prevIndex].currentTime = state.phaseList[prevIndex].startTime;
  return {
    ...state,
    currentPhaseIndex: prevIndex,
    currentPhase: state.phaseList[prevIndex],
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

const nextTime = (state, action) => {
  const nextTime = action.payload;
  state.currentPhase.currentTime = nextTime;

  return {
    ...state,
  };
};
const methods = Object.freeze({
  INIT_EXERCISE: initExercise,
  NEXT_PHASE: nextPhase,
  PREV_PHASE: prevPhase,
  NEXT_TIME: nextTime,
  STOP: stop,
  RUN: run,
});

export const EVENT_TYPES = Object.freeze({
  INIT_EXERCISE: "INIT_EXERCISE",
  NEXT_PHASE: "NEXT_PHASE",
  PREV_PHASE: "PREV_PHASE",
  NEXT_TIME: "NEXT_TIME",
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
