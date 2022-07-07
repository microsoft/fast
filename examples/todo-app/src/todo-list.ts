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

    public get all() {
        return this._todos;
    }

    @volatile
    public get filtered(): readonly Todo[] {
        // This property is decorated with @volatile because the exact
        // observable dependencies of the property can change between
        // invocations. Normally, FAST assumes that the dependencies of
        // a binding are the same across invocations, for optimization
        // purposes. So, in this case, we need to tell the system not to
        // make that assumption.

        switch (this.activeFilter) {
            case "active":
                return this._todos.filter(x => !x.done);
            case "completed":
                return this._todos.filter(x => x.done);
            default:
                return this._todos;
        }
    }

    constructor(todos?: Todo[]) {
        if (todos) {
            this._todos = todos.map(x => makeObservable(x));
        }
    }

    public add(description: string) {
        this.splice(this._todos.length, 0, makeObservable({ description, done: false }));
    }

    public remove(todo: Todo) {
        const index = this._todos.indexOf(todo);
        index !== -1 && this.splice(index, 1);
    }

    /**
     * This method centralizes all updates to the internal array so that we
     * can guarantee that observers are notified in the appropriate cases.
     */
    private splice(index: number, removeCount: number, ...newItem: Todo[]) {
        this._todos.splice(index, removeCount, ...newItem);

        // Because the filtered property returns different arrays depending
        // on the filter, we need to notify FAST that the dependent _todos
        // observable has changed whenever we splice the internal data structure.
        this.activeFilter !== "all" && Observable.notify(this, "_todos");
    }
}
