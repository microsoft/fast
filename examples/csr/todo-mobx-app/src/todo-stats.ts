import { autorun } from "mobx";
import { FASTElement, observable } from "@microsoft/fast-element";
import { todoStore } from "./state/index.js";
import { styles } from "./todo-stats.styles.js";
import { template } from "./todo-stats.template.js";

/**
 * Shows aggregate counts and exposes the "clear completed" and "toggle all"
 * actions.
 *
 * Each surfaced number is a MobX `computed` on the store; a single `autorun`
 * mirrors them into FAST `@observable` fields so the template re-renders
 * precisely when those counts change.
 */
export class TodoStats extends FASTElement {
    @observable public activeCount: number = 0;
    @observable public completedCount: number = 0;
    @observable public allCompleted: boolean = false;
    @observable public hasCompleted: boolean = false;

    private _disposer?: () => void;

    public connectedCallback(): void {
        this._disposer = autorun(() => {
            this.activeCount = todoStore.activeCount;
            this.completedCount = todoStore.completedCount;
            this.allCompleted = todoStore.allCompleted;
            this.hasCompleted = todoStore.completedCount > 0;
        });
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._disposer?.();
        this._disposer = undefined;
    }

    public clearCompleted(): void {
        todoStore.clearCompleted();
    }

    public toggleAll(): void {
        todoStore.toggleAll();
    }
}

TodoStats.define({
    name: "todo-stats",
    template,
    styles,
});
