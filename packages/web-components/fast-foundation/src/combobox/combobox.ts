import { autoUpdate, computePosition, flip, hide, size } from "@floating-ui/dom";
import {
    attr,
    Observable,
    observable,
    SyntheticViewTemplate,
    Updates,
} from "@microsoft/fast-element";
import { limit, uniqueId } from "@microsoft/fast-web-utilities";
import type { FASTListboxOption } from "../listbox-option/listbox-option.js";
import { DelegatesARIAListbox } from "../listbox/listbox.js";
import { StartEnd, StartEndOptions } from "../patterns/index.js";
import { applyMixins } from "../utilities/apply-mixins.js";
import { FormAssociatedCombobox } from "./combobox.form-associated.js";
import { ComboboxAutocomplete } from "./combobox.options.js";

/**
 * Combobox configuration options
 * @public
 */
export type ComboboxOptions = StartEndOptions & {
    indicator?: string | SyntheticViewTemplate;
};

/**
 * A Combobox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#combobox | ARIA combobox }.
 *
 * @slot start - Content which can be provided before the input
 * @slot end - Content which can be provided after the input
 * @slot control - Used to replace the input element representing the combobox
 * @slot indicator - The visual indicator representing the expanded state
 * @slot - The default slot for the options
 * @csspart control - The wrapper element containing the input area, including start and end
 * @csspart selected-value - The input element representing the selected value
 * @csspart indicator - The element wrapping the indicator slot
 * @csspart listbox - The wrapper for the listbox slotted options
 * @fires change - Fires a custom 'change' event when the value updates
 *
 * @public
 */
export class FASTCombobox extends FormAssociatedCombobox {
    /**
     * The internal value property.
     *
     * @internal
     */
    private _value: string = "";

    /**
     * The autocomplete attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: autocomplete
     */
    @attr({ attribute: "autocomplete", mode: "fromView" })
    autocomplete: ComboboxAutocomplete | undefined;

    /**
     * Reference to the internal text input element.
     *
     * @internal
     */
    public control: HTMLInputElement;

    /**
     * Reference to the internal listbox element.
     *
     * @internal
     */
    public listbox: HTMLDivElement;

    /**
     * The collection of currently filtered options.
     *
     * @public
     */
    public filteredOptions: FASTListboxOption[] = [];

    /**
     * The current filter value.
     *
     * @internal
     */
    private filter: string = "";

    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    public formResetCallback(): void {
        super.formResetCallback();
        this.setDefaultSelectedOption();

        if (!this.firstSelectedOption) {
            this.value = this.initialValue ?? "";
            return;
        }

        this.updateValue();
    }

    /** {@inheritDoc (FormAssociated:interface).validate} */
    public validate(): void {
        super.validate(this.control);
    }

    private get isAutocompleteInline(): boolean {
        return (
            this.autocomplete === ComboboxAutocomplete.inline || this.isAutocompleteBoth
        );
    }

    private get isAutocompleteList(): boolean {
        return this.autocomplete === ComboboxAutocomplete.list || this.isAutocompleteBoth;
    }

    private get isAutocompleteBoth(): boolean {
        return this.autocomplete === ComboboxAutocomplete.both;
    }

    /**
     * The unique id for the internal listbox element.
     *
     * @internal
     */
    public listboxId: string = uniqueId("listbox-");

    /**
     * The open attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: open
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean = false;

    /**
     * Sets focus and synchronize ARIA attributes when the open property changes.
     *
     * @param prev - the previous open value
     * @param next - the current open value
     *
     * @internal
     */
    protected openChanged() {
        if (this.open) {
            this.ariaControls = this.listboxId;
            this.ariaExpanded = "true";

            Updates.enqueue(() => this.setPositioning());
            this.focusAndScrollOptionIntoView();

            // focus is directed to the element when `open` is changed programmatically
            Updates.enqueue(() => this.focus());

            return;
        }

        this.ariaControls = "";
        this.ariaExpanded = "false";
    }

    /**
     * The list of options.
     *
     * @public
     * @remarks
     * Overrides `Listbox.options`.
     */
    public get options(): FASTListboxOption[] {
        Observable.track(this, "options");
        return this.filteredOptions.length ? this.filteredOptions : this._options;
    }

    public set options(value: FASTListboxOption[]) {
        this._options = value;
        Observable.notify(this, "options");
    }

    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute is not a valid substitute for a labeling element.
     */
    @attr
    public placeholder: string;

    /**
     * Updates the placeholder on the proxy element.
     * @internal
     */
    protected placeholderChanged(): void {
        if (this.proxy instanceof HTMLInputElement) {
            this.proxy.placeholder = this.placeholder;
        }
    }

    /**
     * The value property.
     *
     * @public
     */
    public get value() {
        Observable.track(this, "value");
        return this._value;
    }

    public set value(next: string) {
        const prev = `${this._value}`;

        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.options.findIndex(
                el => el.text.toLowerCase() === next.toLowerCase()
            );

            const prevSelectedValue = this.options[this.selectedIndex]?.text;
            const nextSelectedValue = this.options[selectedIndex]?.text;

            this.selectedIndex =
                prevSelectedValue !== nextSelectedValue
                    ? selectedIndex
                    : this.selectedIndex;

            next = this.firstSelectedOption?.text || next;
        }

