import { Context } from "@microsoft/fast-element/context.js";
import { Observable, observable } from "@microsoft/fast-element/observable.js";
import { reactive } from "@microsoft/fast-element/state.js";
import { volatile } from "@microsoft/fast-element/volatile.js";

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

    @volatile
    public get activeCount(): number {
        // This getter is decorated with @volatile because the array's
        // length and the set of tracked item.done properties can change
        // between invocations. Without @volatile, FAST captures the
        // dependency graph on first evaluation only — at startup the
        // array is empty, so no item.done subscriptions get registered
        // and later toggles don't re-run the binding.
        return this._todos.reduce((n, item) => n + (item.done ? 0 : 1), 0);
    }

    @volatile
    public get completedCount(): number {
        // See note on activeCount for why this getter is @volatile.
        return this._todos.reduce((n, item) => n + (item.done ? 1 : 0), 0);
    }

    constructor(todos?: Todo[]) {
        if (todos) {
            this._todos = todos.map(x => reactive(x));
        }
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
        this.notifyDerivedState();
    }

    public activeFilterChanged(): void {
        Observable.notify(this, "filtered");
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
        this.notifyDerivedState();
    }

    private notifyDerivedState(): void {
        Observable.notify(this, "filtered");
        Observable.notify(this, "activeCount");
        Observable.notify(this, "completedCount");
    }
}
