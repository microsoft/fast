import { customElement, FASTElement, observable } from "@microsoft/fast-element";
import { todoStore } from "./state/index.js";
import { styles } from "./todo-form.styles.js";
import { template } from "./todo-form.template.js";

/**
 * Input form for adding a todo to the MobX store.
 *
 * Holds its own draft text as a FAST `@observable` because the input value is
 * UI-local state — it does not need to live in the global MobX store.
 */
@customElement({
    name: "todo-form",
    template,
    styles,
})
export class TodoForm extends FASTElement {
    @observable public description: string = "";

    public submit(): void {
        const value = this.description.trim();
        if (value === "") {
            return;
        }
        todoStore.add(value);
        this.description = "";
    }

    public handleSubmit(event: Event): boolean {
        event.preventDefault();
        this.submit();
        return false;
    }
}
