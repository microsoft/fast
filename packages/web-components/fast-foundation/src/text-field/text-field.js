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
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/index";
import { FormAssociatedTextField } from "./text-field.form-associated";
import { TextFieldType } from "./text-field.options";
export { TextFieldType };
/**
 * A Text Field Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text | <input type="text" /> element }.
 *
 * @public
 */
export class TextField extends FormAssociatedTextField {
    constructor() {
        super(...arguments);
        /**
         * Allows setting a type or mode of text.
         * @public
         * @remarks
         * HTML Attribute: type
         */
        this.type = TextFieldType.text;
    }
    readOnlyChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.readOnly = this.readOnly;
            this.validate();
        }
    }
    autofocusChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.autofocus = this.autofocus;
            this.validate();
        }
    }
    placeholderChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.placeholder = this.placeholder;
        }
    }
    typeChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.type = this.type;
            this.validate();
        }
    }
    listChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.setAttribute("list", this.list);
            this.validate();
        }
    }
    maxlengthChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.maxLength = this.maxlength;
            this.validate();
        }
    }
    minlengthChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.minLength = this.minlength;
            this.validate();
        }
    }
    patternChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.pattern = this.pattern;
            this.validate();
        }
    }
    sizeChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.size = this.size;
        }
    }
    spellcheckChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.spellcheck = this.spellcheck;
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.proxy.setAttribute("type", this.type);
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
    TextField.prototype,
    "readOnly",
    void 0
);
__decorate([attr({ mode: "boolean" })], TextField.prototype, "autofocus", void 0);
__decorate([attr], TextField.prototype, "placeholder", void 0);
__decorate([attr], TextField.prototype, "type", void 0);
__decorate([attr], TextField.prototype, "list", void 0);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    TextField.prototype,
    "maxlength",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    TextField.prototype,
    "minlength",
    void 0
);
__decorate([attr], TextField.prototype, "pattern", void 0);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    TextField.prototype,
    "size",
    void 0
);
__decorate([attr({ mode: "boolean" })], TextField.prototype, "spellcheck", void 0);
__decorate([observable], TextField.prototype, "defaultSlottedNodes", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA textbox role
 *
 * @public
 */
export class DelegatesARIATextbox {}
applyMixins(DelegatesARIATextbox, ARIAGlobalStatesAndProperties);
applyMixins(TextField, StartEnd, DelegatesARIATextbox);
