const template = document.createElement("template");
template.className = "template not-found-page";
template.innerHTML = `
<div id="not-found-page">
    <style></style>
    <header>
        <router-link to="/">홈으로</router-link>
    </header>
    <main>
        <h2>404</h2>
        <h3>Page Not Found</h3>
        <p>oops!</p>
    </main>
</div>
`;

export default template;
