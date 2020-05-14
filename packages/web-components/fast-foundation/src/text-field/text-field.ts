import { attr, nullableNumberConverter } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/index.js";
import { StartEnd } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/index.js";

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

export class TextField extends FormAssociated<HTMLInputElement> {
    @attr
    public appearance: TextFieldAppearance = TextFieldAppearance.outline;

    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;
    private readOnlyChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }

    @attr({ mode: "boolean" })
    public autofocus: boolean;
    private autofocusChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.autofocus = this.autofocus;
        }
    }

    @attr
    public placeholder: string;
    private placeholderChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.placeholder = this.placeholder;
        }
    }

    @attr
    public type: TextFieldType = TextFieldType.text;
    private typeChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.type = this.type;
        }
    }

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
    public pattern: string;
    private patternChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.pattern = this.pattern;
        }
    }

    @attr({ converter: nullableNumberConverter })
    public size: number;
    private sizeChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.size = this.size;
        }
    }

    @attr({ mode: "boolean" })
    public spellcheck: boolean;
    private spellcheckChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.spellcheck = this.spellcheck;
        }
    }

    private valueChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }

        this.$emit("change", this.value);
    }

    public control: HTMLInputElement;

    protected proxy = document.createElement("input");

    constructor() {
        super();

        this.proxy.setAttribute("type", this.type);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.autofocus) {
            this.focus();
        }

        this.setFormValue(this.value, this.value);
    }

    public handleTextInput(): void {
        if (this.control && this.control.value) {
            this.value = this.control.value;
        }
    }
}
/* eslint-disable-next-line */
export interface TextField extends StartEnd {}
applyMixins(TextField, StartEnd);
