const template = document.createElement("template");
template.className = "template timer-page";
template.innerHTML = `
<style></style>
<section class="timer-zone">
    <my-timer class="timer" is-run="true"></my-timer>
    <my-reps></my-reps>
    <run-and-stop-button class="run-and-stop"></run-and-stop-button>
</section>

`;

export default template;
