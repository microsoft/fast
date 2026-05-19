import { html } from "@microsoft/fast-element";
import type { TodoFilter } from "./todo-filter.js";

export const template = html<TodoFilter>`
    <nav class="filters" aria-label="Filter todos">
        <button
            type="button"
            class="${x => (x.activeFilter === "all" ? "active" : "")}"
            @click=${x => x.setFilter("all")}
        >
            All
        </button>
        <button
            type="button"
            class="${x => (x.activeFilter === "active" ? "active" : "")}"
            @click=${x => x.setFilter("active")}
        >
            Active
        </button>
        <button
            type="button"
            class="${x => (x.activeFilter === "completed" ? "active" : "")}"
            @click=${x => x.setFilter("completed")}
        >
            Completed
        </button>
    </nav>
`;
