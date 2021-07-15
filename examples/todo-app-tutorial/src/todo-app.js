var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import {
    customElement,
    FASTElement,
    html,
    css,
    attr,
    repeat,
    observable,
} from "@microsoft/fast-element";
import { typography } from "./typography";
import { TodoItem } from "./todo-item";
function eventDetail(ctx) {
    return ctx.event.detail;
}
const template = html`
    <h1>${x => x.heading}</h1>

    <todo-form @todo-submit=${(x, c) => x.addTodo(eventDetail(c))}></todo-form>

    <ul>
        ${repeat(
            x => x.todos,
            html`
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
let TodoApp = class TodoApp extends FASTElement {
    constructor() {
        super(...arguments);
        this.heading = "Todos";
        this.todos = [];
    }
    addTodo(description) {
        this.todos.push(new TodoItem(description));
    }
    removeTodo(record) {
        const index = this.todos.indexOf(record);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }
};
__decorate([attr], TodoApp.prototype, "heading", void 0);
__decorate([observable], TodoApp.prototype, "todos", void 0);
TodoApp = __decorate(
    [
        customElement({
            name: "todo-app",
            template,
            styles,
        }),
    ],
    TodoApp
);
export { TodoApp };