        if (prev !== next) {
            this._value = next;
            super.valueChanged(prev, next);
            Observable.notify(this, "value");
        }
    }

    /**
     * Cleanup function for the listbox positioner.
     *
     * @public
     */
    public cleanup: () => void;

    /**
     * Handle opening and closing the listbox when the combobox is clicked.
     *
     * @param e - the mouse event
     * @internal
     */
    public clickHandler(e: MouseEvent): boolean | void {
        if (this.disabled) {
            return;
        }

        if (this.open) {
            const captured = (e.target as HTMLElement).closest(
                `option,[role=option]`
            ) as FASTListboxOption | null;

            if (!captured || captured.disabled) {
                return;
            }

            this.selectedOptions = [captured];
            this.control.value = captured.text;
            this.clearSelectionRange();
            this.updateValue(true);
        }

        this.open = !this.open;

        if (this.open) {
            this.control.focus();
        }

        return true;
    }

    public connectedCallback() {
        super.connectedCallback();
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
    public disabledChanged(prev: boolean, next: boolean): void {
        if (super.disabledChanged) {
            super.disabledChanged(prev, next);
        }
        this.ariaDisabled = this.disabled ? "true" : "false";
    }

    public disconnectedCallback(): void {
        this.cleanup?.();
        super.disconnectedCallback();
    }

    /**
     * Filter available options by text value.
     *
     * @public
     */
    public filterOptions(): void {
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
     * Focus the control and scroll the first selected option into view.
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.focusAndScrollOptionIntoView`
     */
    protected focusAndScrollOptionIntoView(): void {
        if (this.contains(document.activeElement)) {
            this.control.focus();
            if (this.firstSelectedOption) {
                requestAnimationFrame(() => {
                    this.firstSelectedOption?.scrollIntoView({ block: "nearest" });
                });
            }
        }
    }

    /**
     * Handle focus state when the element or its children lose focus.
     *
     * @param e - The focus event
     * @internal
     */
    public focusoutHandler(e: FocusEvent): boolean | void {
        this.updateValue();

        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return;
        }

        if (!this.options || !this.options.includes(focusTarget as FASTListboxOption)) {
            this.open = false;
        }
    }

    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    public inputHandler(e: InputEvent): boolean | void {
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
    public keydownHandler(e: Event & KeyboardEvent): boolean | void {
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
                this.clearSelectionRange();
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
    public keyupHandler(e: KeyboardEvent): boolean | void {
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
     * @param prev - the previous selected index value
     * @param next - the current selected index value
     *
     * @internal
     */
    public selectedIndexChanged(prev: number | undefined, next: number): void {
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
    public selectPreviousOption(): void {
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
    public setDefaultSelectedOption(): void {
        if (this.$fastController.isConnected && this.options) {
            const selectedIndex = this.options.findIndex(
                el => el.getAttribute("selected") !== null || el.selected
            );

            this.selectedIndex = selectedIndex;
            if (!this.dirtyValue && this.firstSelectedOption) {
                this.value = this.firstSelectedOption.text;
            } else {
                this.value = "";
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
    private setInlineSelection(): void {
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
     * @public
     */
    public setPositioning(): void {
        if (this.$fastController.isConnected) {
            this.cleanup = autoUpdate(this, this.listbox, async () => {
                const { middlewareData, x, y } = await computePosition(
                    this,
                    this.listbox,
                    {
                        placement: "bottom",
                        strategy: "fixed",
                        middleware: [
                            flip(),
                            size({
                                apply: ({ availableHeight, rects }) => {
                                    Object.assign(this.listbox.style, {
                                        maxHeight: `${availableHeight}px`,
                                        width: `${rects.reference.width}px`,
                                    });
                                },
                            }),
                            hide(),
                        ],
                    }
                );

                if (middlewareData.hide?.referenceHidden) {
                    this.open = false;
                    this.cleanup();
                    return;
                }

                Object.assign(this.listbox.style, {
                    position: "fixed",
                    top: "0",
                    left: "0",
                    transform: `translate(${x}px, ${y}px)`,
                });
            });
        }
    }

    /**
     * Ensure that the entire list of options is used when setting the selected property.
     *
     * @param prev - the previous list of selected options
     * @param next - the current list of selected options
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.selectedOptionsChanged`
     */
    public selectedOptionsChanged(
        prev: FASTListboxOption[] | undefined,
        next: FASTListboxOption[]
    ): void {
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
    public slottedOptionsChanged(prev: Element[] | undefined, next: Element[]): void {
        super.slottedOptionsChanged(prev, next);
        this.updateValue();
    }

    /**
     * Sets the value and to match the first selected option.
     *
     * @param shouldEmit - if true, the change event will be emitted
     *
     * @internal
     */
    private updateValue(shouldEmit?: boolean) {
        if (this.$fastController.isConnected) {
            this.value = this.firstSelectedOption?.text || this.control.value;
        }

        if (shouldEmit) {
            this.$emit("change");
        }
    }

    /**
     * @internal
     */
    private clearSelectionRange() {
        const controlValueLength = this.control.value.length;
        this.control.setSelectionRange(controlValueLength, controlValueLength);
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA combobox role.
 *
 * @public
 */
export class DelegatesARIACombobox {
    /**
     * See {@link https://www.w3.org/TR/wai-aria-1.2/#aria-autocomplete} for more information.
     *
     * @public
     * @remarks
     * HTML Attribute: `aria-autocomplete`
     */
    @observable
    public ariaAutoComplete: "inline" | "list" | "both" | "none" | string | null;

    /**
     * See {@link https://www.w3.org/TR/wai-aria-1.2/#aria-controls} for more information.
     *
     * @public
     * @remarks
     * HTML Attribute: `aria-controls`
     */
    @observable
    public ariaControls: string | null;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIACombobox extends DelegatesARIAListbox {}
applyMixins(DelegatesARIACombobox, DelegatesARIAListbox);

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface FASTCombobox extends StartEnd, DelegatesARIACombobox {}
applyMixins(FASTCombobox, StartEnd, DelegatesARIACombobox);
