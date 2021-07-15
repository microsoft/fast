import { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import { FormAssociatedCheckbox } from "./checkbox.form-associated";
/**
 * Checkbox configuration options
 * @public
 */
export declare type CheckboxOptions = FoundationElementDefinition & {
    checkedIndicator?: string | SyntheticViewTemplate;
    indeterminateIndicator?: string | SyntheticViewTemplate;
};
/**
 * A Checkbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#checkbox | ARIA checkbox }.
 *
 * @public
 */
export declare class Checkbox extends FormAssociatedCheckbox {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    readOnly: boolean;
    private readOnlyChanged;
    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="checkbox"]
     *
     * @internal
     */
    initialValue: string;
    /**
     * Provides the default checkedness of the input element
     * Passed down to proxy
     *
     * @public
     * @remarks
     * HTML Attribute: checked
     */
    checkedAttribute: boolean;
    private checkedAttributeChanged;
    /**
     * @internal
     */
    defaultSlottedNodes: Node[];
    /**
     * Initialized to the value of the checked attribute. Can be changed independently of the "checked" attribute,
     * but changing the "checked" attribute always additionally sets this value.
     *
     * @public
     */
    defaultChecked: boolean;
    private defaultCheckedChanged;
    /**
     * The checked state of the control.
     *
     * @public
     */
    checked: boolean;
    private checkedChanged;
    /**
     * The indeterminate state of the control
     */
    indeterminate: boolean;
    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input checkboxes
     */
    private dirtyChecked;
    /**
     * Set to true when the component has constructed
     */
    private constructed;
    constructor();
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    formResetCallback: () => void;
    private updateForm;
    /**
     * @internal
     */
    keypressHandler: (e: KeyboardEvent) => void;
    /**
     * @internal
     */
    clickHandler: (e: MouseEvent) => void;
}
