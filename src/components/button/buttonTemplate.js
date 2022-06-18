const template = document.createElement("template");
template.className = "template button";
template.innerHTML = `
    <style></style>
    <button class="time">
        <slot name="label"></slot>
    </button>
`;

export default template;
