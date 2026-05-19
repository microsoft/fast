import { FASTElement } from "@microsoft/fast-element";
import { mobxObservableProperty, mobxObserver } from "./mobx-integration/index.js";
import { type TodoListFilter, todoStore } from "./state/index.js";
import { styles } from "./todo-filter.styles.js";
import { template } from "./todo-filter.template.js";

/**
 * Filter buttons for switching the visible todo set.
 *
 * The `activeFilter` getter is bridged through `@mobxObservableProperty` so the
 * button highlight reactively follows the MobX store's filter setting.
 */
export class TodoFilter extends FASTElement {
    @mobxObservableProperty
    public get activeFilter(): TodoListFilter {
        return todoStore.activeFilter;
    }

    public setFilter(filter: TodoListFilter): void {
        todoStore.setFilter(filter);
    }
}

mobxObserver(TodoFilter);

TodoFilter.define({
    name: "todo-filter",
    template,
    styles,
});
