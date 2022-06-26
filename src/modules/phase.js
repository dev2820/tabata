import Time from "./time";
const en2kor = {
  start: "시작",
  break: "휴식중",
  run: "운동중",
  end: "종료",
  runTick: "운동 시작!",
  breakTick: "휴식 시작!",
};
export default class Phase {
  reps = 0;
  name = "";
  startTime = new Time({ sec: 0 });
  currentTime = new Time({ sec: 0 });
  get korLabel() {
    return en2kor[this.name];
  }
  constructor(phaseName, reps, time) {
    this.name = phaseName;
    this.reps = reps;
    this.startTime = time;
    this.currentTime = this.startTime;
  }
}

export class StartPhase extends Phase {
  constructor(reps) {
    super("start", reps, new Time({ sec: 0 }));
  }
}

export class RunPhase extends Phase {
  constructor(reps, time) {
    super("run", reps, time);
  }
}

export class BreakPhase extends Phase {
  constructor(reps, time) {
    super("break", reps, time);
  }
}

export class RunTickPhase extends Phase {
  constructor(reps) {
    super("runTick", reps, new Time({ sec: 1 }));
  }
}
export class BreakTickPhase extends Phase {
  constructor(reps) {
    super("breakTick", reps, new Time({ sec: 1 }));
  }
}
export class EndPhase extends Phase {
  constructor(reps) {
    super("end", reps, new Time({ sec: 0 }));
  }
}
