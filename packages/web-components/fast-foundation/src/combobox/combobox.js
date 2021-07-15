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
import { limit } from "@microsoft/fast-web-utilities";
import uniqueId from "lodash-es/uniqueId";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { SelectPosition, SelectRole } from "../select/select.options";
import { applyMixins } from "../utilities/apply-mixins";
import { FormAssociatedCombobox } from "./combobox.form-associated";
import { ComboboxAutocomplete } from "./combobox.options";
/**
 * A Combobox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#combobox | ARIA combobox }.
 *
 * @public
 */
export class Combobox extends FormAssociatedCombobox {
    constructor() {
        super(...arguments);
        /**
         * The internal value property.
         *
         * @internal
         */
        this._value = "";
        /**
         * The collection of currently filtered options.
         *
         * @public
         */
        this.filteredOptions = [];
        /**
         * The current filter value.
         *
         * @internal
         */
        this.filter = "";
        /**
         * The initial state of the position attribute.
         *
         * @internal
         */
        this.forcedPosition = false;
        /**
         * Reset the element to its first selectable option when its parent form is reset.
         *
         * @internal
         */
        this.formResetCallback = () => {
            this.value = this.initialValue;
            this.dirtyValue = false;
            this.setDefaultSelectedOption();
            this.updateValue();
        };
        /**
         * The unique id of the internal listbox.
         *
         * @internal
         */
        this.listboxId = uniqueId("listbox-");
        /**
         * The max height for the listbox when opened.
         *
         * @internal
         */
        this.maxHeight = 0;
        /**
         * The open attribute.
         *
         * @public
         * @remarks
         * HTML Attribute: open
         */
        this.open = false;
        /**
         * The current state of the calculated position of the listbox.
         *
         * @public
         */
        this.position = SelectPosition.below;
        /**
         * The role of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: role
         */
        this.role = SelectRole.combobox;
    }
    get isAutocompleteInline() {
        return (
            this.autocomplete === ComboboxAutocomplete.inline || this.isAutocompleteBoth
        );
    }
    get isAutocompleteList() {
        return this.autocomplete === ComboboxAutocomplete.list || this.isAutocompleteBoth;
    }
    get isAutocompleteBoth() {
        return this.autocomplete === ComboboxAutocomplete.both;
    }
    openChanged() {
        this.ariaExpanded = this.open ? "true" : "false";
        if (this.open) {
            this.setPositioning();
            this.focusAndScrollOptionIntoView();
        }
    }
    /**
     * The list of options.
     *
     * @public
     * @remarks
     * Overrides `Listbox.options`.
     */
    get options() {
        Observable.track(this, "options");
        return this.filteredOptions.length ? this.filteredOptions : this._options;
    }
    set options(value) {
        this._options = value;
        Observable.notify(this, "options");
    }
    /**
     * Updates the placeholder on the proxy element.
     * @internal
     */
    placeholderChanged() {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.placeholder = this.placeholder;
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
        var _a, _b, _c;
        const prev = `${this._value}`;
        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.options.findIndex(
                el => el.text.toLowerCase() === next.toLowerCase()
            );
            const prevSelectedValue =
                (_a = this.options[this.selectedIndex]) === null || _a === void 0
                    ? void 0
                    : _a.text;
            const nextSelectedValue =
                (_b = this.options[selectedIndex]) === null || _b === void 0
                    ? void 0
                    : _b.text;
            this.selectedIndex =
                prevSelectedValue !== nextSelectedValue
                    ? selectedIndex
                    : this.selectedIndex;
            next =
                ((_c = this.firstSelectedOption) === null || _c === void 0
                    ? void 0
                    : _c.text) || next;
        }
        if (prev !== next) {
            this._value = next;
            super.valueChanged(prev, next);
            Observable.notify(this, "value");
        }
    }
    /**
     * Handle opening and closing the listbox when the combobox is clicked.
     *
     * @param e - the mouse event
     * @internal
     */
    clickHandler(e) {
        if (this.disabled) {
            return;
        }
        if (this.open) {
            const captured = e.target.closest(`option,[role=option]`);
            if (!captured || captured.disabled) {
                return;
            }
            this.selectedOptions = [captured];
            this.control.value = captured.text;
        }
        this.open = !this.open;
        if (!this.open) {
            this.updateValue(true);
        }
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
        if (this.value) {
            this.initialValue = this.value;
        }
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
     * Filter available options by text value.
     *
     * @public
     */
    filterOptions() {
        if (!this.autocomplete || this.autocomplete === ComboboxAutocomplete.none) {
            this.filter = "";
        }
        const filter = this.filter.toLowerCase();
        this.filteredOptions = this._options.filter(o =>
            o.text.toLowerCase().startsWith(this.filter.toLowerCase())
        );
        if (this.isAutocompleteList) {
            if (!this.filteredOptions.length && !filter) {
                this.filteredOptions = this._options;
            }
            this._options.forEach(o => {
                o.hidden = !this.filteredOptions.includes(o);
            });
        }
    }
    /**
     * Handle focus state when the element or its children lose focus.
     *
     * @param e - The focus event
     * @internal
     */
    focusoutHandler(e) {
        this.updateValue();
        if (!this.open) {
            return true;
        }
        const focusTarget = e.relatedTarget;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return;
        }
        if (!this.options || !this.options.includes(focusTarget)) {
            this.open = false;
        }
    }
    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    inputHandler(e) {
        this.filter = this.control.value;
        this.filterOptions();
        if (e.inputType === "deleteContentBackward" || !this.filter.length) {
            return true;
        }
        if (this.isAutocompleteList && !this.open) {
            this.open = true;
        }
        if (this.isAutocompleteInline && this.filteredOptions.length) {
            this.selectedOptions = [this.filteredOptions[0]];
            this.selectedIndex = this.options.indexOf(this.firstSelectedOption);
            this.setInlineSelection();
        }
        return;
    }
    /**
     * Handle keydown actions for listbox navigation.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e) {
        const key = e.key;
        if (e.ctrlKey || e.shiftKey) {
            return true;
        }
        switch (key) {
            case "Enter": {
                this.updateValue(true);
                if (this.isAutocompleteInline) {
                    this.filter = this.value;
                }
                this.open = false;
                const controlValueLength = this.control.value.length;
                this.control.setSelectionRange(controlValueLength, controlValueLength);
                break;
            }
            case "Escape": {
                if (!this.isAutocompleteInline) {
                    this.selectedIndex = -1;
                }
                if (this.open) {
                    this.open = false;
                    break;
                }
                this.value = "";
                this.control.value = "";
                this.filter = "";
                this.filterOptions();
                break;
            }
            case "Tab": {
                this.updateValue();
                if (!this.open) {
                    return true;
                }
                e.preventDefault();
                this.open = false;
                break;
            }
            case "ArrowUp":
            case "ArrowDown": {
                this.filterOptions();
                if (!this.open) {
                    this.open = true;
                    break;
                }
                if (this.filteredOptions.length > 0) {
                    super.keydownHandler(e);
                }
                if (this.isAutocompleteInline) {
                    this.updateValue();
                    this.setInlineSelection();
                }
                break;
            }
            default: {
                return true;
            }
        }
    }
    /**
     * Handle keyup actions for value input and text field manipulations.
     *
     * @param e - the keyboard event
     * @internal
     */
    keyupHandler(e) {
        const key = e.key;
        switch (key) {
            case "ArrowLeft":
            case "ArrowRight":
            case "Backspace":
            case "Delete":
            case "Home":
            case "End": {
                this.filter = this.control.value;
                this.selectedIndex = -1;
                this.filterOptions();
                break;
            }
        }
    }
    /**
     * Ensure that the selectedIndex is within the current allowable filtered range.
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.selectedIndexChanged`
     */
    selectedIndexChanged(prev, next) {
        if (this.$fastController.isConnected) {
            next = limit(-1, this.options.length - 1, next);
            // we only want to call the super method when the selectedIndex is in range
            if (next !== this.selectedIndex) {
                this.selectedIndex = next;
                return;
            }
            super.selectedIndexChanged(prev, next);
        }
    }
    /**
     * Move focus to the previous selectable option.
     *
     * @internal
     * @remarks
     * Overrides `Listbox.selectPreviousOption`
     */
    selectPreviousOption() {
        if (!this.disabled && this.selectedIndex >= 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }
    /**
     * Set the default selected options at initialization or reset.
     *
     * @internal
     * @remarks
     * Overrides `Listbox.setDefaultSelectedOption`
     */
    setDefaultSelectedOption() {
        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.options.findIndex(
                el => el.getAttribute("selected") !== null || el.selected
            );
            this.selectedIndex = selectedIndex;
            if (!this.dirtyValue && this.firstSelectedOption) {
                this.value = this.firstSelectedOption.text;
            }
            this.setSelectedOptions();
        }
    }
    /**
     * Focus and select the content of the control based on the first selected option.
     *
     * @param start - The index for the starting range
     * @internal
     */
    setInlineSelection() {
        if (this.firstSelectedOption) {
            this.control.value = this.firstSelectedOption.text;
            this.control.focus();
            this.control.setSelectionRange(
                this.filter.length,
                this.control.value.length,
                "backward"
            );
        }
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
     * Ensure that the entire list of options is used when setting the selected property.
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.selectedOptionsChanged`
     */
    selectedOptionsChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this._options.forEach(o => {
                o.selected = next.includes(o);
            });
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
        this.updateValue();
    }
    /**
     * @internal
     */
    updateValue(shouldEmit) {
        var _a;
        if (this.$fastController.isConnected) {
            this.value =
                ((_a = this.firstSelectedOption) === null || _a === void 0
                    ? void 0
                    : _a.text) || this.control.value;
        }
        if (shouldEmit) {
            this.$emit("change");
        }
    }
}
__decorate(
    [attr({ attribute: "autocomplete", mode: "fromView" })],
    Combobox.prototype,
    "autocomplete",
    void 0
);
__decorate([observable], Combobox.prototype, "maxHeight", void 0);
__decorate(
    [attr({ attribute: "open", mode: "boolean" })],
    Combobox.prototype,
    "open",
    void 0
);
__decorate([attr], Combobox.prototype, "placeholder", void 0);
__decorate(
    [attr({ attribute: "position" })],
    Combobox.prototype,
    "positionAttribute",
    void 0
);
__decorate([observable], Combobox.prototype, "position", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA combobox role.
 *
 * @public
 */
export class DelegatesARIACombobox {}
__decorate(
    [attr({ attribute: "aria-autocomplete", mode: "fromView" })],
    DelegatesARIACombobox.prototype,
    "ariaAutocomplete",
    void 0
);
applyMixins(DelegatesARIACombobox, ARIAGlobalStatesAndProperties);
applyMixins(Combobox, StartEnd, DelegatesARIACombobox);
