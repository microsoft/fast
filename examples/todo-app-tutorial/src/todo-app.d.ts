import { FASTElement } from "@microsoft/fast-element";
import { TodoItem } from "./todo-item";
export declare class TodoApp extends FASTElement {
    heading: string;
    todos: TodoItem[];
    addTodo(description: string): void;
    removeTodo(record: TodoItem): void;
}
