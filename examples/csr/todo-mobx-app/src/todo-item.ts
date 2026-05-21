import { autorun } from "mobx";
import { FASTElement, observable } from "@microsoft/fast-element";
import { type Todo, todoStore } from "./state/index.js";
import { styles } from "./todo-item.styles.js";
import { template } from "./todo-item.template.js";

/**
 * Renders a single todo row.
 *
 * Receives its `todo` via property binding from `<todo-list>`. When that
 * property is assigned, `todoChanged` rebuilds the per-item `autorun` so the
 * row's `done`/`description` always track the *current* Todo's observables —
 * which also means the `<todo-list>` `repeat` directive can recycle views
 * safely.
 */
export class TodoItem extends FASTElement {
    @observable public todo!: Todo;
    @observable public done: boolean = false;
    @observable public description: string = "";

    private _disposer?: () => void;
    private _connected: boolean = false;

    public connectedCallback(): void {
        this._connected = true;
        this.startReaction();
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._connected = false;
        this.stopReaction();
    }

    public todoChanged(): void {
        if (this._connected) {
            this.startReaction();
        }
    }

    public toggle(): void {
        if (this.todo !== undefined) {
            todoStore.toggle(this.todo);
        }
    }

    public remove(): void {
        if (this.todo !== undefined) {
            todoStore.remove(this.todo);
        }
    }

    private startReaction(): void {
        this.stopReaction();
        if (this.todo === undefined) {
            return;
        }
        this._disposer = autorun(() => {
            const todo = this.todo;
            this.done = todo.done;
            this.description = todo.description;
        });
    }

    private stopReaction(): void {
        this._disposer?.();
        this._disposer = undefined;
    }
}

TodoItem.define({
    name: "todo-item",
    template,
    styles,
});
