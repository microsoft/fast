import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { FormAssociatedButton } from "./button.form-associated";
/**
 * A Button Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element }.
 *
 * @public
 */
export declare class Button extends FormAssociatedButton {
    /**
     * Determines if the element should receive document focus on page load.
     *
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    autofocus: boolean;
    /**
     * The id of a form to associate the element to.
     *
     * @public
     * @remarks
     * HTML Attribute: form
     */
    formId: string;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formaction
     */
    formaction: string;
    private formactionChanged;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formenctype
     */
    formenctype: string;
    private formenctypeChanged;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formmethod
     */
    formmethod: string;
    private formmethodChanged;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formnovalidate
     */
    formnovalidate: boolean;
    private formnovalidateChanged;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element} for more details.
     *
     * @public
     * @remarks
     * HTML Attribute: formtarget
     */
    formtarget: "_self" | "_blank" | "_parent" | "_top";
    private formtargetChanged;
    /**
     * The button type.
     *
     * @public
     * @remarks
     * HTML Attribute: type
     */
    type: "submit" | "reset" | "button";
    private typeChanged;
    /**
     *
     * Default slotted content
     *
     * @public
     * @remarks
     */
    defaultSlottedContent: HTMLElement[];
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * Submits the parent form
     */
    private handleSubmission;
    /**
     * Resets the parent form
     */
    private handleFormReset;
    control: HTMLButtonElement;
}
/**
 * Includes ARIA states and properties relating to the ARIA button role
 *
 * @public
 */
export declare class DelegatesARIAButton {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    ariaExpanded: "true" | "false" | undefined;
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-pressed
     */
    ariaPressed: "true" | "false" | "mixed" | undefined;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIAButton extends ARIAGlobalStatesAndProperties {}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface Button extends StartEnd, DelegatesARIAButton {}
