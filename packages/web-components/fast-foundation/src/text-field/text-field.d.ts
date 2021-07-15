import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { FormAssociatedTextField } from "./text-field.form-associated";
import { TextFieldType } from "./text-field.options";
export { TextFieldType };
/**
 * A Text Field Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text | <input type="text" /> element }.
 *
 * @public
 */
export declare class TextField extends FormAssociatedTextField {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    readOnly: boolean;
    private readOnlyChanged;
    /**
     * Indicates that this element should get focus after the page finishes loading. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus | autofocus HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    autofocus: boolean;
    private autofocusChanged;
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    placeholder: string;
    private placeholderChanged;
    /**
     * Allows setting a type or mode of text.
     * @public
     * @remarks
     * HTML Attribute: type
     */
    type: TextFieldType;
    private typeChanged;
    /**
     * Allows associating a {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist | datalist} to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.
     * @public
     * @remarks
     * HTML Attribute: list
     */
    list: string;
    private listChanged;
    /**
     * The maximum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: maxlength
     */
    maxlength: number;
    private maxlengthChanged;
    /**
     * The minimum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: minlength
     */
    minlength: number;
    private minlengthChanged;
    /**
     * A regular expression that the value must match to pass validation.
     * @public
     * @remarks
     * HTMLAttribute: pattern
     */
    pattern: string;
    private patternChanged;
    /**
     * Sets the width of the element to a specified number of characters.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    size: number;
    private sizeChanged;
    /**
     * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    spellcheck: boolean;
    private spellcheckChanged;
    /**
     * @internal
     */
    defaultSlottedNodes: Node[];
    /**
     * A reference to the internal input element
     * @internal
     */
    control: HTMLInputElement;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * Handles the internal control's `input` event
     * @internal
     */
    handleTextInput(): void;
    /**
     * Change event handler for inner control.
     * @remarks
     * "Change" events are not `composable` so they will not
     * permeate the shadow DOM boundary. This fn effectively proxies
     * the change event, emitting a `change` event whenever the internal
     * control emits a `change` event
     * @internal
     */
    handleChange(): void;
}
/**
 * Includes ARIA states and properties relating to the ARIA textbox role
 *
 * @public
 */
export declare class DelegatesARIATextbox {}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIATextbox extends ARIAGlobalStatesAndProperties {}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface TextField extends StartEnd, DelegatesARIATextbox {}
