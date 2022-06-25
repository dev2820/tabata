export default class Phase {
  reps = 0;
  name = "";
  constructor(phaseName, reps) {
    this.name = phaseName;
    this.reps = reps;
  }
}

export class StartPhase extends Phase {
  constructor(reps) {
    super("start", reps);
  }
}

export class RunPhase extends Phase {
  constructor(reps) {
    super("run", reps);
  }
}

export class BreakPhase extends Phase {
  constructor(reps) {
    super("break", reps);
  }
}

export class EndPhase extends Phase {
  constructor(reps) {
    super("end", reps);
  }
}
