import { Context } from "@microsoft/fast-element/context.js";
import { Observable, observable } from "@microsoft/fast-element/observable.js";
import { reactive } from "@microsoft/fast-element/state.js";

export type Todo = { description: string; done: boolean };
export type TodoListFilter = "all" | "active" | "completed";
export const TodoList = Context.create<TodoList>("TodoList");
export interface TodoList {
    activeFilter: TodoListFilter;
    readonly filtered: readonly Todo[];
    readonly activeCount: number;
    readonly completedCount: number;
    add(description: string): void;
    remove(todo: Todo): void;
    toggle(todo: Todo): void;
    setFilter(filter: TodoListFilter): void;
}

export class DefaultTodoList {
    @observable private _todos: Todo[] = [];
    @observable public activeFilter: TodoListFilter = "all";
    @observable public filtered: readonly Todo[] = [];
    @observable public activeCount: number = 0;
    @observable public completedCount: number = 0;

    public get all() {
        return this._todos;
    }

    constructor(todos?: Todo[]) {
        if (todos) {
            this._todos = todos.map(x => reactive(x));
        }
        this.syncDerivedState();
    }

    public add(description: string) {
        this.splice(this._todos.length, 0, reactive({ description, done: false }));
    }

    public remove(todo: Todo) {
        const index = this._todos.indexOf(todo);
        index !== -1 && this.splice(index, 1);
    }

    public toggle(todo: Todo) {
        todo.done = !todo.done;
        this.syncDerivedState();
    }

    public setFilter(filter: TodoListFilter): void {
        this.activeFilter = filter;
        this.syncDerivedState();
    }

    public activeFilterChanged(): void {
        this.syncDerivedState();
    }

    /**
     * This method centralizes all updates to the internal array so that we
     * can guarantee that observers are notified in the appropriate cases.
     */
    private splice(index: number, removeCount: number, ...newItem: Todo[]) {
        this._todos.splice(index, removeCount, ...newItem);

        // Notify FAST that the dependent _todos observable has changed. Both
        // the filtered list (when activeFilter is "active" or "completed") and
        // the count getters (activeCount / completedCount) depend on the
        // array structure, so we always emit the notification.
        Observable.notify(this, "_todos");
        this.syncDerivedState();
    }

    private syncDerivedState(): void {
        switch (this.activeFilter) {
            case "active":
                this.filtered = this._todos.filter(x => !x.done);
                break;
            case "completed":
                this.filtered = this._todos.filter(x => x.done);
                break;
            default:
                this.filtered = this._todos;
        }

        this.activeCount = this._todos.reduce((n, item) => n + (item.done ? 0 : 1), 0);
        this.completedCount = this._todos.reduce((n, item) => n + (item.done ? 1 : 0), 0);
    }
}
