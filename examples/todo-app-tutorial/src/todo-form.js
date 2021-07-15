var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import {
    FASTElement,
    html,
    observable,
    customElement,
    css,
} from "@microsoft/fast-element";
const template = html`
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
let TodoForm = class TodoForm extends FASTElement {
    constructor() {
        super(...arguments);
        this.description = "";
    }
    get canSubmitTodo() {
        return !!this.description;
    }
    submitTodo() {
        if (this.canSubmitTodo) {
            this.$emit("todo-submit", this.description);
            this.description = "";
        }
    }
    onDescriptionInput(event) {
        this.description = event.target.value;
    }
};
__decorate([observable], TodoForm.prototype, "description", void 0);
TodoForm = __decorate(
    [
        customElement({
            name: "todo-form",
            template,
            styles,
        }),
    ],
    TodoForm
);
export { TodoForm };
