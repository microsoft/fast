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
import { ListboxRole } from "./listbox.options";

/**
 * The abstract class for Listbox-based components.
 *
 * @remarks
 *
 * This abstract class is the basis for the {@link (ListboxElement:class)},
 * {@link (Select:class)}, and {@link (Combobox:class)} classes. These components all have
 * a similar interaction model, but differ in how they express ARIA-driven accessibility
 * features. For instance, {@link (ListboxElement:class)} and {@link (Select:class)}
 * support `size` and `multiple`, while {@link (Combobox:class)} does not. Similarly,
 * {@link (Select:class)} and {@link (Combobox:class)} are both
 * {@link (FormAssociated:function)|form-associated}, but {@link (ListboxElement:class)} is not.
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
     * The disabled state of the listbox.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * Returns the first selected option.
     *
     * @internal
     */
    public get firstSelectedOption(): ListboxOption {
        return this.selectedOptions[0];
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

    /**
     * The count of available options.
     *
     * @public
     */
    public get length(): number {
        return this.options?.length ?? 0;
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
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    @attr
    public role: string = ListboxRole.listbox;

    /**
     * The index of the selected option.
     *
     * @public
     */
    @observable
    public selectedIndex: number = -1;
    public selectedIndexChanged(prev: number, next: number): void {
        if (this.options?.[this.selectedIndex]?.disabled) {
            const selectableIndex = this.getSelectableIndex(prev, next);
            this.selectedIndex = selectableIndex > -1 ? selectableIndex : prev;
            return;
        }

        this.setSelectedOptions();
    }

    protected getSelectableIndex(prev: number = this.selectedIndex, next: number) {
        const direction = prev > next ? -1 : prev < next ? 1 : 0;
        const potentialDirection = prev + direction;

        let nextSelectableOption: ListboxOption | null = null;

        switch (direction) {
            case -1: {
                nextSelectableOption = this.options.reduceRight(
                    (nextSelectableOption, thisOption, index) =>
                        !nextSelectableOption &&
                        !thisOption.disabled &&
                        index < potentialDirection
                            ? thisOption
                            : nextSelectableOption,
                    nextSelectableOption
                );
                break;
            }

            case 1: {
                nextSelectableOption = this.options.reduce(
                    (nextSelectableOption, thisOption, index) =>
                        !nextSelectableOption &&
                        !thisOption.disabled &&
                        index > potentialDirection
                            ? thisOption
                            : nextSelectableOption,
                    nextSelectableOption
                );
                break;
            }

            default:
            // impossible!
        }

        return this.options.indexOf(nextSelectableOption as any);
    }

    /**
     * A standard `click` event creates a `focus` event before firing, so a
     * `mousedown` event is used to skip that initial focus.
     *
     * @internal
     */
    protected shouldSkipFocus: boolean = false;

    /**
     * Typeahead timeout in milliseconds.
     *
     * @internal
     */
    protected static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;

    /**
     * @internal
     */
    protected getFilteredOptions(): ListboxOption[] {
        const pattern = this.typeaheadBuffer.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`^${pattern}`, "gi");
        return this.options.filter((o: ListboxOption) => o.text.trim().match(re));
    }

    /**
     * @internal
     */
    @observable
    protected typeaheadBuffer: string = "";
    public typeaheadBufferChanged(prev: string, next: string): void {
        if (this.$fastController.isConnected) {
            const filteredOptions = this.getFilteredOptions();
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
     * @internal
     */
    @observable
    public slottedOptions: HTMLElement[];
    public slottedOptionsChanged(prev: unknown, next: Element[]) {
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
     * A static filter to include only enabled elements
     *
     * @param n - element to filter
     * @public
     */
    public static slottedOptionFilter = (n: HTMLElement) =>
        isListboxOption(n) && !n.hidden;

    /**
     * A collection of the selected options.
     *
     * @public
     */
    @observable
    public selectedOptions: ListboxOption[] = [];
    protected selectedOptionsChanged(prev: unknown, next: ListboxOption[]): void {
        const filteredNext = next.filter(Listbox.slottedOptionFilter);
        if (this.$fastController.isConnected) {
            this.options.forEach(o => {
                Observable.getNotifier(o).unsubscribe(this);
                o.selected = filteredNext.includes(o);
                Observable.getNotifier(o).subscribe(this);
            });
        }
    }

    /**
     * Handles click events for listbox options.
     *
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        const captured = (e.target as Element | null)?.closest<ListboxOption>(
            `[role=option]`
        );

        if (!captured || captured.disabled) {
            return true;
        }

        this.selectedIndex = this.options
            .filter(Listbox.slottedOptionFilter)
            .indexOf(captured);

        return true;
    }

    /**
     * Ensures that the provided option is focused and scrolled into view.
     *
     * @param optionToFocus - The option to focus
     * @internal
     */
    protected focusAndScrollOptionIntoView(
        optionToFocus: ListboxOption | null = this.firstSelectedOption
    ): void {
        if (this.contains(document.activeElement)) {
            if (optionToFocus) {
                optionToFocus.focus();
                requestAnimationFrame(() => {
                    optionToFocus.scrollIntoView({ block: "nearest" });
                });
            }
        }
    }

    /**
     * @internal
     */
    public focusinHandler(e: FocusEvent): boolean | void {
        if (!this.shouldSkipFocus && e.target === e.currentTarget) {
            this.setSelectedOptions();
            this.focusAndScrollOptionIntoView();
        }

        this.shouldSkipFocus = false;
        return true;
    }

    public handleChange(source: any, propertyName: string) {
        switch (propertyName) {
            case "selected": {
                if (Listbox.slottedOptionFilter(source)) {
                    this.selectedIndex = this.options.indexOf(source);
                }
                this.setSelectedOptions();
                break;
            }
        }
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
     * Moves focus to the first selectable option.
     *
     * @public
     */
    public selectFirstOption(): void {
        const firstSelectableOption = this.options.find(o => !o.disabled);

        if (firstSelectableOption) {
            this.selectedIndex = this.options.indexOf(firstSelectableOption);
        }
    }

    /**
     * Moves focus to the last selectable option
     *
     * @internal
     */
    public selectLastOption(): void {
        const lastSelectableOption = this.options
            .slice()
            .reverse()
            .find(o => !o.disabled);

        if (lastSelectableOption) {
            this.selectedIndex = this.options.indexOf(lastSelectableOption);
        }
    }

    /**
     *
     *
     * @internal
     * @remarks
     * Single-selection mode only.
     */
    public selectNextOption(): void {
        if (this.selectedIndex < this.options.length - 1) {
            this.selectedIndex += 1;
        }
    }

    /**
     * Moves focus to the previous selectable option
     *
     * @internal
     */
    public selectPreviousOption(): void {
        if (!this.options.length) {
            return;
        }

        if (this.selectedIndex > 0) {
            this.selectedIndex -= this.selectedIndex > 0 ? 1 : 0;
        }
    }

    /**
     * Set the `selectedIndex` to the index of the first option with the
     * `selected` attribute present.
     *
     * @internal
     */
    protected setDefaultSelectedOption() {
        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.options.findIndex(o => o.hasAttribute("selected"));

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
            this.selectedOptions = [this.options[this.selectedIndex]];
            this.ariaActiveDescendant = this.firstSelectedOption?.id ?? "";
            this.focusAndScrollOptionIntoView();
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
     * See {@link https://w3c.github.io/aria/#aria-activedescendant} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-activedescendant`
     */
    @observable
    public ariaActiveDescendant: string = "";

    /**
     * See {@link https://w3c.github.io/aria/#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-disabled`
     */
    @observable
    public ariaDisabled: "true" | "false";

    /**
     * See {@link https://w3c.github.io/aria/#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-expanded`
     */
    @observable
    public ariaExpanded: "true" | "false" | undefined;

    /**
     * See {@link https://w3c.github.io/aria/#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-multiselectable`
     */
    @observable
    public ariaMultiselectable: "true" | "false" | undefined;
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
