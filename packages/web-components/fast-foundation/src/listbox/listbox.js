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
import uniqueId from "lodash-es/uniqueId";
import { FoundationElement } from "../foundation-element";
import { isListboxOption } from "../listbox-option/listbox-option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { applyMixins } from "../utilities/apply-mixins";
import { ListboxRole } from "./listbox.options";
/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#listbox | ARIA listbox }.
 *
 * @public
 */
export class Listbox extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * The index of the selected option
         *
         * @public
         */
        this.selectedIndex = -1;
        /**
         * @internal
         */
        this.typeaheadBuffer = "";
        /**
         * @internal
         */
        this.typeaheadTimeout = -1;
        /**
         * Flag for the typeahead timeout expiration.
         *
         * @internal
         */
        this.typeAheadExpired = true;
        /**
         * The role of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: role
         */
        this.role = ListboxRole.listbox;
        /**
         * The internal unfiltered list of selectable options.
         *
         * @internal
         */
        this._options = [];
        /**
         * A collection of the selected options.
         *
         * @public
         */
        this.selectedOptions = [];
        /**
         * A standard `click` event creates a `focus` event before firing, so a
         * `mousedown` event is used to skip that initial focus.
         *
         * @internal
         */
        this.shouldSkipFocus = false;
        /**
         * Move focus to an option whose label matches characters typed by the user.
         * Consecutive keystrokes are batched into a buffer of search text used
         * to match against the set of options.  If TYPE_AHEAD_TIMEOUT_MS passes
         * between consecutive keystrokes, the search restarts.
         *
         * @param key - the key to be evaluated
         */
        this.handleTypeAhead = key => {
            if (this.typeaheadTimeout) {
                window.clearTimeout(this.typeaheadTimeout);
            }
            this.typeaheadTimeout = window.setTimeout(
                () => (this.typeAheadExpired = true),
                Listbox.TYPE_AHEAD_TIMEOUT_MS
            );
            if (key.length > 1) {
                return;
            }
            this.typeaheadBuffer = `${
                this.typeAheadExpired ? "" : this.typeaheadBuffer
            }${key}`;
        };
    }
    selectedIndexChanged(prev, next) {
        this.setSelectedOptions();
    }
    typeaheadBufferChanged(prev, next) {
        if (this.$fastController.isConnected) {
            const pattern = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
            const re = new RegExp(`^${pattern}`, "gi");
            const filteredOptions = this.options.filter(o => o.text.trim().match(re));
            if (filteredOptions.length) {
                const selectedIndex = this.options.indexOf(filteredOptions[0]);
                if (selectedIndex > -1) {
                    this.selectedIndex = selectedIndex;
                }
            }
            this.typeAheadExpired = false;
        }
    }
    slottedOptionsChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.options = next.reduce((options, item) => {
                if (isListboxOption(item)) {
                    options.push(item);
                }
                return options;
            }, []);
            this.options.forEach(o => {
                o.id = o.id || uniqueId("option-");
            });
            this.setSelectedOptions();
            this.setDefaultSelectedOption();
        }
    }
    /**
     * The list of options.
     *
     * @public
     */
    get options() {
        Observable.track(this, "options");
        return this._options;
    }
    set options(value) {
        this._options = value;
        Observable.notify(this, "options");
    }
    selectedOptionsChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.options.forEach(o => {
                o.selected = next.includes(o);
            });
        }
    }
    /**
     * @internal
     */
    get firstSelectedOption() {
        return this.selectedOptions[0];
    }
    /**
     * @internal
     */
    focusAndScrollOptionIntoView() {
        if (this.contains(document.activeElement) && this.firstSelectedOption) {
            this.firstSelectedOption.focus();
            requestAnimationFrame(() => {
                this.firstSelectedOption.scrollIntoView({ block: "nearest" });
            });
        }
    }
    /**
     * @internal
     */
    focusinHandler(e) {
        if (!this.shouldSkipFocus && e.target === e.currentTarget) {
            this.setSelectedOptions();
            this.focusAndScrollOptionIntoView();
        }
        this.shouldSkipFocus = false;
    }
    /**
     * Prevents `focusin` events from firing before `click` events when the
     * element is unfocused.
     *
     * @internal
     */
    mousedownHandler(e) {
        this.shouldSkipFocus = !this.contains(document.activeElement);
        return true;
    }
    /**
     * @internal
     */
    setDefaultSelectedOption() {
        if (this.options && this.$fastController.isConnected) {
            const selectedIndex = this.options.findIndex(
                el => el.getAttribute("selected") !== null
            );
            if (selectedIndex !== -1) {
                this.selectedIndex = selectedIndex;
                return;
            }
            this.selectedIndex = 0;
        }
    }
    /**
     * Sets an option as selected and gives it focus.
     *
     * @param index - option index to select
     * @public
     */
    setSelectedOptions() {
        if (this.$fastController.isConnected && this.options) {
            const selectedOption = this.options[this.selectedIndex] || null;
            this.selectedOptions = this.options.filter(el =>
                el.isSameNode(selectedOption)
            );
            this.ariaActiveDescendant = this.firstSelectedOption
                ? this.firstSelectedOption.id
                : "";
            this.focusAndScrollOptionIntoView();
        }
    }
    /**
     * Moves focus to the first selectable option
     *
     * @public
     */
    selectFirstOption() {
        if (!this.disabled) {
            this.selectedIndex = 0;
        }
    }
    /**
     * Moves focus to the last selectable option
     *
     * @internal
     */
    selectLastOption() {
        if (!this.disabled) {
            this.selectedIndex = this.options.length - 1;
        }
    }
    /**
     * Moves focus to the next selectable option
     *
     * @internal
     */
    selectNextOption() {
        if (
            !this.disabled &&
            this.options &&
            this.selectedIndex < this.options.length - 1
        ) {
            this.selectedIndex += 1;
        }
    }
    get length() {
        if (this.options) {
            return this.options.length;
        }
        return 0;
    }
    /**
     * Moves focus to the previous selectable option
     *
     * @internal
     */
    selectPreviousOption() {
        if (!this.disabled && this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }
    /**
     * Handles click events for listbox options
     *
     * @internal
     */
    clickHandler(e) {
        const captured = e.target.closest(`option,[role=option]`);
        if (captured && !captured.disabled) {
            this.selectedIndex = this.options.indexOf(captured);
            return true;
        }
    }
    /**
     * Handles keydown actions for listbox navigation and typeahead
     *
     * @internal
     */
    keydownHandler(e) {
        if (this.disabled) {
            return true;
        }
        this.shouldSkipFocus = false;
        const key = e.key;
        switch (key) {
            // Select the first available option
            case "Home": {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectFirstOption();
                }
                break;
            }
            // Select the next selectable option
            case "ArrowDown": {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectNextOption();
                }
                break;
            }
            // Select the previous selectable option
            case "ArrowUp": {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectPreviousOption();
                }
                break;
            }
            // Select the last available option
            case "End": {
                e.preventDefault();
                this.selectLastOption();
                break;
            }
            case "Tab": {
                this.focusAndScrollOptionIntoView();
                return true;
            }
            case "Enter":
            case "Escape": {
                return true;
            }
            case " ": {
                if (this.typeAheadExpired) {
                    return true;
                }
            }
            // Send key to Typeahead handler
            default: {
                if (key.length === 1) {
                    this.handleTypeAhead(`${key}`);
                }
                return true;
            }
        }
    }
}
/**
 * Typeahead timeout in milliseconds.
 *
 * @internal
 */
