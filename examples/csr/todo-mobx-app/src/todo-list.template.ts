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
            { positioning: true },
        )}
    </ul>
`;
