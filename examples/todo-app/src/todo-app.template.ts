import { html, repeat } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/binding/two-way";
import type { TodoApp } from "./todo-app.js";
import type { Todo } from "./todo-list.js";
import { definition } from "./todo-form.js";

function delayRenderTodoForm() {
    window.setTimeout(() => {
        definition.define();
    }, 3200);
    return html`
        <todo-form></todo-form>
    `;
}

export const template = html<TodoApp>`
    <h1>FAST Todos</h1>

    ${delayRenderTodoForm}

    <section>
        <label for="filter">Filter:</label>
        <select name="filter" title="filter" :value=${twoWay(x => x.todos.activeFilter)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
        </select>
    </section>

    <ul class="todo-list">
        ${repeat(
            x => x.todos.filtered,
            html<Todo, TodoApp>`
                <li class="todo">
                    <input type="checkbox" :checked=${twoWay(x => x.done)} />
                    <span class="description ${x => (x.done ? "done" : "")}">
                        ${x => x.description}
                    </span>
                    <button
                        @click=${(x, c) => c.parent.todos.remove(x)}
                        aria-label="Remove item"
                    >
                        &times;
                    </button>
                </li>
            `
        )}
    </ul>
`;
