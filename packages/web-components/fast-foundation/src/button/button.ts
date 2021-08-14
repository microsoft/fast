import { attr, observable } from "@microsoft/fast-element";
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";
import { FormAssociatedButton } from "./button.form-associated";

/**
 * A Button Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element }.
 *
 * @public
 */
export class Button extends FormAssociatedButton {
    /**
     * Determines if the element should receive document focus on page load.
     *
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    @attr({ mode: "boolean" })
    public autofocus: boolean;

    /**
     * The id of a form to associate the element to.
     *
     * @public
     * @remarks
     * HTML Attribute: form
     */
    @attr({ attribute: "form" })
    public formId: string;

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formaction
     */
    @attr
    public formaction: string;
    private formactionChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formAction = this.formaction;
        }
    }

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formenctype
     */
    @attr
    public formenctype: string;
    private formenctypeChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formEnctype = this.formenctype;
        }
    }

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formmethod
     */
    @attr
    public formmethod: string;
    private formmethodChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formMethod = this.formmethod;
        }
    }

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formnovalidate
     */
    @attr({ mode: "boolean" })
    public formnovalidate: boolean;
    private formnovalidateChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formNoValidate = this.formnovalidate;
        }
    }

    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formtarget
     */
    @attr
    public formtarget: "_self" | "_blank" | "_parent" | "_top";
    private formtargetChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formTarget = this.formtarget;
        }
    }

    /**
     * The button type.
     *
     * @public
     * @remarks
     * HTML Attribute: type
     */
    @attr
    public type: "submit" | "reset" | "button";
    private typeChanged(
        previous: "submit" | "reset" | "button" | void,
        next: "submit" | "reset" | "button"
    ): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.type = this.type;
        }

        next === "submit" && this.addEventListener("click", this.handleSubmission);
        previous === "submit" && this.removeEventListener("click", this.handleSubmission);
        next === "reset" && this.addEventListener("click", this.handleFormReset);
        previous === "reset" && this.removeEventListener("click", this.handleFormReset);
    }

    /**
     *
     * Default slotted content
     *
     * @public
     * @remarks
     */
    @observable
    public defaultSlottedContent: HTMLElement[];

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", this.type);
    }

    /**
     * Submits the parent form
     */
    private handleSubmission = () => {
        if (!this.form) {
            return;
        }

        const attached = this.proxy.isConnected;

        if (!attached) {
            this.attachProxy();
        }

        // Browser support for requestSubmit is not comprehensive
        // so click the proxy if it isn't supported
        typeof this.form.requestSubmit === "function"
            ? this.form.requestSubmit(this.proxy)
            : this.proxy.click();

        if (!attached) {
            this.detachProxy();
        }
    };

    /**
     * Resets the parent form
     */
    private handleFormReset = () => {
        this.form?.reset();
    };

    public control: HTMLButtonElement;
}

/**
 * Includes ARIA states and properties relating to the ARIA button role
 *
 * @public
 */
export class DelegatesARIAButton {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @attr({ attribute: "aria-expanded", mode: "fromView" })
    public ariaExpanded: "true" | "false" | undefined;

    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-pressed
     */
    @attr({ attribute: "aria-pressed", mode: "fromView" })
    public ariaPressed: "true" | "false" | "mixed" | undefined;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface DelegatesARIAButton extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIAButton, ARIAGlobalStatesAndProperties);

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface Button extends StartEnd, DelegatesARIAButton {}
applyMixins(Button, StartEnd, DelegatesARIAButton);
