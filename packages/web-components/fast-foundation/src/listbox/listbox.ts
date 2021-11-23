import { attr, observable, Observable } from "@microsoft/fast-element";
import {
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyEscape,
    keyHome,
    keySpace,
    keyTab,
    uniqueId,
} from "@microsoft/fast-web-utilities";
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
export abstract class Listbox extends FoundationElement {
    /**
     * The internal unfiltered list of selectable options.
     *
     * @internal
     */
    protected _options: ListboxOption[] = [];

    /**
     * The first selected option.
     *
     * @internal
     */
    public get firstSelectedOption(): ListboxOption {
        return this.selectedOptions[0] ?? null;
    }

    /**
     * The number of options.
     *
     * @public
     */
    public get length(): number {
        if (this.options) {
            return this.options.length;
        }

        return 0;
    }

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
     * Flag for the typeahead timeout expiration.
     *
     * @deprecated use `Listbox.typeaheadExpired`
     * @internal
     */
    protected get typeAheadExpired(): boolean {
        return this.typeaheadExpired;
    }

    protected set typeAheadExpired(value: boolean) {
        this.typeaheadExpired = value;
    }

    /**
     * The disabled state of the listbox.
     *
     * @public
     * @remarks
     * HTML Attribute: `disabled`
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * The index of the selected option.
     *
     * @public
     */
    @observable
    public selectedIndex: number = -1;

    /**
     * A collection of the selected options.
     *
     * @public
     */
    @observable
    public selectedOptions: ListboxOption[] = [];

    /**
     * A standard `click` event creates a `focus` event before firing, so a
     * `mousedown` event is used to skip that initial focus.
     *
     * @internal
     */
    protected shouldSkipFocus: boolean = false;

    /**
     * A static filter to include only selectable options.
     *
     * @param n - element to filter
     * @public
     */
    public static slottedOptionFilter = (n: HTMLElement) =>
        isListboxOption(n) && !n.disabled && !n.hidden;

    /**
     * The default slotted elements.
     *
     * @internal
     */
    @observable
    public slottedOptions: Element[];

    /**
     * Typeahead timeout in milliseconds.
     *
     * @internal
     */
    protected static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;

    /**
     * The current typeahead buffer string.
     *
     * @internal
     */
    @observable
    protected typeaheadBuffer: string = "";

    /**
     * Flag for the typeahead timeout expiration.
     *
     * @internal
     */
    protected typeaheadExpired: boolean = true;

    /**
     * The timeout ID for the typeahead handler.
     *
     * @internal
     */
    protected typeaheadTimeout: number = -1;

    /**
     * Handle click events for listbox options.
     *
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        const captured = (e.target as HTMLElement).closest(
            `option,[role=option]`
        ) as ListboxOption;

        if (captured && !captured.disabled) {
            this.selectedIndex = this.options.indexOf(captured);
            return true;
        }
    }

    /**
     * Focus the first selected option and scroll it into view.
     *
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
     * Handles `focusin` actions for the component. When the component receives focus,
     * the list of selected options is refreshed and the first selected option is scrolled
     * into view.
     *
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
     * Moves focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If `TYPE_AHEAD_TIMEOUT_MS` passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param key - the key to be evaluated
     */
    public handleTypeAhead(key: string): void {
        if (this.typeaheadTimeout) {
            window.clearTimeout(this.typeaheadTimeout);
        }

        this.typeaheadTimeout = window.setTimeout(
            () => (this.typeaheadExpired = true),
            Listbox.TYPE_AHEAD_TIMEOUT_MS
        );

        if (key.length > 1) {
            return;
        }

        this.typeaheadBuffer = `${
            this.typeaheadExpired ? "" : this.typeaheadBuffer
        }${key}`;
    }

    /**
     * Handles `keydown` actions for listbox navigation and typeahead.
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
            case keyHome: {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectFirstOption();
                }
                break;
            }

            // Select the next selectable option
            case keyArrowDown: {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectNextOption();
                }
                break;
            }

            // Select the previous selectable option
            case keyArrowUp: {
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.selectPreviousOption();
                }
                break;
            }

            // Select the last available option
            case keyEnd: {
                e.preventDefault();
                this.selectLastOption();
                break;
            }

            case keyTab: {
                this.focusAndScrollOptionIntoView();
                return true;
            }

            case keyEnter:
            case keyEscape: {
                return true;
            }

            case keySpace: {
                if (this.typeaheadExpired) {
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
     * Updates the list of selected options when the `selectedIndex` changes.
     *
     * @param prev - the previous selected index value
     * @param next - the current selected index value
     *
     * @internal
     */
    public selectedIndexChanged(prev: number, next: number): void {
        this.setSelectedOptions();
    }

    /**
     * Updates the selectedness of each option when the list of selected options changes.
     *
     * @param prev - the previous list of selected options
     * @param next - the current list of selected options
     *
     * @internal
     */
    protected selectedOptionsChanged(
        prev: ListboxOption[] | undefined,
        next: ListboxOption[]
    ): void {
        if (this.$fastController.isConnected) {
            this.options.forEach(o => {
                o.selected = next.includes(o);
            });
        }
    }

    /**
     * Moves focus to the first selectable option.
     *
     * @public
     */
    public selectFirstOption(): void {
        if (!this.disabled) {
            this.selectedIndex = 0;
        }
    }

    /**
     * Moves focus to the last selectable option.
     *
     * @internal
     */
    public selectLastOption(): void {
        if (!this.disabled) {
            this.selectedIndex = this.options.length - 1;
        }
    }

    /**
     * Moves focus to the next selectable option.
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

    /**
     * Moves focus to the previous selectable option.
     *
     * @internal
     */
    public selectPreviousOption(): void {
        if (!this.disabled && this.selectedIndex > 0) {
            this.selectedIndex = this.selectedIndex - 1;
        }
    }

    /**
     * Updates the selected index to match the first selected option.
     *
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
     * Sets the selected option and gives it focus.
     *
     * @public
     */
    protected setSelectedOptions() {
        if (this.$fastController.isConnected && this.options) {
            const selectedOption = this.options[this.selectedIndex] ?? null;

            this.selectedOptions = this.options.filter(el =>
                el.isSameNode(selectedOption)
            );

            this.ariaActiveDescendant = this.firstSelectedOption?.id ?? "";
            this.focusAndScrollOptionIntoView();
        }
    }

    /**
     * Updates the list of options and resets the selected option when the slotted option content changes.
     *
     * @param prev - the previous list of slotted options
     * @param next - the current list of slotted options
     *
     * @internal
     */
    public slottedOptionsChanged(prev: Element[] | unknown, next: Element[]) {
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
     * Updates the filtered list of options when the typeahead buffer changes.
     *
     * @param prev - the previous typeahead buffer value
     * @param next - the current typeahead buffer value
     *
     * @internal
     */
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

            this.typeaheadExpired = false;
        }
    }
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
     * HTML Attribute: aria-disabled
     */
    @observable
    public ariaDisabled: "true" | "false";

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
