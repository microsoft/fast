import { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import { FormAssociatedSwitch } from "./switch.form-associated";
/**
 * Switch configuration options
 * @public
 */
export declare type SwitchOptions = FoundationElementDefinition & {
    switch?: string | SyntheticViewTemplate;
};
/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#switch | ARIA switch }.
 *
 * @public
 */
export declare class Switch extends FormAssociatedSwitch {
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
     * The checked attribute value. This sets the initial checked value.
     *
     * @public
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
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input checkboxes
     */
    private dirtyChecked;
    /**
     * @internal
     */
    connectedCallback(): void;
    constructor();
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
