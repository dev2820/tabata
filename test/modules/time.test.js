import { expect } from "expect";
import Time from "../../src/modules/time";

test("Time module create test", () => {
  let timeBeZero = new Time({}); // 기본적으로 0시로 초기화됨
  expect(timeBeZero.toString()).toBe("+00:00:00");

  let timeBe1m40s = new Time({ sec: 100 }); // 1분 40초짜리 시간을 생성(이 시간은 불변하게 작성할 예정)
  // let time2 = new Time({ min: 1, sec: 40 }); // 1분 40초짜리 시간을 생성하는 다른 방법
  expect(timeBe1m40s.toString()).toBe("+00:01:40");

  let longTime = new Time({ hr: 8, min: 30, sec: 29 });
  expect(longTime.toString()).toBe("+08:30:29");

  //milliSec은 toString에 포함되지 않는다
  let milliSecTime = new Time({ sec: 1, milliSec: 500 });
  expect(milliSecTime.toString()).toBe("+00:00:01");

  let minusTime = new Time({ sec: -100 }); // 음수 시간도 설정 가능
  expect(minusTime.toString()).toBe("-00:01:40");
});

test("Time module decrease test", () => {
  let timeZero = new Time({});
  let timeMinus1s = timeZero.decrease1sec(); // 1초 감소
  expect(timeMinus1s.toString()).toBe("-00:00:01");

  let time1hour = new Time({ hr: 1 });
  let timeBe59m59s = time1hour.decrease1sec();
  expect(timeBe59m59s.toString()).toBe("+00:59:59");
});

test("Time module left test", () => {
  let time = new Time({ sec: 3 });
  expect(time.isLeft({ sec: 3 })).toBe(true);
  expect(time.isLeftUnder({ sec: 4 })).toBe(true);
  expect(time.isLeftUnder({ sec: 3 })).toBe(false);
  time = time.decrease1sec();
  expect(time.isLeft({ sec: 2 })).toBe(true);
  expect(time.isLeftUnder({ sec: 3 })).toBe(true);

  let zeroTime = new Time({ sec: 0 });
  expect(zeroTime.isLeft({ sec: 0 })).toBe(true);

  let time500ms = new Time({ milliSec: 500 });
  expect(time500ms.isLeft({ milliSec: 500 })).toBe(true);
  expect(time500ms.isLeftUnder({ sec: 1 })).toBe(true);
  expect(time500ms.isLeft({ sec: 0 })).toBe(false);
});
