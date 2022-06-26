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
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-left" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <polyline points="11 7 6 12 11 17" />
                <polyline points="17 7 12 12 17 17" />
                </svg>
              </button>
                <button class="run-and-stop">정지</button>
                <button class="next">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-right" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <polyline points="7 7 12 12 7 17" />
                    <polyline points="13 7 18 12 13 17" />
                </svg>
              </button>
            </div>
        </section>
    </main>
</div>
`;

export default template;
registTemplate(template);