Listbox.TYPE_AHEAD_TIMEOUT_MS = 1000;
/**
 * A static filter to include only enabled elements
 *
 * @param n - element to filter
 * @public
 */
Listbox.slottedOptionFilter = n => isListboxOption(n) && !n.disabled && !n.hidden;
__decorate([observable], Listbox.prototype, "selectedIndex", void 0);
__decorate([observable], Listbox.prototype, "typeaheadBuffer", void 0);
__decorate([attr], Listbox.prototype, "role", void 0);
__decorate([attr({ mode: "boolean" })], Listbox.prototype, "disabled", void 0);
__decorate([observable], Listbox.prototype, "slottedOptions", void 0);
__decorate([observable], Listbox.prototype, "selectedOptions", void 0);
/**
 * Includes ARIA states and properties relating to the ARIA listbox role
 *
 * @public
 */
export class DelegatesARIAListbox {
    constructor() {
        /**
         * See {@link https://www.w3.org/WAI/PF/aria/roles#listbox} for more information
         * @public
         * @remarks
         * HTML Attribute: aria-activedescendant
         */
        this.ariaActiveDescendant = "";
    }
}
__decorate([observable], DelegatesARIAListbox.prototype, "ariaActiveDescendant", void 0);
__decorate([observable], DelegatesARIAListbox.prototype, "ariaDisabled", void 0);
__decorate([observable], DelegatesARIAListbox.prototype, "ariaExpanded", void 0);
applyMixins(DelegatesARIAListbox, ARIAGlobalStatesAndProperties);
applyMixins(Listbox, DelegatesARIAListbox);
