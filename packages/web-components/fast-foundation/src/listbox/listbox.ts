import { attr, observable, Observable } from "@microsoft/fast-element";
import uniqueId from "lodash-es/uniqueId";
import { FoundationElement } from "../foundation-element";
import { isListboxOption, ListboxOption } from "../listbox-option/listbox-option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#listbox | ARIA listbox }.
 *
 * @public
 */
export class Listbox extends FoundationElement {
    /**
     * The index of the selected option
     *
     * @public
     */
    @observable
    public selectedIndex: number = -1;
    public selectedIndexChanged(prev: number, next: number): void {
        this.setSelectedOptions();
    }

    /**
     * Typeahead timeout in milliseconds.
     *
     * @internal
     */
    protected static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;

    /**
     * @internal
     */
    @observable
    protected typeaheadBuffer: string = "";
    public typeaheadBufferChanged(prev: string, next: string): void {
        if (this.$fastController.isConnected) {
            const pattern = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
            const re = new RegExp(`^${pattern}`, "gi");

            const filteredOptions = this.options.filter((o: ListboxOption) =>
                o.text.trim().match(re)
            );

            if (filteredOptions.length) {
                const selectedIndex = this.options.indexOf(filteredOptions[0]);
                if (selectedIndex > -1) {
                    this.selectedIndex = selectedIndex;
                }
            }

            this.typeAheadExpired = false;
        }
    }

    /**
     * @internal
     */
    protected typeaheadTimeout: number = -1;

    /**
     * Flag for the typeahead timeout expiration.
     *
     * @internal
     */
    protected typeAheadExpired: boolean = true;

    /**
     * The disabled state of the listbox.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * @internal
     */
    @observable
    public slottedOptions: HTMLElement[];
    public slottedOptionsChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.options = next.reduce((options, item) => {
                if (isListboxOption(item)) {
                    options.push(item);
                }
                return options;
            }, [] as ListboxOption[]);

            this.options.forEach(o => {
                o.id = o.id || uniqueId("option-");
            });

            this.setSelectedOptions();
            this.setDefaultSelectedOption();
        }
    }

    /**
     * The internal unfiltered list of selectable options.
     *
     * @internal
     */
    protected _options: ListboxOption[] = [];

    /**
     * The list of options.
     *
     * @public
     */
    public get options(): ListboxOption[] {
        Observable.track(this, "options");
        return this._options;
    }

    public set options(value: ListboxOption[]) {
        this._options = value;
        Observable.notify(this, "options");
    }

    /**
     * A collection of the selected options.
     *
     * @public
     */
    @observable
    public selectedOptions: ListboxOption[] = [];
    protected selectedOptionsChanged(prev, next): void {
        if (this.$fastController.isConnected) {
            this.options.forEach(o => {
                o.selected = next.includes(o);
            });
        }
    }

    /**
     * @internal
     */
    public get firstSelectedOption(): ListboxOption {
        return this.selectedOptions[0];
    }

    /**
     * @internal
     */
    protected focusAndScrollOptionIntoView(): void {
        if (this.contains(document.activeElement) && this.firstSelectedOption) {
            this.firstSelectedOption.focus();
            requestAnimationFrame(() => {
                this.firstSelectedOption.scrollIntoView({ block: "nearest" });
            });
        }
    }

    /**
     * A standard `click` event creates a `focus` event before firing, so a
     * `mousedown` event is used to skip that initial focus.
     *
     * @internal
     */
    private shouldSkipFocus: boolean = false;

    /**
     * @internal
     */
    public focusinHandler(e: FocusEvent): void {
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
    public mousedownHandler(e: MouseEvent): boolean | void {
        this.shouldSkipFocus = !this.contains(document.activeElement);
        return true;
    }

    /**
     * @internal
     */
    protected setDefaultSelectedOption() {
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
    protected setSelectedOptions() {
        if (this.$fastController.isConnected && this.options) {
            const selectedOption = this.options[this.selectedIndex] || null;

            this.selectedOptions = this.options.filter(el =>
                el.isSameNode(selectedOption)
            );
            this.ariaActiveDescendant = this.firstSelectedOption?.id ?? "";
            this.focusAndScrollOptionIntoView();
        }
    }

    /**
     * A static filter to include only enabled elements
     *
     * @param n - element to filter
     * @public
     */
    public static slottedOptionFilter = (n: Element) =>
        isListboxOption(n) && !n.disabled && !n.hidden;

    /**
     * Moves focus to the first selectable option
     *
     * @public
     */
    public selectFirstOption(): void {
        if (!this.disabled) {
            this.selectedIndex = 0;
        }
    }

    /**
     * Moves focus to the last selectable option
     *
     * @internal
     */
    public selectLastOption(): void {
        if (!this.disabled) {
            this.selectedIndex = this.options.length - 1;
        }
    }

    /**
     * Moves focus to the next selectable option
     *
     * @internal
     */
    public selectNextOption(): void {
        if (
            !this.disabled &&
            this.options &&
            this.selectedIndex < this.options.length - 1
        ) {
            this.selectedIndex += 1;
        }
    }

    public get length(): number {
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
    public selectPreviousOption(): void {
        if (!this.disabled && this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }

    /**
     * Handles click events for listbox options
     *
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        const captured = e.target;

        if (isListboxOption(captured) && !captured.disabled) {
            this.selectedIndex = this.options.indexOf(captured);
        }

        return true;
    }

    /**
     * Handles keydown actions for listbox navigation and typeahead
     *
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean | void {
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

    /**
     * Move focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If TYPE_AHEAD_TIMEOUT_MS passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param key - the key to be evaluated
     */
    public handleTypeAhead = (key: string): void => {
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

/**
 * Includes ARIA states and properties relating to the ARIA listbox role
 *
 * @public
 */
export class DelegatesARIAListbox {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-activedescendant
     */
    @observable
    public ariaActiveDescendant: string = "";

    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @observable
    public ariaExpanded: "true" | "false" | undefined;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface DelegatesARIAListbox extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIAListbox, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface Listbox extends DelegatesARIAListbox {}
applyMixins(Listbox, DelegatesARIAListbox);
