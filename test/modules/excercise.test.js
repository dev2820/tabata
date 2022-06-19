import { expect } from "expect";
import Exercise from "../../src/modules/exercise";

test("Exercise create", () => {
  let exercise = new Exercise(2);
  expect(exercise.phase.name).toBe("start");
  expect(exercise.phase.reps).toBe(0);
  exercise.next();
  expect(exercise.phase.name).toBe("run");
  expect(exercise.phase.reps).toBe(1);
  exercise.next();
  expect(exercise.phase.name).toBe("break");
  expect(exercise.phase.reps).toBe(1);
  exercise.next();
  expect(exercise.phase.name).toBe("run");
  expect(exercise.phase.reps).toBe(2);
  exercise.next();
  expect(exercise.phase.name).toBe("end");
});

test("Exercise stop and continue", () => {
  let exercise = new Exercise(2);
  exercise.next();
  expect(exercise.phase.name).toBe("run");
  exercise.stop();
  expect(exercise.phase.name).toBe("stop");
  exercise.continue();
  expect(exercise.phase.name).toBe("run");
  exercise.next();
  expect(exercise.phase.name).toBe("break");
});

test("Exercise state", () => {
  let exercise = new Exercise(1);
  expect(exercise.isRun).toBe(false);
  exercise.next();
  expect(exercise.isRun).toBe(true);
  exercise.next();
  expect(exercise.isEnd).toBe(true);
});
