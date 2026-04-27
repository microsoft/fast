import { customElement, FASTElement } from "@microsoft/fast-element/fast-element.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { styles } from "./todo-form.styles.js";
import { template } from "./todo-form.template.js";
import { TodoList } from "./todo-list.js";

@customElement({
    name: "todo-form",
    template,
    styles,
})
export class TodoForm extends FASTElement {
    @observable public description: string = "";
    @TodoList todos!: TodoList;

    public submitTodo() {
        this.description && this.todos.add(this.description);
        this.description = "";
    }
}
