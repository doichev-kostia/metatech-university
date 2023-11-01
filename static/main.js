import { client } from "./client/api.js";

const form = document.querySelector("#get-user");
const output = document.querySelector("#output");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const id = formData.get("id");
    const response = await client.api.user.read({id});
    const data = await response.json();
    output.innerHTML = toHTML(data);
});

function toHTML(struct) {
    return `
    <pre>${JSON.stringify(struct, null, 2)}</pre>
    `
}
