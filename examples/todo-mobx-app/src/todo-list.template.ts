import { html, repeat } from "@microsoft/fast-element";
import type { Todo } from "./state/index.js";
import type { TodoList } from "./todo-list.js";

export const template = html<TodoList>`
    <ul class="todo-list">
        ${repeat(
            x => x.items,
            html<Todo>`
                <li class="todo-row">
                    <todo-item :todo=${x => x}></todo-item>
                </li>
            `,
            // recycle: false makes the repeat directive tear down and recreate
            // each <todo-item> view when the list mutates. Without this, FAST
            // would reuse existing rows (rebinding `:todo` to a different Todo)
            // while the per-row MobX reaction is still subscribed to the
            // previous Todo's observables — leaving stale `done`/`description`
            // tracking behind. Disabling recycling guarantees the bridge always
            // disposes and re-establishes reactions against the current Todo.
            { positioning: true, recycle: false },
        )}
    </ul>
`;
