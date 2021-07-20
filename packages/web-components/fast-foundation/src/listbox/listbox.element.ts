import { attr, observable } from "@microsoft/fast-element";
import {
    keyArrowDown,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyEscape,
    keyHome,
    keySpace,
    keyTab,
} from "@microsoft/fast-web-utilities";
import inRange from "lodash-es/inRange";
import type { ListboxOption } from "../listbox-option/listbox-option";
import { Listbox } from "./listbox";

/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#listbox | ARIA listbox }.
 *
 * @public
 */
export class ListboxElement extends Listbox {
    /**
     * The index of the most recently checked option.
     *
     * @internal
     * @remarks
     * Multiple-selection mode only.
     */
    @observable
    private activeIndex: number = -1;

    /**
     * @internal
     */
    protected activeIndexChanged(prev, next): void {
        this.ariaActiveDescendant = this.options[next]?.id ?? "";
        this.focusAndScrollOptionIntoView();
    }

    /**
     * @internal
     */
    private get checkedOptions(): ListboxOption[] {
        return this.options?.filter(o => o.checked);
    }

    public get firstSelectedOptionIndex(): number {
        return this.options.indexOf(this.firstSelectedOption);
    }

    private rangeStartIndex: number = -1;

    /**
     * Returns the last checked option.
     *
     * @internal
     */
    public get activeOption(): ListboxOption | null {
        return this.options[this.activeIndex];
    }

    /**
     * Indicates if the listbox is in multi-selection mode.
     *
     * @public
     * @remarks
     * HTML Attribute: `multiple`
     */
    @attr({ mode: "boolean" })
    public multiple: boolean;
    multipleChanged(prev: unknown, next: boolean): void {
        if (this.$fastController.isConnected) {
            this.options.forEach(o => {
                o.checked = next ? false : undefined;
            });

            this.ariaMultiselectable = next ? "true" : undefined;

            this.setSelectedOptions();
        }
    }

    /**
     * Toggles the checked state for the currently active option.
     *
     * @internal
     * @remarks
     * Multiple-selection mode only.
     */
    private checkActiveIndex(): void {
        const activeItem = this.options[this.activeIndex];
        if (activeItem) {
            activeItem.checked = true;
        }
    }

    /**
     *
     * @internal
     * @remarks
     * Multi-selection mode only.
     */
    protected checkFirstOption(preserveChecked: boolean = false): void {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex;
            }

