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
import { attr, DOM } from "@microsoft/fast-element";
import { keyCodeEscape, keyCodeTab } from "@microsoft/fast-web-utilities";
import { isTabbable } from "tabbable";
import { FoundationElement } from "../foundation-element";
/**
 * A Switch Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#dialog | ARIA dialog }.
 *
 * @public
 */
export class Dialog extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * Indicates the element is modal. When modal, user interaction will be limited to the contents of the element.
         * @public
         * @defaultValue - true
         * @remarks
         * HTML Attribute: modal
         */
        this.modal = true;
        /**
         * The hidden state of the element.
         *
         * @public
         * @defaultValue - false
         * @remarks
         * HTML Attribute: hidden
         */
        this.hidden = false;
        /**
         * Indicates that the dialog should trap focus.
         *
         * @public
         * @defaultValue - true
         * @remarks
         * HTML Attribute: trap-focus
         */
        this.trapFocus = true;
        this.trapFocusChanged = () => {
            if (this.trapFocus) {
                // Add an event listener for focusin events if we should be trapping focus
                document.addEventListener("focusin", this.handleDocumentFocus);
                // determine if we should move focus inside the dialog
                if (this.shouldForceFocus(document.activeElement)) {
                    this.focusFirstElement();
                }
            } else {
                // remove event listener if we are not trapping focus
                document.removeEventListener("focusin", this.handleDocumentFocus);
            }
        };
        this.handleDocumentKeydown = e => {
            if (!e.defaultPrevented && !this.hidden) {
                switch (e.keyCode) {
                    case keyCodeEscape:
                        this.dismiss();
                        e.preventDefault();
                        break;
                    case keyCodeTab:
                        this.handleTabKeyDown(e);
                        break;
                }
            }
        };
        this.handleDocumentFocus = e => {
            if (!e.defaultPrevented && this.shouldForceFocus(e.target)) {
                this.focusFirstElement();
                e.preventDefault();
            }
        };
        this.handleTabKeyDown = e => {
            if (!this.trapFocus || this.hidden) {
                return;
            }
            const bounds = this.getTabQueueBounds();
            if (bounds.length === 0) {
                return;
            }
            if (bounds.length === 1) {
                // keep focus on single element
                bounds[0].focus();
                e.preventDefault();
                return;
            }
            if (e.shiftKey && e.target === bounds[0]) {
                bounds[bounds.length - 1].focus();
                e.preventDefault();
            } else if (!e.shiftKey && e.target === bounds[bounds.length - 1]) {
                bounds[0].focus();
                e.preventDefault();
            }
            return;
        };
        this.getTabQueueBounds = () => {
            const bounds = [];
            return Dialog.reduceTabbableItems(bounds, this);
        };
        /**
         * focus on first element of tab queue
         */
        this.focusFirstElement = () => {
            const bounds = this.getTabQueueBounds();
            if (bounds.length > 0) {
                bounds[0].focus();
            }
        };
        /**
         * we should only focus if focus has not already been brought to the dialog
         */
        this.shouldForceFocus = currentFocusElement => {
            return !this.hidden && !this.contains(currentFocusElement);
        };
    }
    /**
     * @internal
     */
    dismiss() {
        this.$emit("dismiss");
    }
    /**
     * The method to show the dialog.
     *
     * @public
     */
    show() {
        this.hidden = false;
    }
    /**
     * The method to hide the dialog.
     *
     * @public
     */
    hide() {
        this.hidden = true;
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this.handleDocumentKeydown);
        // Ensure the DOM is updated
        // This helps avoid a delay with `autofocus` elements receiving focus
        DOM.queueUpdate(this.trapFocusChanged);
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        // remove keydown event listener
        document.removeEventListener("keydown", this.handleDocumentKeydown);
        // if we are trapping focus remove the focusin listener
        if (this.trapFocus) {
            document.removeEventListener("focusin", this.handleDocumentFocus);
        }
    }
    /**
     * Reduce a collection to only its focusable elements.
     *
     * @param elements - Collection of elements to reduce
     * @param element - The current element
     *
     * @internal
     */
    static reduceTabbableItems(elements, element) {
        if (element.getAttribute("tabindex") === "-1") {
            return elements;
        }
        if (
            isTabbable(element) ||
            (Dialog.isFocusableFastElement(element) && Dialog.hasTabbableShadow(element))
        ) {
            elements.push(element);
            return elements;
        }
        if (element.childElementCount) {
            return elements.concat(
                Array.from(element.children).reduce(Dialog.reduceTabbableItems, [])
            );
        }
        return elements;
    }
    /**
     * Test if element is focusable fast element
     *
     * @param element - The element to check
     *
     * @internal
     */
    static isFocusableFastElement(element) {
        var _a, _b;
        return !!((_b =
            (_a = element.$fastController) === null || _a === void 0
                ? void 0
                : _a.definition.shadowOptions) === null || _b === void 0
            ? void 0
            : _b.delegatesFocus);
    }
    /**
     * Test if the element has a focusable shadow
     *
     * @param element - The element to check
     *
     * @internal
     */
    static hasTabbableShadow(element) {
        var _a, _b;
        return Array.from(
            (_b =
                (_a = element.shadowRoot) === null || _a === void 0
                    ? void 0
                    : _a.querySelectorAll("*")) !== null && _b !== void 0
                ? _b
                : []
        ).some(x => {
            return isTabbable(x);
        });
    }
}
__decorate([attr({ mode: "boolean" })], Dialog.prototype, "modal", void 0);
__decorate([attr({ mode: "boolean" })], Dialog.prototype, "hidden", void 0);
__decorate(
    [attr({ attribute: "trap-focus", mode: "boolean" })],
    Dialog.prototype,
    "trapFocus",
    void 0
);
__decorate(
    [attr({ attribute: "aria-describedby" })],
    Dialog.prototype,
    "ariaDescribedby",
    void 0
);
__decorate(
    [attr({ attribute: "aria-labelledby" })],
    Dialog.prototype,
    "ariaLabelledby",
    void 0
);
__decorate([attr({ attribute: "aria-label" })], Dialog.prototype, "ariaLabel", void 0);
