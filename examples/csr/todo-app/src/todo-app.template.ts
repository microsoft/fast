import { html } from "@microsoft/fast-element/html.js";
import { repeat } from "@microsoft/fast-element/repeat.js";
import type { TodoApp } from "./todo-app.js";
import type { Todo, TodoListFilter } from "./todo-list.js";
import "./todo-form.js";

export const template = html<TodoApp>`
    <h1>FAST Todos</h1>

    <todo-form></todo-form>

    <section>
        <label for="filter">Filter:</label>
        <select
            name="filter"
            title="filter"
            :value=${x => x.activeFilter}
            @change=${(x, c) =>
                x.setFilter(
                    (c.event.target as HTMLSelectElement).value as TodoListFilter,
                )}
        >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
        </select>
    </section>

    <ul class="todo-list">
        ${repeat(
            x => x.items,
            html<Todo, TodoApp>`
                <li class="todo">
                    <input
                        type="checkbox"
                        :checked=${x => x.done}
                        @change=${(x, c) => c.parent.toggle(x)}
                    />
                    <span class="description ${x => (x.done ? "done" : "")}">
                        ${x => x.description}
                    </span>
                    <button
                        @click=${(x, c) => c.parent.removeTodo(x)}
                        aria-label="Remove item"
                    >
                        &times;
                    </button>
                </li>
            `,
        )}
    </ul>

    <footer>
        <span class="active-count">
            ${x => `${x.activeCount} ${x.activeCount === 1 ? "item" : "items"} left`}
        </span>
        <span aria-hidden="true">·</span>
        <span class="completed-count">${x => `${x.completedCount} completed`}</span>
    </footer>
`;