            this.options.forEach((o, i) => {
                o.checked = inRange(i, 0, this.rangeStartIndex);
            });
        } else {
            this.uncheckAllOptions();
        }

        this.activeIndex = 0;
        this.checkActiveIndex();
    }

    /**
     * Decrement the active index and set the matching option as checked.
     *
     * @param preserveChecked - mark all options unchecked before changing the active index
     * @internal
     * @remarks
     * Multi-selection mode only.
     */
    protected checkLastOption(preserveChecked: boolean = false): void {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex;
            }

            this.options.forEach((o, i) => {
                o.checked = inRange(
                    i,
                    ...([this.rangeStartIndex, this.options.length].sort() as [
                        number,
                        number
                    ])
                );
            });
        } else {
            this.uncheckAllOptions();
        }

        this.activeIndex = this.options.length - 1;
        this.checkActiveIndex();
    }

    /**
     * Increments the active index.
     *
     * @internal
     * @remarks
     * Multiple-selection mode only.
     */
    protected checkNextOption(preserveChecked: boolean = false): void {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex;
            }

            if (this.checkedOptions.length === 1) {
                // this.rangeStartIndex -= 1;
            }

            this.options.forEach((o, i) => {
                o.checked = inRange(
                    i,
                    ...([this.rangeStartIndex, this.activeIndex + 1].sort() as [
                        number,
                        number
                    ])
                );
            });
        } else {
            this.uncheckAllOptions();
        }

        this.activeIndex += this.activeIndex < this.options.length - 1 ? 1 : 0;
        this.checkActiveIndex();
    }

    /**
     * Decrements the active index.
     *
     * @internal
     * @remarks
     * Multiple-selection mode only.
     */
    protected checkPreviousOption(preserveChecked: boolean = false): void {
        if (preserveChecked) {
            if (this.rangeStartIndex === -1) {
                this.rangeStartIndex = this.activeIndex;
            }

            if (this.checkedOptions.length === 1) {
                this.rangeStartIndex += 1;
            }

            this.options.forEach((o, i) => {
                o.checked = inRange(
                    i,
                    ...([this.activeIndex, this.rangeStartIndex].sort() as [
                        number,
                        number
                    ])
                );
            });
        } else {
            this.uncheckAllOptions();
        }

        this.activeIndex -= this.activeIndex > 0 ? 1 : 0;
        this.checkActiveIndex();
    }

    /**
     * Handles click events for listbox options.
     *
     * @param e - the event object
     * @internal
     * @override
     */
    public clickHandler(e: MouseEvent): boolean | void {
        if (!this.multiple) {
            return super.clickHandler(e);
        }

        const captured = (e.target as Element | null)?.closest<ListboxOption>(
            `[role=option]`
        );

        if (!captured || captured.disabled) {
            return;
        }

        this.uncheckAllOptions();
        this.activeIndex = this.options.indexOf(captured);
        this.checkActiveIndex();
        this.toggleSelectedForAllCheckedOptions();

        return true;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("focusout", this.focusoutHandler);
    }

    public disconnectedCallback(): void {
        this.removeEventListener("focusout", this.focusoutHandler);
    }

    /**
     * @internal
     */
    protected focusAndScrollOptionIntoView(): void {
        super.focusAndScrollOptionIntoView(this.activeOption);
    }

    /**
     * In multiple-selection mode:
     * If any options are selected, the first selected option is checked when
     * the listbox receives focus. If no options are selected, the first
     * selectable option is checked.
     *
     * @internal
     * @remarks
     * Overrides
     */
    public focusinHandler(e: FocusEvent): void {
        if (!this.multiple) {
            return super.focusinHandler(e);
        }

        if (!this.shouldSkipFocus && e.target === e.currentTarget) {
            this.uncheckAllOptions();
            this.activeIndex =
                this.firstSelectedOptionIndex !== -1 ? this.firstSelectedOptionIndex : 0;
            this.checkActiveIndex();
            this.setSelectedOptions();
            this.focusAndScrollOptionIntoView();
        }

        this.shouldSkipFocus = false;
    }

    /**
     * Unchecks all options when the listbox loses focus.
     *
     * @internal
     */
    public focusoutHandler(e: FocusEvent): void {
        if (this.multiple) {
            this.uncheckAllOptions();
        }
    }

    /**
     * Handles keydown actions for listbox navigation and typeahead
     *
     * @internal
     * @override
     */
    public keydownHandler(e: KeyboardEvent): boolean | void {
        if (!this.multiple) {
            return super.keydownHandler(e);
        }

        if (this.disabled) {
            return true;
        }

        const { key, shiftKey } = e;

        this.shouldSkipFocus = false;

        switch (key) {
            // Select the first available option
            case keyHome: {
                this.checkFirstOption(shiftKey);
                return;
            }

            // Select the next selectable option
            case keyArrowDown: {
                this.checkNextOption(shiftKey);
                return;
            }

            // Select the previous selectable option
            case keyArrowUp: {
                this.checkPreviousOption(shiftKey);
                return;
            }

            // Select the last available option
            case keyEnd: {
                this.checkLastOption(shiftKey);
                return;
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
                e.preventDefault();
                if (this.typeAheadExpired) {
                    this.toggleSelectedForAllCheckedOptions();
                    return;
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
     * @override
     */
    public mousedownHandler(e: MouseEvent): boolean | void {
        if (!this.multiple) {
            return super.mousedownHandler(e);
        }

        return true;
    }

    /**
     * Sets an option as selected and gives it focus.
     *
     * @public
     * @override
     */
    protected setSelectedOptions() {
        if (!this.multiple) {
            return super.setSelectedOptions();
        }

        if (this.$fastController.isConnected && this.options) {
            this.selectedOptions = this.options.filter(o => o.selected);
            this.focusAndScrollOptionIntoView();
        }
    }

    /**
     * Toggles the selected state of the provided options. If any provided items
     * are in an unselected state, all items are set to selected. If every
     * provided item is selected, they are all unselected.
     *
     * @internal
     */
    public toggleSelectedForAllCheckedOptions(): void {
        const force = !this.checkedOptions.every(o => o.selected);
        this.checkedOptions.forEach(o => (o.selected = force));
        this.selectedIndex = this.options.indexOf(
            this.checkedOptions[this.checkedOptions.length - 1]
        );
        // this.activeIndex = this.selectedIndex;
        this.setSelectedOptions();
    }

    /**
     *
     * @param prev - previous typeahead value
     * @param next - new typeahead value
     */
    public typeaheadBufferChanged(prev: string, next: string): void {
        if (!this.multiple) {
            super.typeaheadBufferChanged(prev, next);
            return;
        }

        if (this.$fastController.isConnected) {
            const filteredOptions = this.getFilteredOptions();
            if (filteredOptions.length) {
                const activeIndex = this.options.indexOf(filteredOptions[0]);
                if (activeIndex > -1) {
                    this.activeIndex = activeIndex;
                    this.uncheckAllOptions();
                    this.checkActiveIndex();
                }
            }

            this.typeAheadExpired = false;
        }
    }

    /**
     * Unchecks all options.
     *
     * @internal
     * @remarks
     * Multiple-selection mode only.
     */
    private uncheckAllOptions(): void {
        this.options.forEach(o => (o.checked = false));
        this.rangeStartIndex = -1;
    }
}
