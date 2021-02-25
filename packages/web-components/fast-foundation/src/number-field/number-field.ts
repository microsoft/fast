import { attr, DOM, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/index";
import { DelegatesARIATextbox } from "../text-field/index";
import { FormAssociatedNumberField } from "./number-field.form-associated";

/**
 * A Number Field Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number | <input type="number" /> element }.
 *
 * @public
 */
export class NumberField extends FormAssociatedNumberField {
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
    public maxChanged(previousValue, nextValue): void {
        const numb: number = parseFloat(nextValue);
        if (numb !== undefined) {
            if (this.min !== undefined && numb < this.min) {
                this.max = this.min;
                this.min = numb;
            } else {
                this.max = numb;
            }
        }
    }

    /**
     * The minimum the value can be
     * @public
     * @remarks
     * HTMLAttribute: min
     */
    @attr({ converter: nullableNumberConverter })
    public min: number;
    public minChanged(previousValue, nextValue): void {
        const numb: number = parseFloat(nextValue);
        if (numb !== undefined) {
            if (this.max !== undefined && numb > this.max) {
                this.min = this.max;
                this.max = numb;
            } else {
                this.min = numb;
            }
        }
    }

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];

    /**
     * A reference to the internal input element
     * @internal
     */
    public control: HTMLInputElement;

    /**
     *
     * @param previousValue - previous stored value
     * @param nextValue - value being updated
     */
    public valueChanged(previousValue, nextValue): void {
        super.valueChanged(previousValue, nextValue);

        const numb = parseFloat(nextValue);
        let out: number | string = numb == nextValue ? nextValue : numb;

        if (nextValue === "" || isNaN(numb)) {
            out = "";
        } else if (this.min !== undefined && numb < this.min) {
            out = this.min;
        } else if (this.max !== undefined && numb > this.max) {
            out = this.max;
        }

        this.value = out.toString();

        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }

    /**
     * Increments the value using the step value
     */
    public stepUp(): void {
        const steppedValue = parseFloat(this.value) + this.step;
        const nextValue =
            this.max !== undefined && steppedValue > this.max ? this.max : steppedValue;
        this.value = parseFloat(nextValue.toPrecision(12)).toString();
    }

    /**
     * Decrements the value using the step value
     */
    public stepDown(): void {
        const steppedValue = parseFloat(this.value) - this.step;
        const nextValue =
            this.min !== undefined && steppedValue < this.min ? this.min : steppedValue;
        this.value = parseFloat(nextValue.toPrecision(12)).toString();
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", "number");
        this.validate();

        if (this.autofocus) {
            DOM.queueUpdate(() => {
                this.focus();
            });
        }
    }

    /**
     * Handles the internal control's `input` event
     * @internal
     */
    public handleTextInput(): void {
        this.value = this.control.value;
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
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface NumberField extends StartEnd, DelegatesARIATextbox {}
applyMixins(NumberField, StartEnd, DelegatesARIATextbox);
