import { html } from "@microsoft/fast-element";
import type { TodoItem } from "./todo-item.js";

export const template = html<TodoItem>`
    <div class="todo">
        <input
            type="checkbox"
            aria-label="Toggle completion"
            :checked=${x => x.done}
            @change=${x => x.toggle()}
        />
        <span class="description ${x => (x.done ? "done" : "")}">
            ${x => x.description}
        </span>
        <button
            class="remove"
            type="button"
            aria-label="Remove item"
            @click=${x => x.remove()}
        >
            &times;
        </button>
    </div>
`;
