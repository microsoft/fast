import { html, when } from "@microsoft/fast-element";
import type { TodoStats } from "./todo-stats.js";

export const template = html<TodoStats>`
    <footer class="stats">
        <span class="count">
            <strong>${x => x.activeCount}</strong>
            ${x => (x.activeCount === 1 ? "item" : "items")} left
        </span>

        <button
            type="button"
            class="toggle-all"
            @click=${x => x.toggleAll()}
            aria-pressed="${x => (x.allCompleted ? "true" : "false")}"
        >
            ${x => (x.allCompleted ? "Mark all active" : "Mark all done")}
        </button>

        ${when(
            x => x.hasCompleted,
            html<TodoStats>`
                <button
                    type="button"
                    class="clear-completed"
                    @click=${x => x.clearCompleted()}
                >
                    Clear completed (${x => x.completedCount})
                </button>
            `,
        )}
    </footer>
`;
