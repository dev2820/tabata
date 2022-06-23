import { registTemplate } from "/core";

const template = document.createElement("template");
template.className = "template reps";
template.innerHTML = `
<div class="reps">
  <style></style>
  <span class="current-reps"></span>
  <span class="goal-reps"></span>
</div>
`;

export default template;

registTemplate(template);
