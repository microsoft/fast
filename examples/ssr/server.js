/* eslint-disable no-undef */
import "@microsoft/fast-ssr/install-dom-shim";
import fs from "fs";
import { html } from "@microsoft/fast-element";
import fastSSR, { RequestManager } from "@microsoft/fast-ssr";
import express from "express";
import { DefaultTodoList, app as todoApp, TodoList } from "fast-todo-app";

const app = express();
const port = 8080;
const { templateRenderer, defaultRenderInfo } = fastSSR();

todoApp.define();

app.use(RequestManager.middleware());
app.use(express.static("./www"));

const template = html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SSR Example</title>
                <!--
                    Use caution in production environments embedding JSON.
                    In general the JSON should be sanitized to prevent
                    JSON injection attacks.
                -->
            <script>window.__SSR_STATE__ = ${() =>
                JSON.stringify(TodoList.get(document).all)};
            </script>
        <body>
            <todo-app></todo-app>
            <script src="/bundle.js" defer></script>
        </body>
    </html>
`;

app.get("/", (req, res) => {
    const todoData = JSON.parse(fs.readFileSync("./todo-data.json").toString());
    TodoList.provide(document, new DefaultTodoList(todoData));

    const stream = templateRenderer.render(template, defaultRenderInfo);

    for (const part of stream) {
        res.write(part);
    }

    res.end();
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
