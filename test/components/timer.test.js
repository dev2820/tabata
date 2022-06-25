/*
 * @jest-environment jsdom
 */
import { expect } from "expect";
import Time from "../../src/modules/time";
import Timer from "../../src/components/timer/timer";
import { jest } from "@jest/globals";
import { registApp, registTemplate, render } from "../../core";
import timerTemplate from "../../src/components/timer/timerTemplate";
import timerPageTemplate from "../../src/pages/timer/timerPage";
import buttonTemplate from "../../src/components/button/buttonTemplate.js";

async function waitRequestAnimationFrame() {
  await new Promise((resolve) =>
    window.requestAnimationFrame(() => {
      resolve();
    })
  );
}
describe("timer dom", () => {
  registTemplate(timerPageTemplate);
  registTemplate(timerTemplate);
  registTemplate(buttonTemplate);
  window.customElements.define("my-timer", Timer);

  test("init", async () => {
    const dom = document.createElement("div");
    dom.innerHTML = `
        <my-timer></my-timer>
    `;
    const timer = dom.querySelector("my-timer");
    timer.startTime = new Time({ sec: 10 }); // timer의 update가 발생해 dom이 업데이트 될 예정
    await waitRequestAnimationFrame(); //다음 reflow까지 대기
    expect(timer.shadowRoot.querySelector("span.minutes").innerText).toBe("00");
    expect(timer.shadowRoot.querySelector("span.seconds").innerText).toBe("10");
  });
});
