import {
    FASTElement,
    html,
    observable,
    customElement,
    css,
} from "@microsoft/fast-element";
import { FASTTextField } from "@fluentui/web-components";

const template = html<TodoForm>`
    <form @submit=${x => x.submitTodo()}>
        <fast-text-field
            :value=${x => x.description}
            @input=${(x, c) => x.onDescriptionInput(c.event)}
        ></fast-text-field>
        <fast-button type="submit" appearance="accent" ?disabled=${x => !x.canSubmitTodo}>
            Add Todo
        </fast-button>
    </form>
`;

const styles = css`
    form {
        display: flex;
    }

    fast-button {
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
        this.description = (event.target! as FASTTextField).value;
    }
}
