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
import { FormAssociatedCheckbox } from "./checkbox.form-associated";
/**
 * A Checkbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#checkbox | ARIA checkbox }.
 *
 * @public
 */
export class Checkbox extends FormAssociatedCheckbox {
    constructor() {
        super();
        /**
         * The element's value to be included in form submission when checked.
         * Default to "on" to reach parity with input[type="checkbox"]
         *
         * @internal
         */
        this.initialValue = "on";
        /**
         * The indeterminate state of the control
         */
        this.indeterminate = false;
        /**
         * Tracks whether the "checked" property has been changed.
         * This is necessary to provide consistent behavior with
         * normal input checkboxes
         */
        this.dirtyChecked = false;
        /**
         * Set to true when the component has constructed
         */
        this.constructed = false;
        /**
         * @internal
         */
        this.formResetCallback = () => {
            this.checked = this.checkedAttribute;
            this.dirtyChecked = false;
        };
        /**
         * @internal
         */
        this.keypressHandler = e => {
            switch (e.keyCode) {
                case keyCodeSpace:
                    this.checked = !this.checked;
                    break;
            }
        };
        /**
         * @internal
         */
        this.clickHandler = e => {
            if (!this.disabled && !this.readOnly) {
                this.checked = !this.checked;
            }
        };
        this.defaultChecked = !!this.checkedAttribute;
        this.checked = this.defaultChecked;
        this.constructed = true;
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
        if (!this.dirtyChecked) {
            // Setting this.checked will cause us to enter a dirty state,
            // but if we are clean when defaultChecked is changed, we want to stay
            // in a clean state, so reset this.dirtyChecked
            this.checked = this.defaultChecked;
            this.dirtyChecked = false;
        }
    }
    checkedChanged() {
        if (!this.dirtyChecked) {
            this.dirtyChecked = true;
        }
        this.updateForm();
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.checked = this.checked;
        }
        if (this.constructed) {
            this.$emit("change");
        }
        this.validate();
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.proxy.setAttribute("type", "checkbox");
        this.updateForm();
    }
    updateForm() {
        const value = this.checked ? this.value : null;
        this.setFormValue(value, value);
    }
}
__decorate(
    [attr({ attribute: "readonly", mode: "boolean" })],
    Checkbox.prototype,
    "readOnly",
    void 0
);
__decorate(
    [attr({ attribute: "checked", mode: "boolean" })],
    Checkbox.prototype,
    "checkedAttribute",
    void 0
);
__decorate([observable], Checkbox.prototype, "defaultSlottedNodes", void 0);
__decorate([observable], Checkbox.prototype, "defaultChecked", void 0);
__decorate([observable], Checkbox.prototype, "checked", void 0);
__decorate([observable], Checkbox.prototype, "indeterminate", void 0);
