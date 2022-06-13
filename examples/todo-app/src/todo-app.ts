import { FASTElement } from "@microsoft/fast-element";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";
import { TodoList } from "./todo-list.js";

export class TodoApp extends FASTElement {
    @TodoList todos!: TodoList;
}

export const app = FASTElement.metadata(TodoApp, {
    name: "todo-app",
    template,
    styles,
});
