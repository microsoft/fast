import { html, when } from "@microsoft/fast-element";
import type { TodoApp } from "./todo-app.js";

export const template = html<TodoApp>`
    <section class="app">
        <header>
            <h1>FAST · MobX Todos</h1>
            <p class="byline">
                A todo example wired to a MobX store through the
                <code>@mobxObserver</code> bridge.
            </p>
        </header>

        <todo-form></todo-form>

        ${when(
            x => x.hasTodos,
            html<TodoApp>`
                <todo-filter></todo-filter>
                <todo-list></todo-list>
                <todo-stats></todo-stats>
            `,
        )}

        ${when(
            x => !x.hasTodos,
            html<TodoApp>`
                <p class="empty">No todos yet — add your first above.</p>
            `,
        )}
    </section>
`;
