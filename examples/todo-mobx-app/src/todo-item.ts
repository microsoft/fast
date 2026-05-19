import { FASTElement, observable } from "@microsoft/fast-element";
import { mobxObservableProperty, mobxObserver } from "./mobx-integration/index.js";
import { type Todo, todoStore } from "./state/index.js";
import { styles } from "./todo-item.styles.js";
import { template } from "./todo-item.template.js";

/**
 * Renders a single todo row.
 *
 * Receives its `todo` via property binding from `<todo-list>`. The
 * `@mobxObservableProperty` getters mean any change to the todo's `done` or
 * `description` (mutated through MobX actions in the store) re-renders this
 * row, while leaving sibling rows untouched.
 */
export class TodoItem extends FASTElement {
    @observable public todo!: Todo;

    @mobxObservableProperty
    public get done(): boolean {
        return this.todo?.done === true;
    }

    @mobxObservableProperty
    public get description(): string {
        return this.todo?.description ?? "";
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
}

mobxObserver(TodoItem);

TodoItem.define({
    name: "todo-item",
    template,
    styles,
});
