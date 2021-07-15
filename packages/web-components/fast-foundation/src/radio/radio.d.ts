import { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementDefinition } from "../foundation-element";
import { FormAssociatedRadio } from "./radio.form-associated";
/**
 * A structure representing a {@link @microsoft/fast-foundation#(Radio:class)} element
 * @public
 */
export declare type RadioControl = Pick<
    HTMLInputElement,
    "checked" | "disabled" | "readOnly" | "focus" | "setAttribute" | "getAttribute"
>;
/**
 * Radio configuration options
 * @public
 */
export declare type RadioOptions = FoundationElementDefinition & {
    checkedIndicator?: string | SyntheticViewTemplate;
};
/**
 * A Radio Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#radio | ARIA radio }.
 *
 * @public
 */
export declare class Radio extends FormAssociatedRadio implements RadioControl {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    readOnly: boolean;
    private readOnlyChanged;
    /**
     * The name of the radio. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname | name attribute} for more info.
     */
    name: string;
    /**
     * The element's value to be included in form submission when checked.
     * Default to "on" to reach parity with input[type="radio"]
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
    defaultChecked: boolean | undefined;
    private defaultCheckedChanged;
    /**
     * The checked state of the control
     *
     * @public
     */
    checked: boolean;
    private checkedChanged;
    /**
     * Tracks whether the "checked" property has been changed.
     * This is necessary to provide consistent behavior with
     * normal input radios
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
    private isInsideRadioGroup;
    private updateForm;
    /**
     * @internal
     */
    keypressHandler: (e: KeyboardEvent) => boolean | void;
    /**
     * @internal
     */
    clickHandler: (e: MouseEvent) => void;
}
