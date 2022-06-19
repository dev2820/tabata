function* createPhase(goal) {
  //run break run break run
  let reps = 1;
  while (reps < goal) {
    yield new Phase("run", reps);
    yield new Phase("break", reps);
    reps++;
  }
  yield new Phase("run", reps);
  return;
}
class Phase {
  reps = 0;
  name = "";
  constructor(phaseName, reps) {
    this.name = phaseName;
    this.reps = reps;
  }
}
export default class Exercise {
  phaseHistory = [new Phase("start", 0)];
  goal = 0;
  #phaseGenerator = null;
  constructor(goal) {
    this.#phaseGenerator = createPhase(goal);
    this.goal = goal;
  }
  get phase() {
    return this.phaseHistory[this.phaseHistory.length - 1];
  }
  get isEnd() {
    return this.phase.name === "end";
  }
  get isRun() {
    return this.phase.name === "run" || this.phase.name === "break";
  }
  stop() {
    if (this.phaseHistory[this.phaseHistory.length - 1] !== "stop") {
      this.phaseHistory.push(new Phase("stop", this.phase.reps));
    }
  }
  continue() {
    if (this.phaseHistory[this.phaseHistory.length - 1].name === "stop") {
      this.phaseHistory.pop();
    }
  }
  next() {
    if (this.isEnd) return;

    let { value, done } = this.#phaseGenerator.next();
    if (done) {
      this.phaseHistory.push(new Phase("end", this.phase.reps));
      return;
    }
    this.phaseHistory.push(value);
  }
}
