import { FASTElement } from "@microsoft/fast-element";
import { mobxObservableProperty, mobxObserver } from "./mobx-integration/index.js";
import { todoStore } from "./state/index.js";
import { styles } from "./todo-stats.styles.js";
import { template } from "./todo-stats.template.js";

/**
 * Shows aggregate counts and exposes the "clear completed" and "toggle all"
 * actions.
 *
 * Each surfaced number is a MobX `computed` on the store reached through a
 * `@mobxObservableProperty` getter, so this component re-renders precisely
 * when those counts change, not every time `todos` is touched.
 */
export class TodoStats extends FASTElement {
    @mobxObservableProperty
    public get activeCount(): number {
        return todoStore.activeCount;
    }

    @mobxObservableProperty
    public get completedCount(): number {
        return todoStore.completedCount;
    }

    @mobxObservableProperty
    public get allCompleted(): boolean {
        return todoStore.allCompleted;
    }

    @mobxObservableProperty
    public get hasCompleted(): boolean {
        return todoStore.completedCount > 0;
    }

    public clearCompleted(): void {
        todoStore.clearCompleted();
    }

    public toggleAll(): void {
        todoStore.toggleAll();
    }
}

mobxObserver(TodoStats);

TodoStats.define({
    name: "todo-stats",
    template,
    styles,
});
