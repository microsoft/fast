import { DelegatesARIATextbox } from "../text-field/index";
import { FormAssociatedTextArea } from "./text-area.form-associated";
import { TextAreaResize } from "./text-area.options";
export { TextAreaResize };
/**
 * A Text Area Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea | <textarea> element }.
 *
 * @public
 */
export declare class TextArea extends FormAssociatedTextArea {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    readOnly: boolean;
    private readOnlyChanged;
    /**
     * The resize mode of the element.
     * @public
     * @remarks
     * HTML Attribute: resize
     */
    resize: TextAreaResize;
    /**
     * A reference to the internal textarea element
     * @internal
     */
    control: HTMLTextAreaElement;
    /**
     * Indicates that this element should get focus after the page finishes loading.
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    autofocus: boolean;
    private autofocusChanged;
    /**
     * The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id | id} of the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form | form} the element is associated to
     * @public
     */
    formId: string;
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
     * The name of the element.
     * @public
     * @remarks
     * HTML Attribute: name
     */
    name: string;
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    placeholder: string;
    /**
     * Sizes the element horizontally by a number of character columns.
     *
     * @public
     * @remarks
     * HTML Attribute: cols
     */
    cols: number;
    /**
     * Sizes the element vertically by a number of character rows.
     *
     * @public
     * @remarks
     * HTML Attribute: rows
     */
    rows: number;
    /**
     * Sets if the element is eligible for spell checking
     * but the UA.
     * @public
     * @remarks
     * HTML Attribute: spellcheck
     */
    spellcheck: boolean;
    private spellcheckChanged;
    /**
     * @internal
     */
    defaultSlottedNodes: Node[];
    /**
     * @internal
     */
    handleTextInput: () => void;
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
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface TextArea extends DelegatesARIATextbox {}
