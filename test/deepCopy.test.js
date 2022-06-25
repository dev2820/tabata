import { expect } from "expect";
import Time from "../src/modules/time";

let clone = (orig) => {
  return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
};
test("instance clone", () => {
  class Test {
    constructor(message) {
      this.message = message;
    }
    get hello() {
      return "hello :)";
    }
    getMessage() {
      return this.message;
    }
  }

  const inst = new Test("A");

  const inst2 = clone(inst);
  inst.message = "B";

  expect(inst2.message).toBe("A");
  expect(inst.message).toBe("B");

  expect(inst2.hello).toBe("hello :)");
});

test("object clone", () => {
  const temp = {
    msg: "message",
  };
  const temp2 = clone(temp);
  temp2.msg = "hi";

  expect(temp.msg).toBe("message");
  expect(temp2.msg).toBe("hi");
});

test("instance in object clone", () => {
  const temp = {
    num: 10,
    time: new Time({ sec: 100 }),
  };
  expect(temp.time.toString()).toBe("+00:01:40");
  const temp2 = clone(temp);
  temp2.num = 3;
  temp.time = temp.time.decrease1sec();

  expect(temp.time.toString()).toBe("+00:01:39");
  expect(temp2.time.toString()).toBe("+00:01:40");

  expect(temp.num).toBe(10);
  expect(temp2.num).toBe(3);
});
