var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
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
    constructor() {
        super(...arguments);
        /**
         * When true, spin buttons will not be rendered
         * @public
         * @remarks
         * HTML Attribute: autofocus
         */
        this.hideStep = false;
        /**
         * Amount to increment or decrement the value by
         * @public
         * @remarks
         * HTMLAttribute: step
         */
        this.step = 1;
    }
    maxChanged(previousValue, nextValue) {
        const numb = parseFloat(nextValue);
        if (numb !== undefined) {
            if (this.min !== undefined && numb < this.min) {
                this.max = this.min;
                this.min = numb;
            } else {
                this.max = numb;
            }
        }
    }
    minChanged(previousValue, nextValue) {
        const numb = parseFloat(nextValue);
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
     *
     * @param previousValue - previous stored value
     * @param nextValue - value being updated
     */
    valueChanged(previousValue, nextValue) {
        super.valueChanged(previousValue, nextValue);
        const numb = parseFloat(nextValue);
        let out = numb == nextValue ? nextValue : numb;
        if (nextValue === "" || isNaN(numb)) {
            out = "";
        } else {
            out = this.getValidValue(numb);
        }
        this.value = out;
        if (this.proxy instanceof HTMLElement) {
            this.proxy.value = this.value;
        }
    }
    /**
     * Ensures that the value is between the min and max values
     *
     * @param value - number to evaluate
     * @returns - a string repesentation
     *
     * @internal
     */
    getValidValue(value) {
        if (this.min !== undefined && value < this.min) {
            value = this.min;
        } else if (this.max !== undefined && value > this.max) {
            value = this.max;
        }
        return parseFloat(value.toPrecision(12)).toString();
    }
    /**
     * Increments the value using the step value
     *
     * @public
     */
    stepUp() {
        const stepUpValue = this.step + (parseFloat(this.value) || 0);
        this.value = this.getValidValue(stepUpValue);
        this.$emit("input");
    }
    /**
     * Decrements the value using the step value
     *
     * @public
     */
    stepDown() {
        const stepDownValue = (parseFloat(this.value) || 0) - this.step;
        this.value = this.getValidValue(stepDownValue);
        this.$emit("input");
    }
    /**
     * @internal
     */
    connectedCallback() {
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
    handleTextInput() {
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
    handleChange() {
        this.$emit("change");
    }
}
__decorate(
    [attr({ attribute: "readonly", mode: "boolean" })],
    NumberField.prototype,
    "readOnly",
    void 0
);
__decorate([attr({ mode: "boolean" })], NumberField.prototype, "autofocus", void 0);
__decorate(
    [attr({ attribute: "hide-step", mode: "boolean" })],
    NumberField.prototype,
    "hideStep",
    void 0
);
__decorate([attr], NumberField.prototype, "placeholder", void 0);
__decorate([attr], NumberField.prototype, "list", void 0);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    NumberField.prototype,
    "maxlength",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    NumberField.prototype,
    "minlength",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    NumberField.prototype,
    "size",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    NumberField.prototype,
    "step",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    NumberField.prototype,
    "max",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    NumberField.prototype,
    "min",
    void 0
);
__decorate([observable], NumberField.prototype, "defaultSlottedNodes", void 0);
applyMixins(NumberField, StartEnd, DelegatesARIATextbox);
