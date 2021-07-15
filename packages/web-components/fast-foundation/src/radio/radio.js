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
import { attr, observable } from "@microsoft/fast-element";
import { keyCodeSpace } from "@microsoft/fast-web-utilities";
import { FormAssociatedRadio } from "./radio.form-associated";
/**
 * A Radio Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#radio | ARIA radio }.
 *
 * @public
 */
export class Radio extends FormAssociatedRadio {
    constructor() {
        var _a;
        super();
        /**
         * The element's value to be included in form submission when checked.
         * Default to "on" to reach parity with input[type="radio"]
         *
         * @internal
         */
        this.initialValue = "on";
        /**
         * Provides the default checkedness of the input element
         * Passed down to proxy
         *
         * @public
         * @remarks
         * HTML Attribute: checked
         */
        this.checkedAttribute = false;
        /**
         * Tracks whether the "checked" property has been changed.
         * This is necessary to provide consistent behavior with
         * normal input radios
         */
        this.dirtyChecked = false;
        /**
         * @internal
         */
        this.formResetCallback = () => {
            this.checked = !!this.defaultChecked;
            this.dirtyChecked = false;
        };
        /**
         * @internal
         */
        this.keypressHandler = e => {
            switch (e.keyCode) {
                case keyCodeSpace:
                    if (!this.checked && !this.readOnly) {
                        this.checked = true;
                    }
                    return;
            }
            return true;
        };
        /**
         * @internal
         */
        this.clickHandler = e => {
            if (!this.disabled && !this.readOnly && !this.checked) {
                this.checked = true;
            }
        };
        this.checked = (_a = this.defaultChecked) !== null && _a !== void 0 ? _a : false;
    }
    readOnlyChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }
    checkedAttributeChanged() {
        this.defaultChecked = this.checkedAttribute;
    }
    defaultCheckedChanged() {
        var _a;
        if (this.$fastController.isConnected && !this.dirtyChecked) {
            // Setting this.checked will cause us to enter a dirty state,
            // but if we are clean when defaultChecked is changed, we want to stay
            // in a clean state, so reset this.dirtyChecked
            if (!this.isInsideRadioGroup()) {
                this.checked =
                    (_a = this.defaultChecked) !== null && _a !== void 0 ? _a : false;
                this.dirtyChecked = false;
            }
        }
    }
    checkedChanged() {
        if (this.$fastController.isConnected) {
            // changing the value via code and from radio-group
            if (!this.dirtyChecked) {
                this.dirtyChecked = true;
            }
            this.updateForm();
            if (this.proxy instanceof HTMLInputElement) {
                this.proxy.checked = this.checked;
            }
            this.$emit("change");
            this.validate();
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        var _a, _b;
        super.connectedCallback();
        this.proxy.setAttribute("type", "radio");
        this.validate();
        if (
            ((_a = this.parentElement) === null || _a === void 0
                ? void 0
                : _a.getAttribute("role")) !== "radiogroup" &&
            this.getAttribute("tabindex") === null
        ) {
            if (!this.disabled) {
                this.setAttribute("tabindex", "0");
            }
        }
        this.updateForm();
        if (this.checkedAttribute) {
            if (!this.dirtyChecked) {
                // Setting this.checked will cause us to enter a dirty state,
                // but if we are clean when defaultChecked is changed, we want to stay
                // in a clean state, so reset this.dirtyChecked
                if (!this.isInsideRadioGroup()) {
                    this.checked =
                        (_b = this.defaultChecked) !== null && _b !== void 0 ? _b : false;
                    this.dirtyChecked = false;
                }
            }
        }
    }
    isInsideRadioGroup() {
        const parent = this.closest("[role=radiogroup]");
        return parent !== null;
    }
    updateForm() {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }
}
__decorate(
    [attr({ attribute: "readonly", mode: "boolean" })],
    Radio.prototype,
    "readOnly",
    void 0
);
__decorate([observable], Radio.prototype, "name", void 0);
__decorate(
    [attr({ attribute: "checked", mode: "boolean" })],
    Radio.prototype,
    "checkedAttribute",
    void 0
);
__decorate([observable], Radio.prototype, "defaultSlottedNodes", void 0);
__decorate([observable], Radio.prototype, "defaultChecked", void 0);
__decorate([observable], Radio.prototype, "checked", void 0);
