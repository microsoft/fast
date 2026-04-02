import fs from "node:fs";
import { build, render } from "@microsoft/webui";
import express from "express";
import rateLimit from "express-rate-limit";

const app = express();
const port = 8081;

const todoRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Build templates into a binary protocol at startup (build-time compilation)
const result = build({ appDir: "./src", plugin: "fast" });

// The f-template elements define the declarative FAST component templates for
// client-side hydration. They use single-brace {} bindings so the SSR step
// does not attempt to fill them in — FAST-html resolves them in the browser.
const COMPONENT_TEMPLATES = `
<f-template name="todo-app">
    <template>
        <style>
            :host {
                display: block;
                padding: 16px;
                max-width: 320px;
            }
            .todo-list {
                list-style-type: none;
                padding: 0;
            }
            .todo {
                margin: 8px 0px;
                display: flex;
            }
            .description {
                display: inline-block;
                align-self: center;
                margin: 0px 8px;
                flex: 1;
            }
            .description.done {
                text-decoration: line-through;
            }
        </style>
        <h1>FAST Todos</h1>
        <todo-form></todo-form>
        <section>
            <label for="filter">Filter:</label>
            <select name="filter" title="filter" :value="{todos.activeFilter}">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
            </select>
        </section>
        <ul class="todo-list">
            <f-repeat value="{item in todos.filtered}">
                <li class="todo">
                    <input type="checkbox" :checked="{item.done}" />
                    <span class="description">{item.description}</span>
                    <button @click="{$c.parent.todos.remove(item)}" aria-label="Remove item">&times;</button>
                </li>
            </f-repeat>
        </ul>
    </template>
</f-template>
<f-template name="todo-form">
    <template>
        <style>
            form {
                display: flex;
                align-items: center;
            }
            button {
                margin: 4px;
            }
        </style>
        <form @submit="{submitTodo()}">
            <input type="text" :value="{description}" />
            <button type="submit" ?disabled="{!description}">Add Todo</button>
        </form>
    </template>
</f-template>
`;

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function renderTodoItems(todos) {
    if (todos.length === 0) return "";
    return todos
        .map(
            todo => `
        <li class="todo">
            <input type="checkbox"${todo.done ? " checked" : ""} />
            <span class="description${todo.done ? " done" : ""}">${escapeHtml(todo.description)}</span>
            <button aria-label="Remove item">&times;</button>
        </li>`,
        )
        .join("");
}

app.use(express.static("./www"));

app.get("/", todoRateLimiter, (req, res) => {
    const todoData = JSON.parse(fs.readFileSync("./todo-data.json").toString());

    // Render the page template using webui, injecting prerendered todo items and
    // the declarative component template definitions as raw HTML
    const html = render(result.protocol, {
        prerenderedItems: renderTodoItems(todoData),
        componentTemplates: COMPONENT_TEMPLATES,
    });

    // Inject initial state so the client-side FAST components can hydrate with
    // the same data that was used for prerendering
    const withState = html.replace(
        "</body>",
        `<script>window.__INITIAL_STATE__ = ${JSON.stringify(todoData)};</script></body>`,
    );

    res.send(withState);
});

app.listen(port, () => {
    console.log(`WebUI Todo app listening on port ${port}`);
});
