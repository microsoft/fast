import {
    attr,
    nullableNumberConverter,
    observable,
    SyntheticViewTemplate,
    Updates,
} from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp } from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";
import { DelegatesARIATextbox } from "../text-field/text-field.js";
import { FormAssociatedNumberField } from "./number-field.form-associated.js";

/**
 * Number Field configuration options
 * @public
 */
export type NumberFieldOptions = StartEndOptions & {
    stepDownIcon?: string | SyntheticViewTemplate;
    stepUpIcon?: string | SyntheticViewTemplate;
};

/**
 * A Number Field Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number | <input type="number" /> element }.
 *
 * @slot start - Content which can be provided before the number field input
 * @slot end - Content which can be provided after the number field input
 * @slot - The default slot for the label
 * @slot step-up-icon - The icon for the step up control
 * @slot step-down-icon - The icon for the step down control
 * @csspart label - The label
 * @csspart control - The logical control, the element wrapping the input field, including start and end slots
 * @csspart field - The element representing the input field
 * @csspart step-buttons - The step up and step down controls
 * @csspart step-up - The step up control
 * @csspart step-down - The step down control
 * @fires input - Fires a custom 'input' event when the value has changed
 * @fires change - Fires a custom 'change' event when the value has changed
 *
 * @public
 */
export class FASTNumberField extends FormAssociatedNumberField {
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly | readonly HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: "readonly", mode: "boolean" })
    public readOnly: boolean;

    /**
     * Indicates that this element should get focus after the page finishes loading. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautofocus | autofocus HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    @attr({ mode: "boolean" })
    public autofocus: boolean;

    /**
     * When true, spin buttons will not be rendered
     * @public
     * @remarks
     * HTML Attribute: autofocus
     */
    @attr({ attribute: "hide-step", mode: "boolean" })
    public hideStep: boolean = false;

    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute does is not a valid substitute for a labeling element.
     */
    @attr
    public placeholder: string;

    /**
     * Allows associating a {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist | datalist} to the element by {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id}.
     * @public
     * @remarks
     * HTML Attribute: list
     */
    @attr
    public list: string;

    /**
     * The maximum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: maxlength
     */
    @attr({ converter: nullableNumberConverter })
    public maxlength: number;

    /**
     * The minimum number of characters a user can enter.
     * @public
     * @remarks
     * HTMLAttribute: minlength
     */
    @attr({ converter: nullableNumberConverter })
    public minlength: number;

    /**
     * Sets the width of the element to a specified number of characters.
     * @public
     * @remarks
     * HTMLAttribute: size
     */
    @attr({ converter: nullableNumberConverter })
    public size: number;

    /**
     * Amount to increment or decrement the value by
     * @public
     * @remarks
     * HTMLAttribute: step
     */
    @attr({ converter: nullableNumberConverter })
    public step: number = 1;

    /**
     * The maximum the value can be
     * @public
     * @remarks
     * HTMLAttribute: max
     */
    @attr({ converter: nullableNumberConverter })
    public max: number;

    /**
     * Ensures that the max is greater than the min and that the value
     *  is less than the max
     * @param previous - the previous max value
     * @param next - updated max value
     *
     * @internal
     */
    public maxChanged(previous: number, next: number): void {
        this.max = Math.max(next, this.min ?? next);
        const min = Math.min(this.min, this.max);
        if (this.min !== undefined && this.min !== min) {
            this.min = min;
        }
        this.value = this.getValidValue(this.value);
    }

    /**
     * The minimum the value can be
     * @public
     * @remarks
     * HTMLAttribute: min
     */
    @attr({ converter: nullableNumberConverter })
    public min: number;

    /**
     * Ensures that the min is less than the max and that the value
     *  is greater than the min
     * @param previous - previous min value
     * @param next - updated min value
     *
     * @internal
     */
    public minChanged(previous: number, next: number): void {
        this.min = Math.min(next, this.max ?? next);
        const max = Math.max(this.min, this.max);
        if (this.max !== undefined && this.max !== max) {
            this.max = max;
        }
        this.value = this.getValidValue(this.value);
    }

    /**
     * The default slotted items
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * A reference to the internal field element
     * @internal
     */
    public field: HTMLInputElement;

    /**
     * Flag to indicate that the value change is from the user input
     * @internal
     */
    private isUserInput: boolean = false;

    /**
     * The value property, typed as a number.
     *
     * @public
     */
    public get valueAsNumber(): number {
        return parseFloat(super.value);
    }

    public set valueAsNumber(next: number) {
        this.value = next.toString();
    }

    /**
     * Validates that the value is a number between the min and max
     * @param previous - previous stored value
     * @param next - value being updated
     * @internal
     */
    public valueChanged(previous: string, next: string): void {
        const value = this.getValidValue(next);

        if (next !== value) {
            this.value = value;
            return;
        }

        if (this.$fastController.isConnected && this.field?.value !== value) {
            this.field.value = this.value;
        }

        super.valueChanged(previous, this.value);

        if (previous !== undefined && !this.isUserInput) {
            this.$emit("input");
            this.$emit("change");
        }

        this.isUserInput = false;
    }

    /** {@inheritDoc (FormAssociated:interface).validate} */
    public validate(): void {
        super.validate(this.field);
    }

    /**
     * Sets the internal value to a valid number between the min and max properties
     * @param value - user input
     *
     * @internal
     */
    private getValidValue(value: string): string {
        let validValue: number | string = parseFloat(parseFloat(value).toPrecision(12));
        if (isNaN(validValue)) {
            validValue = "";
        } else {
            validValue = Math.min(validValue, this.max ?? validValue);
            validValue = Math.max(validValue, this.min ?? validValue).toString();
        }

        return validValue;
    }

    /**
     * Increments the value using the step value
     *
     * @public
     */
    public stepUp(): void {
        const value = parseFloat(this.value);
        const stepUpValue = !isNaN(value)
            ? value + this.step
            : this.min > 0
            ? this.min
            : this.max < 0
            ? this.max
            : !this.min
            ? this.step
            : 0;

        this.value = stepUpValue.toString();
    }

    /**
     * Decrements the value using the step value
     *
     * @public
     */
    public stepDown(): void {
        const value = parseFloat(this.value);
        const stepDownValue = !isNaN(value)
            ? value - this.step
            : this.min > 0
            ? this.min
            : this.max < 0
            ? this.max
            : !this.min
            ? 0 - this.step
            : 0;

        this.value = stepDownValue.toString();
    }

    /**
     * Sets up the initial state of the number field
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", "number");
        this.validate();
        this.field.value = this.value;

        if (this.autofocus) {
            Updates.enqueue(() => {
                this.focus();
            });
        }
    }

    /**
     * Selects all the text in the number field
     *
     * @public
     */
    public select(): void {
        this.field.select();

        /**
         * The select event does not permeate the shadow DOM boundary.
         * This fn effectively proxies the select event,
         * emitting a `select` event whenever the internal
         * control emits a `select` event
         */
        this.$emit("select");
    }

    /**
     * Handles the internal input field's `input` event
     * @internal
     */
    public handleTextInput(): void {
        this.field.value = this.field.value.replace(/[^0-9\-+e.]/g, "");
        this.isUserInput = true;
        this.value = this.field.value;
    }

    /**
     * Change event handler for inner control.
     * @remarks
     * "Change" events are not `composable` so they will not
     * permeate the shadow DOM boundary. This fn effectively proxies
     * the change event, emitting a `change` event whenever the internal
     * control emits a `change` event
     * @internal
     */
    public handleChange(): void {
        this.$emit("change");
    }

    /**
     * Handles the internal control's `keydown` event
     * @internal
     */
    public handleKeyDown(e: KeyboardEvent): boolean {
        const key = e.key;

        switch (key) {
            case keyArrowUp:
                this.stepUp();
                return false;

            case keyArrowDown:
                this.stepDown();
                return false;
        }

        return true;
    }

    /**
     * Handles populating the input field with a validated value when
     * leaving the input field.
     * @internal
     */
    public handleBlur(): void {
        this.field.value = this.value;
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface FASTNumberField extends StartEnd, DelegatesARIATextbox {}
applyMixins(FASTNumberField, StartEnd, DelegatesARIATextbox);
