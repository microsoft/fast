import { attr, FastElement, html, ref } from "@microsoft/fast-element";
import { FormAssociated } from "../form-associated";

export type ButtonAppearance =
    | "accent"
    | "lightweight"
    | "neutral"
    | "outline"
    | "stealth";

export const buttonTemplate = html<Button>`
    <button
        class="control"
        autofocus=${x => x.autofocus}
        disabled=${x => x.disabled}
        form=${x => x.formId}
        formaction=${x => x.formaction}
        formenctype=${x => x.formenctype}
        formmethod=${x => x.formmethod}
        formnovalidate=${x => x.formnovalidate}
        formtarget=${x => x.formtarget}
        name=${x => x.name}
        type=${x => x.type}
        value=${x => x.value}
    >
        <span
            part="start"
            ${ref("startContainer")}
        >
            <slot
                name="start"
                ${ref("start")}
                @slotchange=${x => x.handleStartContentChange()}
            ></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <span
            part="end"
            ${ref("endContainer")}
        >
            <slot
                name="end"
                ${ref("end")}
                @slotchange=${x => x.handleEndContentChange()}
            ></slot>
        </span>
    </button>
`;

export class Button extends FormAssociated<HTMLInputElement> {
    @attr
    public appearance: ButtonAppearance = "neutral";
    public appearanceChanged(
        oldValue: ButtonAppearance,
        newValue: ButtonAppearance
    ): void {
        if (oldValue !== newValue) {
            this.classList.add(`${newValue}`);
            this.classList.remove(`${oldValue}`);
        }
    }

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

    @attr
    public value: string;
    private valueChanged(): void {
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    public start: HTMLSlotElement;
    public startContainer: HTMLSpanElement;
    public handleStartContentChange(): void {
        this.start.assignedNodes().length > 0
            ? this.startContainer.classList.add("start")
            : this.startContainer.classList.remove("start");
    }

    public end: HTMLSlotElement;
    public endContainer: HTMLSpanElement;
    public handleEndContentChange(): void {
        this.end.assignedNodes().length > 0
            ? this.endContainer.classList.add("end")
            : this.endContainer.classList.remove("end");
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
