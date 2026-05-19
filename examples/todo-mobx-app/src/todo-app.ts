import { autorun } from "mobx";
import { FASTElement, observable } from "@microsoft/fast-element";
import { todoStore } from "./state/index.js";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";

/**
 * Root component for the MobX-backed todo example.
 *
 * Holds no state of its own — every value rendered comes from the shared MobX
 * `todoStore`. A single `autorun` in `connectedCallback` mirrors the slices of
 * the store this component reads into plain FAST `@observable` fields; the
 * template binds to those fields as usual.
 */
export class TodoApp extends FASTElement {
    @observable public total: number = 0;
    @observable public hasTodos: boolean = false;

    private _disposer?: () => void;

    public connectedCallback(): void {
        this._disposer = autorun(() => {
            this.total = todoStore.total;
            this.hasTodos = todoStore.total > 0;
        });
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._disposer?.();
        this._disposer = undefined;
    }
}

export const app = TodoApp.compose({
    name: "todo-app",
    template,
    styles,
});
