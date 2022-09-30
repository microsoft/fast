import { App } from "./app.js";

App;

document.documentElement.style.height = "100%";
document.documentElement.style.fontFamily = "sans-serif";
document.body.style.margin = "0";
document.body.style.height = "100%";
document.body.style.display = "flex";
const app = document.createElement("app-main");
document.body.appendChild(app);
