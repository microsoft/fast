import { autorun } from "mobx";
import { FASTElement, observable } from "@microsoft/fast-element";
import { type Todo, type TodoListFilter, todoStore } from "./state/index.js";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";

/**
 * Root component for the MobX-backed todo example.
 *
 * Mirrors slices of the shared MobX `todoStore` (`filtered` list and
 * `activeFilter`) into FAST `@observable` fields via a single `autorun`. The
 * template binds to those fields as usual. The `<select>` element uses a
 * two-way binding to `activeFilter`; `activeFilterChanged` propagates user
 * changes back to the MobX store.
 */
export class TodoApp extends FASTElement {
    @observable public items: readonly Todo[] = [];
    @observable public activeFilter: TodoListFilter = "all";
    @observable public activeCount: number = 0;
    @observable public completedCount: number = 0;

    private _disposer?: () => void;

    public connectedCallback(): void {
        this._disposer = autorun(() => {
            this.items = todoStore.filtered.map(t => ({
                id: t.id,
                description: t.description,
                done: t.done,
            }));
            this.activeFilter = todoStore.activeFilter;
            this.activeCount = todoStore.activeCount;
            this.completedCount = todoStore.completedCount;
        });
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._disposer?.();
        this._disposer = undefined;
    }

    public activeFilterChanged(
        _prev: TodoListFilter | undefined,
        next: TodoListFilter | undefined,
    ): void {
        if (next !== undefined && next !== todoStore.activeFilter) {
            todoStore.setFilter(next);
        }
    }
}

export const app = TodoApp.compose({
    name: "todo-app",
    template,
    styles,
});
