import { client } from "./client/api.js";

const button = document.querySelector("#btn");

button.addEventListener("click", async () => {
   const response = await client.api.user.read({ id: 3 });
   const data = await response.json();
   console.dir({ data })
});
