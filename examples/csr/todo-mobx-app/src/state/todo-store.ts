import { makeAutoObservable } from "mobx";

/** The supported filters for displaying todos. */
export type TodoListFilter = "all" | "active" | "completed";

/** A single todo item in the store. */
export type Todo = {
    id: string;
    description: string;
    done: boolean;
};

type TodoStoreHydration = {
    todos?: unknown;
    activeFilter?: unknown;
};

function isTodoListFilter(value: unknown): value is TodoListFilter {
    return value === "all" || value === "active" || value === "completed";
}

function isTodo(value: unknown): value is Todo {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const todo = value as Partial<Todo>;

    return (
        typeof todo.id === "string" &&
        typeof todo.description === "string" &&
        typeof todo.done === "boolean"
    );
}

/** Manages todos, filters, and derived counts for the example app. */
export class TodoStore {
    /** The full list of todos. */
    public todos: Todo[] = [];

    /** The currently applied list filter. */
    public activeFilter: TodoListFilter = "all";

    /** Creates a store and optionally seeds it with hydrated todos. */
    public constructor(initialTodos?: Todo[]) {
        makeAutoObservable(this);
        this.hydrate({
            todos: initialTodos ?? [],
        });
    }

    /** The todos visible under the current filter. */
    public get filtered(): readonly Todo[] {
        switch (this.activeFilter) {
            case "active":
                return this.todos.filter(todo => !todo.done);
            case "completed":
                return this.todos.filter(todo => todo.done);
            default:
                return this.todos;
        }
    }

    /** The number of active todos. */
    public get activeCount(): number {
        return this.todos.length - this.completedCount;
    }

    /** The number of completed todos. */
    public get completedCount(): number {
        return this.todos.filter(todo => todo.done).length;
    }

    /** The total number of todos. */
    public get total(): number {
        return this.todos.length;
    }

    /** Whether every todo is completed. */
    public get allCompleted(): boolean {
        return this.total > 0 && this.completedCount === this.total;
    }

    /** Adds a todo when the description is not empty after trimming. */
    public add(description: string): void {
        const trimmedDescription = description.trim();

        if (trimmedDescription === "") {
            return;
        }

        this.todos.push({
            id: this.generateId(),
            description: trimmedDescription,
            done: false,
        });
    }

    /** Removes a todo by id. */
    public remove(todo: Todo): void {
        this.todos = this.todos.filter(candidate => candidate.id !== todo.id);
    }

    /** Removes a todo by its id. */
    public removeById(id: string): void {
        this.todos = this.todos.filter(candidate => candidate.id !== id);
    }

    /** Toggles a todo's completion state. */
    public toggle(todo: Todo): void {
        const target = this.todos.find(candidate => candidate.id === todo.id);

        if (target === undefined) {
            return;
        }

        target.done = !target.done;
    }

    /** Toggles a todo's completion state by id. */
    public toggleById(id: string): void {
        const target = this.todos.find(candidate => candidate.id === id);

        if (target === undefined) {
            return;
        }

        target.done = !target.done;
    }

    /** Marks every todo done or active based on the current aggregate state. */
    public toggleAll(): void {
        const nextDoneState = !this.allCompleted;

        for (const todo of this.todos) {
            todo.done = nextDoneState;
        }
    }

    /** Removes all completed todos. */
    public clearCompleted(): void {
        this.todos = this.todos.filter(todo => !todo.done);
    }

    /** Updates the active filter. */
    public setFilter(filter: TodoListFilter): void {
        this.activeFilter = filter;
    }

    /** Replaces store state from a validated hydration payload. */
    public hydrate(snapshot: unknown): void {
        if (Array.isArray(snapshot)) {
            const nextTodos = this.validateTodos(snapshot);

            if (nextTodos !== undefined) {
                this.todos = nextTodos;
            }

            return;
        }

        if (typeof snapshot !== "object" || snapshot === null) {
            return;
        }

        const { activeFilter, todos } = snapshot as TodoStoreHydration;
        const nextTodos = this.validateTodos(todos);

        if (nextTodos === undefined) {
            return;
        }

        this.todos = nextTodos;

        if (isTodoListFilter(activeFilter)) {
            this.activeFilter = activeFilter;
        }
    }

    private generateId(): string {
        if (typeof globalThis.crypto?.randomUUID === "function") {
            return globalThis.crypto.randomUUID();
        }

        return Math.random().toString(36).slice(2);
    }

    private validateTodos(value: unknown): Todo[] | undefined {
        if (!Array.isArray(value) || !value.every(isTodo)) {
            return undefined;
        }

        const todos = value as Todo[];

        return todos.map(todo => ({
            id: todo.id,
            description: todo.description,
            done: todo.done,
        }));
    }
}

/** The shared todo store instance for the example app. */
export const todoStore = new TodoStore();
