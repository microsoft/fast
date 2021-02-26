import { attr, Observable, observable } from "@microsoft/fast-element";
import uniqueId from "lodash-es/uniqueId";
import { ListboxOption } from "../listbox-option/listbox-option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { SelectPosition, SelectRole } from "../select/select.options";
import { FormAssociatedCombobox } from "./combobox.form-associated";

/**
 * A Combobox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#combobox | ARIA combobox }.
 *
 * @public
 */
export class Combobox extends FormAssociatedCombobox {
    /**
     * The internal unfiltered list of selectable options.
     *
     * @internal
     */
    private _options: ListboxOption[] = [];

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
    autocomplete: "inline" | "list" | "both" | "none" | undefined;

    /**
     * Reference to the internal text input element.
     *
     * @internal
     */
    public control: HTMLInputElement;

    /**
     * The collection of currently filtered options.
     *
     * @public
     */
    @observable
    public filteredOptions: ListboxOption[] = [];

    /**
     * The current filter value.
     *
     * @internal
     */
    private filter: string = "";

    /**
     * The initial state of the position attribute.
     *
     * @internal
     */
    private forcedPosition: boolean = false;

    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    public formResetCallback = (): void => {
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
    public listboxId: string = uniqueId("listbox-");

    /**
     * The max height for the listbox when opened.
     *
     * @internal
     */
    @observable
    public maxHeight: number = 0;

    /**
     * The open attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: open
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean = false;
    protected openChanged() {
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
    public get options(): ListboxOption[] {
        return this.filteredOptions.length ? this.filteredOptions : this._options;
    }

    public set options(value: ListboxOption[]) {
        this._options = value;
    }

    /**
     * The placement for the listbox when the combobox is open.
     *
     * @public
     */
    @attr({ attribute: "position" })
    public positionAttribute: SelectPosition;

    /**
     * The current state of the calculated position of the listbox.
     *
     * @public
     */
    @observable
    public position: SelectPosition = SelectPosition.below;

    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    public role: SelectRole = SelectRole.combobox;

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

            const prevSelectedOption = this.options[this.selectedIndex];
            const prevSelectedValue = prevSelectedOption ? prevSelectedOption.text : null;

            const nextSelectedOption = this.options[selectedIndex];
            const nextSelectedValue = nextSelectedOption ? nextSelectedOption.text : null;

            if (prevSelectedValue !== nextSelectedValue) {
                this.selectedIndex = selectedIndex;
            }

            if (this.firstSelectedOption) {
                next = this.firstSelectedOption.text;
            }
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
    public clickHandler(e: MouseEvent): boolean | void {
        if (this.disabled) {
            return;
        }

        if (this.open) {
            const captured = (e.target as HTMLElement).closest(
                `option,[role=option]`
            ) as ListboxOption | null;

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

    public connectedCallback() {
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
    public disabledChanged(prev: boolean, next: boolean): void {
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
    public filterOptions() {
        if (!this.autocomplete || this.autocomplete === "none") {
            this.filter = "";
        }

        const filter = this.filter.toLowerCase();

        let filteredOptions: ListboxOption[] = [];

        if (filter.length) {
            filteredOptions = this._options.filter(o => {
                return o.text.toLowerCase().startsWith(filter);
            });
        }

        this.filteredOptions = filteredOptions;

        if (this.autocomplete === "list" || this.autocomplete === "both") {
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
    public focusoutHandler(e: FocusEvent): boolean | void {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (this.isSameNode(focusTarget)) {
            this.focus();
            return;
        }

        if (!this.options || !this.options.includes(focusTarget as ListboxOption)) {
            this.open = false;
        }

        this.value = this.control.value;
    }

    /**
     * Handle keydown actions for listbox navigation.
     *
     * @param e - the keyboard event
     * @internal
     */
    public keydownHandler(e: Event & KeyboardEvent): boolean | void {
        const key = e.key || e.key.charCodeAt(0);

        if (e.ctrlKey || e.shiftKey) {
            return true;
        }

        switch (key) {
            case "Enter": {
                this.updateValue(true);
                this.open = false;
                this.control.setSelectionRange(
                    this.control.value.length,
                    this.control.value.length
                );
                break;
            }

            case "Escape": {
                if (this.open) {
                    this.open = false;
                    this.filter = this.control.value;
                    this.filterOptions();
                } else {
                    this.value = "";
                    this.control.value = "";
                }
                break;
            }

            case "Tab": {
                if (!this.open) {
                    return true;
                }

                e.preventDefault();
                this.open = false;
                break;
            }

            case "ArrowUp":
            case "ArrowDown": {
                if (!this.open) {
                    this.open = true;
                    return true;
                }

                this.filterOptions();

                if (this.options.length > 0) {
                    super.keydownHandler(e);
                }

                if (this.autocomplete === "inline" || this.autocomplete === "both") {
                    this.setInlineSelection();
                    this.updateValue();
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

        if (key.length === 1) {
            this.filter += e.key;
        }

        switch (key) {
            case "Backspace": {
                this.filter = this.control.value;
                this.filterOptions();
                this.selectedIndex = -1;
                this.setSelectedOptions();
                break;
            }

            case "ArrowLeft":
            case "ArrowRight":
            case "Home":
            case "End": {
                if (this.autocomplete === "both") {
                    this.filter = this.control.value;
                    this.filterOptions();
                } else {
                    this.selectedIndex = -1;
                    this.setSelectedOptions();
                }
                break;
            }

            default: {
                if (key.length === 1 && key.match(/\S/)) {
                    this.filterOptions();
                    if (this.autocomplete === "list" || this.autocomplete === "both") {
                        if (!this.open && this.control.value.length) {
                            this.open = true;
                        }
                    }

                    if (this.autocomplete === "inline" || this.autocomplete === "both") {
                        if (this.filteredOptions.length && this.filter) {
                            this.selectedIndex = this._options.indexOf(
                                this.filteredOptions[0]
                            );
                            this.setInlineSelection();
                        }
                    }
                }
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
    public selectedIndexChanged(prev: number, next: number): void {
        if (this.$fastController.isConnected) {
            if (next > this.options.length - 1) {
                next = this.options.length - 1;
            }

            if (next < -1) {
                next = -1;
            }

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
     * @param force - direction to force the listbox to display
     * @public
     */
    public setPositioning(): void {
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
     * Synchronize the form-associated proxy and update the value property of the element.
     *
     * @param prev - the previous collection of slotted option elements
     * @param next - the next collection of slotted option elements
     *
     * @internal
     */
    public slottedOptionsChanged(prev, next): void {
        super.slottedOptionsChanged(prev, next);
        this.updateValue();
    }

    /**
     * @internal
     */
    private updateValue(shouldEmit?: boolean) {
        if (this.$fastController.isConnected) {
            if (this.firstSelectedOption) {
                this.value = this.firstSelectedOption.text;
            } else if (this.dirtyValue) {
                this.value = this.control.value;
            }
        }

        if (shouldEmit) {
            this.$emit("change");
        }
    }
}

/**
 * Includes ARIA states and properties relating to the ARIA combobox role.
 *
 * @public
 */
export class DelegatesARIACombobox {
    /**
     * See {@link https://w3c.github.io/aria/#aria-autocomplete} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-autocomplete
     */
    @attr({ attribute: "aria-autocomplete", mode: "fromView" })
    public ariaAutocomplete: "inline" | "list" | "both" | "none" | undefined;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIACombobox extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIACombobox, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface Combobox extends StartEnd, DelegatesARIACombobox {}
applyMixins(Combobox, StartEnd, DelegatesARIACombobox);
