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
import { attr, Observable, observable } from "@microsoft/fast-element";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { FormAssociatedSelect } from "./select.form-associated";
import { SelectPosition, SelectRole } from "./select.options";
/**
 * A Select Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#select | ARIA select }.
 *
 * @public
 */
export class Select extends FormAssociatedSelect {
    constructor() {
        super(...arguments);
        /**
         * The open attribute.
         *
         * @internal
         */
        this.open = false;
        /**
         * Indicates the initial state of the position attribute.
         *
         * @internal
         */
        this.forcedPosition = false;
        /**
         * The role of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: role
         */
        this.role = SelectRole.combobox;
        /**
         * Holds the current state for the calculated position of the listbox.
         *
         * @public
         */
        this.position = SelectPosition.below;
        /**
         * The max height for the listbox when opened.
         *
         * @internal
         */
        this.maxHeight = 0;
        /**
         * The value displayed on the button.
         *
         * @public
         */
        this.displayValue = "";
        /**
         * Reset the element to its first selectable option when its parent form is reset.
         *
         * @internal
         */
        this.formResetCallback = () => {
            this.setProxyOptions();
            this.setDefaultSelectedOption();
            this.value = this.firstSelectedOption.value;
        };
    }
    openChanged() {
        this.ariaExpanded = this.open ? "true" : "false";
        if (this.open) {
            this.setPositioning();
            this.focusAndScrollOptionIntoView();
            this.indexWhenOpened = this.selectedIndex;
        }
    }
    /**
     * The value property.
     *
     * @public
     */
    get value() {
        Observable.track(this, "value");
        return this._value;
    }
    set value(next) {
        const prev = `${this._value}`;
        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.options.findIndex(el => el.value === next);
            const prevSelectedOption = this.options[this.selectedIndex];
            const nextSelectedOption = this.options[selectedIndex];
            const prevSelectedValue = prevSelectedOption
                ? prevSelectedOption.value
                : null;
            const nextSelectedValue = nextSelectedOption
                ? nextSelectedOption.value
                : null;
            if (selectedIndex === -1 || prevSelectedValue !== nextSelectedValue) {
                next = "";
                this.selectedIndex = selectedIndex;
            }
            if (this.firstSelectedOption) {
                next = this.firstSelectedOption.value;
            }
        }
        if (prev !== next) {
            this._value = next;
            super.valueChanged(prev, next);
            Observable.notify(this, "value");
        }
    }
    updateValue(shouldEmit) {
        if (this.$fastController.isConnected) {
            this.value = this.firstSelectedOption ? this.firstSelectedOption.value : "";
            this.displayValue = this.firstSelectedOption
                ? this.firstSelectedOption.textContent || this.firstSelectedOption.value
                : this.value;
        }
        if (shouldEmit) {
            this.$emit("input");
            this.$emit("change", this, {
                bubbles: true,
                composed: undefined,
            });
        }
    }
    /**
     * Updates the proxy value when the selected index changes.
     *
     * @param prev - the previous selected index
     * @param next - the next selected index
     *
     * @internal
     */
    selectedIndexChanged(prev, next) {
        super.selectedIndexChanged(prev, next);
        this.updateValue();
    }
    /**
     * Calculate and apply listbox positioning based on available viewport space.
     *
     * @param force - direction to force the listbox to display
     * @public
     */
    setPositioning() {
        const currentBox = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const availableBottom = viewportHeight - currentBox.bottom;
        this.position = this.forcedPosition
            ? this.positionAttribute
            : currentBox.top > availableBottom
            ? SelectPosition.above
            : SelectPosition.below;
        this.positionAttribute = this.forcedPosition
            ? this.positionAttribute
            : this.position;
        this.maxHeight =
            this.position === SelectPosition.above ? ~~currentBox.top : ~~availableBottom;
    }
    /**
     * Synchronize the `aria-disabled` property when the `disabled` property changes.
     *
     * @param prev - The previous disabled value
     * @param next - The next disabled value
     *
     * @internal
     */
    disabledChanged(prev, next) {
        if (super.disabledChanged) {
            super.disabledChanged(prev, next);
        }
        this.ariaDisabled = this.disabled ? "true" : "false";
    }
    /**
     * Handle opening and closing the listbox when the select is clicked.
     *
     * @param e - the mouse event
     * @internal
     */
    clickHandler(e) {
        // do nothing if the select is disabled
        if (this.disabled) {
            return;
        }
        if (this.open) {
            const captured = e.target.closest(`option,[role=option]`);
            if (captured && captured.disabled) {
                return;
            }
        }
        super.clickHandler(e);
        this.open = !this.open;
        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
        }
        return true;
    }
    /**
     * Handle focus state when the element or its children lose focus.
     *
     * @param e - The focus event
     * @internal
     */
    focusoutHandler(e) {
        var _a;
        if (!this.open) {
            return true;
        }
        const focusTarget = e.relatedTarget;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return;
        }
        if (
            !((_a = this.options) === null || _a === void 0
                ? void 0
                : _a.includes(focusTarget))
        ) {
            this.open = false;
            if (this.indexWhenOpened !== this.selectedIndex) {
                this.updateValue(true);
            }
        }
    }
    /**
     * Synchronize the form-associated proxy and update the value property of the element.
     *
     * @param prev - the previous collection of slotted option elements
     * @param next - the next collection of slotted option elements
     *
     * @internal
     */
    slottedOptionsChanged(prev, next) {
        super.slottedOptionsChanged(prev, next);
        this.setProxyOptions();
        this.updateValue();
    }
    /**
     * Reset and fill the proxy to match the component's options.
     *
     * @internal
     */
    setProxyOptions() {
        if (this.proxy instanceof HTMLSelectElement && this.options) {
            this.proxy.options.length = 0;
            this.options.forEach(option => {
                const proxyOption =
                    option.proxy ||
                    (option instanceof HTMLOptionElement ? option.cloneNode() : null);
                if (proxyOption) {
                    this.proxy.appendChild(proxyOption);
                }
            });
        }
    }
    /**
     * Handle keyboard interaction for the select.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e) {
        super.keydownHandler(e);
        const key = e.key || e.key.charCodeAt(0);
        switch (key) {
            case " ": {
                if (this.typeAheadExpired) {
                    e.preventDefault();
                    this.open = !this.open;
                }
                break;
            }
            case "Enter": {
                e.preventDefault();
                this.open = !this.open;
                break;
            }
            case "Escape": {
                if (this.open) {
                    e.preventDefault();
                    this.open = false;
                }
                break;
            }
            case "Tab": {
                if (!this.open) {
                    return true;
                }
                e.preventDefault();
                this.open = false;
            }
        }
        if (!this.open && this.indexWhenOpened !== this.selectedIndex) {
            this.updateValue(true);
            this.indexWhenOpened = this.selectedIndex;
        }
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
    }
}
__decorate(
    [attr({ attribute: "open", mode: "boolean" })],
    Select.prototype,
    "open",
    void 0
);
__decorate(
    [attr({ attribute: "position" })],
    Select.prototype,
    "positionAttribute",
    void 0
);
__decorate([observable], Select.prototype, "position", void 0);
__decorate([observable], Select.prototype, "maxHeight", void 0);
__decorate([observable], Select.prototype, "displayValue", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA select role.
 *
 * @public
 */
export class DelegatesARIASelect {}
__decorate([observable], DelegatesARIASelect.prototype, "ariaExpanded", void 0);
__decorate(
    [attr({ attribute: "aria-pressed", mode: "fromView" })],
    DelegatesARIASelect.prototype,
    "ariaPressed",
    void 0
);
applyMixins(DelegatesARIASelect, ARIAGlobalStatesAndProperties);
applyMixins(Select, StartEnd, DelegatesARIASelect);
