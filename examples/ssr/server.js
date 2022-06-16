import "@microsoft/fast-ssr/install-dom-shim";
import fs from "fs";
import { html } from "@microsoft/fast-element";
import fastSSR from "@microsoft/fast-ssr";
import express from "express";
import "fast-todo-app";
import { DefaultTodoList, app as todoApp, TodoList } from "fast-todo-app";

const app = express();
const port = 8080;
const { templateRenderer, defaultRenderInfo } = fastSSR();
const todoData = JSON.parse(fs.readFileSync("./todo-data.json").toString());

/* eslint-disable-next-line */
TodoList.provide(document, new DefaultTodoList(todoData));
todoApp.define();

app.use(express.static("./www"));

const template = html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SSR Example</title>
        <body>
            <todo-app></todo-app>
            <button id="hydrate">hydrate</button>
            <script>
                const scriptLoader = document.getElementById("hydrate");
                scriptLoader.addEventListener("click", () => {
                    const script = document.createElement("script");
                    script.src = "/bundle.js";
                    document.body.appendChild(script);
                    scriptLoader.parentNode.removeChild(scriptLoader);
                });
            </script>
        </body>
    </html>
`;

app.get("/", (req, res) => {
    const stream = templateRenderer.render(template, defaultRenderInfo);

    for (const part of stream) {
        res.write(part);
    }

    res.end();
});

app.get("/todos", (req, res) => {
    res.json(todoData);
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
