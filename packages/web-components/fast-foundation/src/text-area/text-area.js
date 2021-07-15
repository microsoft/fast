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
import { attr, nullableNumberConverter, observable } from "@microsoft/fast-element";
import { DelegatesARIATextbox } from "../text-field/index";
import { applyMixins } from "../utilities";
import { FormAssociatedTextArea } from "./text-area.form-associated";
import { TextAreaResize } from "./text-area.options";
export { TextAreaResize };
/**
 * A Text Area Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea | <textarea> element }.
 *
 * @public
 */
export class TextArea extends FormAssociatedTextArea {
    constructor() {
        super(...arguments);
        /**
         * The resize mode of the element.
         * @public
         * @remarks
         * HTML Attribute: resize
         */
        this.resize = TextAreaResize.none;
        /**
         * Sizes the element horizontally by a number of character columns.
         *
         * @public
         * @remarks
         * HTML Attribute: cols
         */
        this.cols = 20;
        /**
         * @internal
         */
        this.handleTextInput = () => {
            this.value = this.control.value;
        };
    }
    readOnlyChanged() {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.readOnly = this.readOnly;
        }
    }
    autofocusChanged() {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.autofocus = this.autofocus;
        }
    }
    listChanged() {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.setAttribute("list", this.list);
        }
    }
    maxlengthChanged() {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.maxLength = this.maxlength;
        }
    }
    minlengthChanged() {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.minLength = this.minlength;
        }
    }
    spellcheckChanged() {
        if (this.proxy instanceof HTMLTextAreaElement) {
            this.proxy.spellcheck = this.spellcheck;
        }
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
__decorate([attr({ mode: "boolean" })], TextArea.prototype, "readOnly", void 0);
__decorate([attr], TextArea.prototype, "resize", void 0);
__decorate([attr({ mode: "boolean" })], TextArea.prototype, "autofocus", void 0);
__decorate([attr({ attribute: "form" })], TextArea.prototype, "formId", void 0);
__decorate([attr], TextArea.prototype, "list", void 0);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    TextArea.prototype,
    "maxlength",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    TextArea.prototype,
    "minlength",
    void 0
);
__decorate([attr], TextArea.prototype, "name", void 0);
__decorate([attr], TextArea.prototype, "placeholder", void 0);
__decorate(
    [attr({ converter: nullableNumberConverter, mode: "fromView" })],
    TextArea.prototype,
    "cols",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter, mode: "fromView" })],
    TextArea.prototype,
    "rows",
    void 0
);
__decorate([attr({ mode: "boolean" })], TextArea.prototype, "spellcheck", void 0);
__decorate([observable], TextArea.prototype, "defaultSlottedNodes", void 0);
applyMixins(TextArea, DelegatesARIATextbox);
