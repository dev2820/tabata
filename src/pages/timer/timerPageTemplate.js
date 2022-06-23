import { registTemplate } from "/core";

const template = document.createElement("template");
template.className = "template timer-page";
template.innerHTML = `
<div id="timer-page">
    <style></style>
    <header>
        <router-link to="/timer">타이머 링크</router-link>
        <router-link to="/404">notfound 링크</router-link>
    </header>
    <main>
        <section class="timer-zone">
            <h2 class="phase"></h2>
            <my-timer class="timer"></my-timer>
            <my-reps></my-reps>
            <run-and-stop-button class="run-and-stop"></run-and-stop-button>
        </section>
    </main>
</div>
`;

export default template;
registTemplate(template);
