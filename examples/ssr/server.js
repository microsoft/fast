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
            <script>
                // Be careful in production environments embedding JSON.
                // In general the JSON should be sanitized to prevent
                // JSON injection attacks.
                window.__SSR_STATE__ = ${() => JSON.stringify(todoData)};
            </script>
            <style>
                #hydration-message {
                    max-width: 500px;
                }
            </style>
        <body>
            <todo-app></todo-app>
            <div id="hydration-message">
                <p>To better illustrate the output of <code>@microsoft/fast-ssr</code>, this page does not automatically load the JavaScript  define the custom elements. In most cases, defining the custom elements ASAP will lead to better user experience. To define the elements and make them functional, click the <a href="#hydrate">hydrate button</a> blow.</p>
                <button id="hydrate">hydrate</button>
            </div>
            <script>
                const scriptLoader = document.getElementById("hydrate");
                const container = document.getElementById('hydration-message');
                scriptLoader.addEventListener("click", () => {
                    const script = document.createElement("script");
                    script.src = "/bundle.js";
                    document.body.appendChild(script);
                    container.parentNode.removeChild(container);
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

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
