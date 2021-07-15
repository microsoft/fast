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
import { ARIAGlobalStatesAndProperties, StartEnd } from "../patterns/index";
import { applyMixins } from "../utilities/apply-mixins";
import { FormAssociatedButton } from "./button.form-associated";
/**
 * A Button Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | <button> element }.
 *
 * @public
 */
export class Button extends FormAssociatedButton {
    constructor() {
        super(...arguments);
        /**
         * Submits the parent form
         */
        this.handleSubmission = () => {
            if (!this.form) {
                return;
            }
            const attached = this.proxy.isConnected;
            if (!attached) {
                this.attachProxy();
            }
            // Browser support for requestSubmit is not comprehensive
            // so click the proxy if it isn't supported
            typeof this.form.requestSubmit === "function"
                ? this.form.requestSubmit(this.proxy)
                : this.proxy.click();
            if (!attached) {
                this.detachProxy();
            }
        };
        /**
         * Resets the parent form
         */
        this.handleFormReset = () => {
            var _a;
            (_a = this.form) === null || _a === void 0 ? void 0 : _a.reset();
        };
    }
    formactionChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formAction = this.formaction;
        }
    }
    formenctypeChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formEnctype = this.formenctype;
        }
    }
    formmethodChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formMethod = this.formmethod;
        }
    }
    formnovalidateChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formNoValidate = this.formnovalidate;
        }
    }
    formtargetChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.formTarget = this.formtarget;
        }
    }
    typeChanged(previous, next) {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.type = this.type;
        }
        next === "submit" && this.addEventListener("click", this.handleSubmission);
        previous === "submit" && this.removeEventListener("click", this.handleSubmission);
        next === "reset" && this.addEventListener("click", this.handleFormReset);
        previous === "reset" && this.removeEventListener("click", this.handleFormReset);
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.proxy.setAttribute("type", this.type);
    }
}
__decorate([attr({ mode: "boolean" })], Button.prototype, "autofocus", void 0);
__decorate([attr({ attribute: "form" })], Button.prototype, "formId", void 0);
__decorate([attr], Button.prototype, "formaction", void 0);
__decorate([attr], Button.prototype, "formenctype", void 0);
__decorate([attr], Button.prototype, "formmethod", void 0);
__decorate([attr({ mode: "boolean" })], Button.prototype, "formnovalidate", void 0);
__decorate([attr], Button.prototype, "formtarget", void 0);
__decorate([attr], Button.prototype, "type", void 0);
__decorate([observable], Button.prototype, "defaultSlottedContent", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA button role
 *
 * @public
 */
export class DelegatesARIAButton {}
__decorate(
    [attr({ attribute: "aria-expanded", mode: "fromView" })],
    DelegatesARIAButton.prototype,
    "ariaExpanded",
    void 0
);
__decorate(
    [attr({ attribute: "aria-pressed", mode: "fromView" })],
    DelegatesARIAButton.prototype,
    "ariaPressed",
    void 0
);
applyMixins(DelegatesARIAButton, ARIAGlobalStatesAndProperties);
applyMixins(Button, StartEnd, DelegatesARIAButton);
