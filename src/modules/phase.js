import Time from "./Time";

export default class Phase {
  reps = 0;
  name = "";
  time = new Time({ sec: 0 });
  constructor(phaseName, reps, time) {
    this.name = phaseName;
    this.reps = reps;
    this.time = time;
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

export class EndPhase extends Phase {
  constructor(reps) {
    super("end", reps, new Time({ sec: 0 }));
  }
}
