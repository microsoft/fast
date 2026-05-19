import { FASTElement } from "@microsoft/fast-element";
import { mobxObservableProperty, mobxObserver } from "./mobx-integration/index.js";
import { type Todo, todoStore } from "./state/index.js";
import { styles } from "./todo-list.styles.js";
import { template } from "./todo-list.template.js";

/**
 * Renders the list of todos filtered by the store's current filter.
 *
 * Surfaces the MobX `todoStore.filtered` computed as a FAST-reactive getter so
 * the `repeat` directive in the template re-renders when the filter changes or
 * todos are added/removed. Per-todo state changes are tracked inside each
 * `<todo-item>` to keep updates fine-grained.
 */
export class TodoList extends FASTElement {
    @mobxObservableProperty
    public get items(): readonly Todo[] {
        return todoStore.filtered;
    }
}

mobxObserver(TodoList);

TodoList.define({
    name: "todo-list",
    template,
    styles,
});
