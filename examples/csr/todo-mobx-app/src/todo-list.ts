import { autorun } from "mobx";
import { FASTElement, observable } from "@microsoft/fast-element";
import { type Todo, todoStore } from "./state/index.js";
import { styles } from "./todo-list.styles.js";
import { template } from "./todo-list.template.js";

/**
 * Renders the list of todos filtered by the store's current filter.
 *
 * Mirrors the MobX `todoStore.filtered` computed into a FAST `@observable`
 * array so the `repeat` directive in the template re-renders when the filter
 * changes or todos are added/removed. Per-todo state changes are tracked
 * inside each `<todo-item>` to keep updates fine-grained.
 */
export class TodoList extends FASTElement {
    @observable public items: readonly Todo[] = [];

    private _disposer?: () => void;

    public connectedCallback(): void {
        this._disposer = autorun(() => {
            this.items = todoStore.filtered;
        });
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._disposer?.();
        this._disposer = undefined;
    }
}

TodoList.define({
    name: "todo-list",
    template,
    styles,
});
