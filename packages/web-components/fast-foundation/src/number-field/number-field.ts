import {
    attr,
    DOM,
    nullableNumberConverter,
    observable,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import { keyArrowDown, keyArrowUp } from "@microsoft/fast-web-utilities";
import { StartEnd, StartEndOptions } from "../patterns/index";
import { applyMixins } from "../utilities/index";
import type { FoundationElementDefinition } from "../foundation-element";
import { DelegatesARIATextbox } from "../text-field/index";
import { FormAssociatedNumberField } from "./number-field.form-associated";

/**
 * Number Field configuration options
 * @public
 */
export type NumberFieldOptions = FoundationElementDefinition &
    StartEndOptions & {
        stepDownGlyph?: string | SyntheticViewTemplate;
        stepUpGlyph?: string | SyntheticViewTemplate;
    };

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
    public maxChanged(previousValue, nextValue): void {
        this.max = Math.max(nextValue, this.min ?? nextValue);
        const min = Math.min(this.min, this.max);
        if (this.min !== undefined && this.min !== min) {
            this.min = min;
        }
        this.valueChanged(this.value, this.value);
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
        this.min = Math.min(nextValue, this.max ?? nextValue);
        const max = Math.max(this.min, this.max);
        if (this.max !== undefined && this.max !== max) {
            this.max = max;
        }
        this.valueChanged(this.value, this.value);
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
        let value: number | string = parseFloat(nextValue);
        if (isNaN(value)) {
            value = "";
        } else {
            value = Math.min(value, this.max ?? value);
            value = Math.max(value, this.min ?? value);
        }

        this.value = value.toString();

        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.value = this.value;
        }

        if (previousValue !== undefined) {
            this.$emit("input");
            this.$emit("change");
        }
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
        this.control.value = this.value;
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
        this.control.value = this.value;
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.proxy.setAttribute("type", "number");
        this.validate();
        this.control.value = this.value;

        if (this.autofocus) {
            DOM.queueUpdate(() => {
                this.focus();
            });
        }

        this.handleUnsupportedDelegatesFocus();
    }

    /**
     * Handles the internal control's `input` event
     * @internal
     */
    public handleTextInput(): void {
        this.control.value = this.control.value.replace(/[^0-9\-+e.]/g, "");
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
     *  leaving the input field.
     * @internal
     */
    public handleBlur(): void {
        this.control.value = this.value;
    }

    /**
     * Overrides the focus call for where delegatesFocus is unsupported.
     * This check works for Chrome, Edge Chromium, FireFox, and Safari
     * Relevant PR on the Firefox browser: https://phabricator.services.mozilla.com/D123858
     */
    private handleUnsupportedDelegatesFocus = () => {
        // Check to see if delegatesFocus is supported
        if (
            window.ShadowRoot &&
            !window.ShadowRoot.prototype.hasOwnProperty("delegatesFocus") &&
            this.$fastController.definition.shadowOptions?.delegatesFocus
        ) {
            this.focus = () => {
                this.control.focus();
            };
        }
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
