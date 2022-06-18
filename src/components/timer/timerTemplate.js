const template = document.createElement("template");
template.className = "template timer";
template.innerHTML = `
<style></style>
<span class="minutes"></span>
<span class="colon">:</span>
<span class="seconds"></span>
`;

export default template;
