import { FASTElement } from "@microsoft/fast-element";
export declare class TodoForm extends FASTElement {
    description: string;
    get canSubmitTodo(): boolean;
    submitTodo(): void;
    onDescriptionInput(event: Event): void;
}
