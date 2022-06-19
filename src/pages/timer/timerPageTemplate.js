const template = document.createElement("template");
template.className = "template timer-page";
template.innerHTML = `
<style></style>
<main>
    <section class="timer-zone">
        <h2 class="phase"></h2>
        <my-timer class="timer"></my-timer>
        <my-reps></my-reps>
        <run-and-stop-button class="run-and-stop"></run-and-stop-button>
    </section>
</main>
`;

export default template;
