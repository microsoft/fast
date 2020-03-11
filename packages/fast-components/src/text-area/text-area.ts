import { attr, FastElement } from "@microsoft/fast-element";

export enum TextAreaAppearance {
    filled = "filled",
    outline = "outline",
}

export class TextArea extends FastElement {
    @attr
    public appearance: TextAreaAppearance = TextAreaAppearance.outline;
    private appearanceChanged(): void {
        this.appearance === TextAreaAppearance.filled
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
    public cols: number = 20;

    @attr
    public disabled: boolean;

    @attr
    public form: string;

    @attr
    public list: string;

    @attr
    public maxlength: number;

    @attr
    public minlength: number;

    @attr
    public name: string;

    @attr
    public placeholder: string;

    @attr
    public rows: number;

    @attr
    public spellcheck: boolean;
}
