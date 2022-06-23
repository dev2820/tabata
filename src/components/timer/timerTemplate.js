const template = document.createElement("template");
template.className = "template timer";
template.innerHTML = `
<div class="timer">
    <style></style>
    <span class="minutes"></span>
    <span class="colon">:</span>
    <span class="seconds"></span>
</div>
`;

export default template;
