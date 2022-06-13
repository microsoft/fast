import { Observable, observable, volatile } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context";
import { makeObservable } from "@microsoft/fast-element/utilities";

export type Todo = { description: string; done: boolean };
export type TodoListFilter = "all" | "active" | "completed";
export const TodoList = Context.create<TodoList>("TodoList");
export interface TodoList {
    activeFilter: TodoListFilter;
    readonly filtered: readonly Todo[];
    add(description: string): void;
    remove(todo: Todo): void;
}

export class DefaultTodoList {
    @observable private _todos: Todo[] = [];
    @observable public activeFilter: TodoListFilter = "all";

    @volatile
    public get filtered(): readonly Todo[] {
        switch (this.activeFilter) {
            case "active":
                return this._todos.filter(x => !x.done);
            case "completed":
                return this._todos.filter(x => x.done);
            default:
                return this._todos;
        }
    }

    public add(description: string) {
        this.splice(this._todos.length, 0, makeObservable({ description, done: false }));
    }

    public remove(todo: Todo) {
        const index = this._todos.indexOf(todo);
        index !== -1 && this.splice(index, 1);
    }

    private splice(index: number, removeCount: number, ...newItem: Todo[]) {
        this._todos.splice(index, removeCount, ...newItem);
        this.activeFilter !== "all" && Observable.notify(this, "_todos");
    }
}
