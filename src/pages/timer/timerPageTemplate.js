import { registTemplate } from "/core";

const template = document.createElement("template");
template.className = "template timer-page";
template.innerHTML = `
<div id="timer-page">
    <style></style>
    <header>
        <router-link to="/404">notfound 링크</router-link>
        <router-link to="/test/1">1번 링크</router-link>
        <router-link to="/test/2">2번 링크</router-link>
    </header>
    <main>
        <section class="timer-zone">
            <h2 class="phase"></h2>
            <my-timer class="timer"></my-timer>
            <my-reps></my-reps>
            <div class="controller">
                <button class="prev">
                    <img src="/src/assets/icons/prev.png"/>
                </button>
                <button class="run-and-stop">정지</button>
                <button class="next">
                    <img src="/src/assets/icons/next.png"/>
                </button>
            </div>
        </section>
    </main>
</div>
`;

export default template;
registTemplate(template);
