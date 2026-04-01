import { FASTElement, observable } from "@microsoft/fast-element";
import { TodoList } from "./todo-list.js";

export class TodoForm extends FASTElement {
    @observable public description: string = "";
    @TodoList todos!: TodoList;

    public submitTodo() {
        this.description && this.todos.add(this.description);
        this.description = "";
    }
}
