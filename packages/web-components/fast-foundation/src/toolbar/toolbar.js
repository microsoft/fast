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
import { attr, observable, Observable } from "@microsoft/fast-element";
import { ArrowKeys, Direction, limit, Orientation } from "@microsoft/fast-web-utilities";
import { isFocusable } from "tabbable";
import { FoundationElement } from "../foundation-element";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { getDirection } from "../utilities/direction";
/**
 * A map for directionality derived from keyboard input strings,
 * visual orientation, and text direction.
 *
 * @internal
 */
const ToolbarArrowKeyMap = Object.freeze({
    [ArrowKeys.ArrowUp]: {
        [Orientation.vertical]: -1,
    },
    [ArrowKeys.ArrowDown]: {
        [Orientation.vertical]: 1,
    },
    [ArrowKeys.ArrowLeft]: {
        [Orientation.horizontal]: {
            [Direction.ltr]: -1,
            [Direction.rtl]: 1,
        },
    },
    [ArrowKeys.ArrowRight]: {
        [Orientation.horizontal]: {
            [Direction.ltr]: 1,
            [Direction.rtl]: -1,
        },
    },
});
/**
 * A Toolbar Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#Toolbar|ARIA Toolbar}.
 *
 * @public
 */
export class Toolbar extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The internal index of the currently focused element.
         *
         * @internal
         */
        this._activeIndex = 0;
        /**
         * The text direction of the toolbar.
         *
         * @internal
         */
        this.direction = Direction.ltr;
        /**
         * The orientation of the toolbar.
         *
         * @public
         * @remarks
         * HTML Attribute: `orientation`
         */
        this.orientation = Orientation.horizontal;
    }
    /**
     * The index of the currently focused element, clamped between 0 and the last element.
     *
     * @internal
     */
    get activeIndex() {
        Observable.track(this, "activeIndex");
        return this._activeIndex;
    }
    set activeIndex(value) {
        if (this.$fastController.isConnected) {
            this._activeIndex = limit(0, this.focusableElements.length - 1, value);
            Observable.notify(this, "activeIndex");
        }
    }
    /**
     * Prepare the slotted elements which can be focusable.
     *
     * @param prev - The previous list of slotted elements.
     * @param next - The new list of slotted elements.
     * @internal
     */
    slottedItemsChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.focusableElements = next.reduce(Toolbar.reduceFocusableItems, []);
            this.setFocusableElements();
        }
    }
    /**
     * Set the activeIndex when a focusable element in the toolbar is clicked.
     *
     * @internal
     */
    clickHandler(e) {
        var _a;
        const activeIndex =
            (_a = this.focusableElements) === null || _a === void 0
                ? void 0
                : _a.indexOf(e.target);
        if (activeIndex > -1 && this.activeIndex !== activeIndex) {
            this.setFocusedElement(activeIndex);
        }
        return true;
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.direction = getDirection(this);
    }
    /**
     * When the toolbar receives focus, set the currently active element as focused.
     *
     * @internal
     */
    focusinHandler(e) {
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || this.contains(relatedTarget)) {
            return;
        }
        this.setFocusedElement();
    }
    /**
     * Determines a value that can be used to iterate a list with the arrow keys.
     *
     * @param this - An element with an orientation and direction
     * @param key - The event key value
     * @internal
     */
    getDirectionalIncrementer(key) {
        var _a, _b, _c, _d, _e;
        return (_e =
            (_c =
                (_b =
                    (_a = ToolbarArrowKeyMap[key]) === null || _a === void 0
                        ? void 0
                        : _a[this.orientation]) === null || _b === void 0
                    ? void 0
                    : _b[this.direction]) !== null && _c !== void 0
                ? _c
                : (_d = ToolbarArrowKeyMap[key]) === null || _d === void 0
                ? void 0
                : _d[this.orientation]) !== null && _e !== void 0
            ? _e
            : 0;
    }
    /**
     * Handle keyboard events for the toolbar.
     *
     * @internal
     */
    keydownHandler(e) {
        const key = e.key;
        if (!(key in ArrowKeys) || e.defaultPrevented || e.shiftKey) {
            return true;
        }
        const incrementer = this.getDirectionalIncrementer(key);
        if (!incrementer) {
            return !e.target.closest("[role=radiogroup]");
        }
        const nextIndex = this.activeIndex + incrementer;
        if (this.focusableElements[nextIndex]) {
            e.preventDefault();
        }
        this.setFocusedElement(nextIndex);
        return true;
    }
    /**
     * Set the activeIndex and focus the corresponding control.
     *
     * @param activeIndex - The new index to set
     * @internal
     */
    setFocusedElement(activeIndex = this.activeIndex) {
        var _a;
        this.activeIndex = activeIndex;
        this.setFocusableElements();
        (_a = this.focusableElements[this.activeIndex]) === null || _a === void 0
            ? void 0
            : _a.focus();
    }
    /**
     * Reduce a collection to only its focusable elements.
     *
     * @param elements - Collection of elements to reduce
     * @param element - The current element
     *
     * @internal
     */
    static reduceFocusableItems(elements, element) {
        var _a, _b, _c, _d;
        const isRoleRadio = element.getAttribute("role") === "radio";
        const isFocusableFastElement =
            (_b =
                (_a = element.$fastController) === null || _a === void 0
                    ? void 0
                    : _a.definition.shadowOptions) === null || _b === void 0
                ? void 0
                : _b.delegatesFocus;
        const hasFocusableShadow = Array.from(
            (_d =
                (_c = element.shadowRoot) === null || _c === void 0
                    ? void 0
                    : _c.querySelectorAll("*")) !== null && _d !== void 0
                ? _d
                : []
        ).some(x => isFocusable(x));
        if (
            isFocusable(element) ||
            isRoleRadio ||
            isFocusableFastElement ||
            hasFocusableShadow
        ) {
            elements.push(element);
            return elements;
        }
        if (element.childElementCount) {
            return elements.concat(
                Array.from(element.children).reduce(Toolbar.reduceFocusableItems, [])
            );
        }
        return elements;
    }
    /**
     * @internal
     */
    setFocusableElements() {
        if (this.$fastController.isConnected && this.focusableElements.length > 0) {
            this.focusableElements.forEach((element, index) => {
                element.tabIndex = this.activeIndex === index ? 0 : -1;
            });
        }
    }
}
__decorate([observable], Toolbar.prototype, "direction", void 0);
__decorate([attr], Toolbar.prototype, "orientation", void 0);
__decorate([observable], Toolbar.prototype, "slottedItems", void 0);
__decorate([observable], Toolbar.prototype, "slottedLabel", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA toolbar role
 *
 * @public
 */
export class DelegatesARIAToolbar {}
__decorate(
    [attr({ attribute: "aria-labelledby" })],
    DelegatesARIAToolbar.prototype,
    "ariaLabelledby",
    void 0
);
__decorate(
    [attr({ attribute: "aria-label" })],
    DelegatesARIAToolbar.prototype,
    "ariaLabel",
    void 0
);
applyMixins(DelegatesARIAToolbar, ARIAGlobalStatesAndProperties);
applyMixins(Toolbar, StartEnd, DelegatesARIAToolbar);
