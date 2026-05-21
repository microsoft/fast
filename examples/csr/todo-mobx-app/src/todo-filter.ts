import { autorun } from "mobx";
import { FASTElement, observable } from "@microsoft/fast-element";
import { type TodoListFilter, todoStore } from "./state/index.js";
import { styles } from "./todo-filter.styles.js";
import { template } from "./todo-filter.template.js";

/**
 * Filter buttons for switching the visible todo set.
 *
 * `activeFilter` is mirrored from the MobX store into a FAST `@observable` via
 * a single `autorun`, so the button highlight reactively follows the store's
 * filter setting.
 */
export class TodoFilter extends FASTElement {
    @observable public activeFilter: TodoListFilter = "all";

    private _disposer?: () => void;

    public connectedCallback(): void {
        this._disposer = autorun(() => {
            this.activeFilter = todoStore.activeFilter;
        });
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._disposer?.();
        this._disposer = undefined;
    }

    public setFilter(filter: TodoListFilter): void {
        todoStore.setFilter(filter);
    }
}

TodoFilter.define({
    name: "todo-filter",
    template,
    styles,
});
