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

app.use(express.static("./src"));

const template = html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SSR Example</title>
        </head>
        <body>
            <todo-app></todo-app>
        </body>
    </html>
`;

app.get("/", async (req, res) => {
    const stream = templateRenderer.render(template, defaultRenderInfo);

    for (const part of stream) {
        res.write(part);
    }

    res.end();
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
