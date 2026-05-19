import { FASTElement } from "@microsoft/fast-element";
import { mobxObservableProperty, mobxObserver } from "./mobx-integration/index.js";
import { todoStore } from "./state/index.js";
import { styles } from "./todo-app.styles.js";
import { template } from "./todo-app.template.js";

/**
 * Root component for the MobX-backed todo example.
 *
 * Holds no state of its own — every value rendered comes from the shared MobX
 * `todoStore`. The `@mobxObserver` class decorator wires this component's
 * lifecycle to MobX reactions, and each `@mobxObservableProperty` getter
 * surfaces a derived value to the FAST template binding system.
 */
export class TodoApp extends FASTElement {
    @mobxObservableProperty
    public get total(): number {
        return todoStore.total;
    }

    @mobxObservableProperty
    public get hasTodos(): boolean {
        return todoStore.total > 0;
    }
}

mobxObserver(TodoApp);

export const app = TodoApp.compose({
    name: "todo-app",
    template,
    styles,
});
