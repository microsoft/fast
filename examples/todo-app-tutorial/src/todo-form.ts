import {
    FASTElement,
    html,
    observable,
    customElement,
    css,
} from "@microsoft/fast-element";
import { FluentTextField } from "@fluentui/web-components";

const template = html<TodoForm>`
    <form @submit=${x => x.submitTodo()}>
        <fluent-text-field
            :value=${x => x.description}
            @input=${(x, c) => x.onDescriptionInput(c.event)}
        ></fluent-text-field>
        <fluent-button
            type="submit"
            appearance="accent"
            ?disabled=${x => !x.canSubmitTodo}
        >
            Add Todo
        </fluent-button>
    </form>
`;

const styles = css`
    form {
        display: flex;
    }

    fluent-button {
        margin: 4px;
    }
`;

@customElement({
    name: "todo-form",
    template,
    styles,
})
export class TodoForm extends FASTElement {
    @observable public description: string = "";

    get canSubmitTodo() {
        return !!this.description;
    }

    public submitTodo() {
        if (this.canSubmitTodo) {
            this.$emit("todo-submit", this.description);
            this.description = "";
        }
    }

    public onDescriptionInput(event: Event) {
        this.description = (event.target! as FluentTextField).value;
    }
}
