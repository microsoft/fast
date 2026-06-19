import { html, repeat } from "@microsoft/fast-element";
import { twoWay } from "@microsoft/fast-element/two-way.js";
import { type Todo, todoStore } from "./state/index.js";
import type { TodoApp } from "./todo-app.js";
import "./todo-form.js";

export const template = html<TodoApp>`
    <h1>FAST Todos</h1>

    <todo-form></todo-form>

    <section>
        <label for="filter">Filter:</label>
        <select
            name="filter"
            id="filter"
            title="filter"
            :value=${twoWay(x => x.activeFilter)}
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
                        @change=${x => todoStore.toggleById(x.id)}
                    />
                    <span class="description ${x => (x.done ? "done" : "")}">
                        ${x => x.description}
                    </span>
                    <button
                        @click=${x => todoStore.removeById(x.id)}
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
