import { FASTElement } from "@microsoft/fast-element";
import { TodoList } from "./todo-list.js";

export class TodoApp extends FASTElement {
    @TodoList todos!: TodoList;
}
