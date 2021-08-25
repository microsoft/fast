import {
    customElement,
    FASTElement,
    html,
    css,
    attr,
    repeat,
    observable,
    ExecutionContext,
} from "@microsoft/fast-element";
import { typography } from "./typography";
import { TodoItem } from "./todo-item";
import { fillColor, neutralForegroundRest } from "@fluentui/web-components";

function eventDetail<T = any>(ctx: ExecutionContext) {
    return (ctx.event as CustomEvent).detail as T;
}

const template = html<TodoApp>`
    <h1>${x => x.heading}</h1>

    <todo-form @todo-submit=${(x, c) => x.addTodo(eventDetail(c))}></todo-form>

    <ul>
        ${repeat(
            x => x.todos,
            html<TodoItem, TodoApp>`
                <li>
                    <fluent-checkbox
                        checked=${x => x.done}
                        @change=${x => x.toggleDone()}
                    ></fluent-checkbox>
                    <span class="list-text ${x => (x.done ? "done" : "")}">
                        ${x => x.description}
                    </span>
                    <fluent-button
                        @click=${(x, c) => c.parent.removeTodo(x)}
                        aria-label="Remove item"
                    >
                        &times;
                    </fluent-button>
                </li>
            `
        )}
    </ul>
`;

const styles = css`
    ${typography} :host {
        display: block;
        padding: 16px;
        background: ${fillColor};
        color: ${neutralForegroundRest};
        height: 100%;
    }

    ul {
        list-style-type: none;
        padding: 0;
        width: 325px;
    }

    li {
        margin: 8px 0px;
        display: flex;
    }

    .list-text {
        display: inline-block;
        align-self: center;
        margin: 0px 8px;
        flex: 1;
    }

    .done {
        text-decoration: line-through;
    }
`;

@customElement({
    name: "todo-app",
    template,
    styles,
})
export class TodoApp extends FASTElement {
    @attr heading = "Todos";
    @observable todos: TodoItem[] = [];

    public addTodo(description: string) {
        this.todos.push(new TodoItem(description));
    }

    public removeTodo(record: TodoItem) {
        const index = this.todos.indexOf(record);

        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }
}
