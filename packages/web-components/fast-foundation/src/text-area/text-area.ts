import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/index.js";

export enum TextAreaAppearance {
    filled = "filled",
    outline = "outline",
}

export enum TextAreaResize {
    none = "none",
    both = "both",
    horizontal = "horizontal",
    vertical = "vertical",
}

export class TextArea extends FormAssociated<HTMLTextAreaElement> {
    @attr
    public appearance: TextAreaAppearance = TextAreaAppearance.outline;

    @attr({ mode: "boolean" })
    public readOnly: boolean;
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }

    @attr
    public resize: TextAreaResize = TextAreaResize.none;

    public textarea: HTMLTextAreaElement;

    @attr({ mode: "boolean" })
    public autofocus: boolean;
    private autofocusChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.autofocus = this.autofocus;
        }
    }

    @attr({ converter: nullableNumberConverter, mode: "fromView" })
    public cols: number = 20;

    @attr({ attribute: "form" })
    public formId: string;

    @attr
    public list: string;
    private listChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.setAttribute("list", this.list);
        }
    }

    @attr({ converter: nullableNumberConverter })
    public maxlength: number;
    private maxlengthChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.maxLength = this.maxlength;
        }
    }

    @attr({ converter: nullableNumberConverter })
    public minlength: number;
    private minlengthChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.minLength = this.minlength;
        }
    }

    @attr
    public name: string;

    @attr
    public placeholder: string;

    @attr({ converter: nullableNumberConverter, mode: "fromView" })
    public rows: number;

    @attr({ mode: "boolean" })
    public spellcheck: boolean;
    private spellcheckChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.spellcheck = this.spellcheck;
        }
    }

    @observable
    public defaultSlottedNodes: Node[];

    public valueChanged(): void {
        if (this.textarea && this.value !== this.textarea.value) {
            this.textarea.value = this.value;
        }

        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    protected proxy: HTMLTextAreaElement = document.createElement("textarea");

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.value) {
            this.textarea.value = this.value;

            this.setFormValue(this.value, this.value);
        }
    }

    public handleTextInput = (): void => {
        this.$emit("change", this.textarea.value);
    };
}
