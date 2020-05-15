import { attr } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated/index.js";
import { StartEnd } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

export type ButtonAppearance =
    | "accent"
    | "lightweight"
    | "neutral"
    | "outline"
    | "stealth";

export class Button extends FormAssociated<HTMLInputElement> {
    @attr
    public appearance: ButtonAppearance = "neutral";

    @attr({ mode: "boolean" })
    public autofocus: boolean;

    @attr({ attribute: "form" })
    public formId: string;

    @attr
    public formaction: string;
    private formactionChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.formAction = this.formaction;
        }
    }

    @attr
    public formenctype: string;
    private formenctypeChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.formEnctype = this.formenctype;
        }
    }

    @attr
    public formmethod: string;
    private formmethodChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.formMethod = this.formmethod;
        }
    }

    @attr({ mode: "boolean" })
    public formnovalidate: boolean;
    private formnovalidateChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.formNoValidate = this.formnovalidate;
        }
    }

    @attr
    public formtarget: "_self" | "_blank" | "_parent" | "_top";
    private formtargetChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.formTarget = this.formtarget;
        }
    }

    @attr
    public name: string;

    @attr
    public type: "submit" | "reset" | "button";
    private typeChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.type = this.type;
        }
    }

    public value: string;
    private valueChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    protected proxy: HTMLInputElement = document.createElement("input");

    constructor() {
        super();

        this.proxy.setAttribute("type", `${this.type}`);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.setFormValue(this.value, this.value);
    }
}

/* eslint-disable-next-line */
export interface Button extends StartEnd {}
applyMixins(Button, StartEnd);
