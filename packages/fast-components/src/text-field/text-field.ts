import { attr, FastElement } from "@microsoft/fast-element";

export enum TextFieldAppearance {
    filled = "filled",
    outline = "outline",
}

export enum TextFieldType {
    email = "email",
    password = "password",
    tel = "tel",
    text = "text",
    url = "url",
}

export class TextField extends FastElement {
    @attr
    public appearance: TextFieldAppearance = TextFieldAppearance.outline;
    private appearanceChanged(): void {
        this.appearance === TextFieldAppearance.filled
            ? this.classList.add("filled")
            : this.classList.remove("filled");
    }

    @attr({ attribute: "required" })
    public required: boolean;
    private requiredChanged(): void {
        this.required
            ? this.classList.add("required")
            : this.classList.remove("required");
    }

    @attr
    public readonly: boolean;
    private readonlyChanged(): void {
        this.readonly
            ? this.classList.add("readonly")
            : this.classList.remove("readonly");
    }

    @attr
    public autofocus: boolean;

    @attr
    public disabled: boolean;

    @attr
    public placeholder: string;

    @attr
    public type: TextFieldType = TextFieldType.text;

    @attr
    public list: string;

    @attr
    public maxlength: number;

    @attr
    public minlength: number;

    @attr
    public name: string;

    @attr
    public pattern: RegExp;

    @attr
    public size: number;

    @attr
    public spellcheck: boolean;

    @attr
    public value: string;
    public valueChanged(): void {
        this.$emit("change", this.value);
    }

    public afterContent: HTMLSlotElement;
    public afterContentContainer: HTMLSpanElement;
    public handleAfterContentChange(): void {
        this.afterContent.assignedNodes().length > 0
            ? this.afterContentContainer.classList.add("after-content")
            : this.afterContentContainer.classList.remove("after-content");
    }

    public beforeContent: HTMLSlotElement;
    public beforeContentContainer: HTMLSpanElement;
    public handleBeforeContentChange(): void {
        this.beforeContent.assignedNodes().length > 0
            ? this.beforeContentContainer.classList.add("before-content")
            : this.beforeContentContainer.classList.remove("before-content");
    }
}
