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
     * The internal list of options. Used to swap between a filtered and full option list.
     * @internal
     */
    private _options: ListboxOption[] = [];

    /**
     * The internal value property.
     * @internal
     */
    private _value: string;

    /**
     * The open attribute.
     * @public
     */
    @attr({ attribute: "open", mode: "boolean" })
    public open: boolean = false;
    protected openChanged() {
        this.ariaExpanded = this.open ? "true" : "false";
        if (this.open) {
            this.setPositioning();
            this.focusAndScrollOptionIntoView();
            this.indexWhenOpened = this.selectedIndex;
        }
    }

    /**
     * The autocomplete attribute.
     * @public
     */
    @attr({ attribute: "autocomplete", mode: "fromView" })
    autocomplete: "inline" | "list" | "both" | "none" | undefined;

    /**
     * The value displayed on the button.
     * @public
     */
    @observable
    public displayValue: string = "";

    /**
     * The
     * @public
     */
    @observable
    public filteredOptions: ListboxOption[] = [];

    public set options(value: ListboxOption[]) {
        this._options = value;
    }

    public get options(): ListboxOption[] {
        if (this.isAutocompleteList && this.filteredOptions.length) {
            return this.filteredOptions;
        }

        return this._options;
    }

    /**
     * Indicates the initial state of the position attribute.
     *
     * @internal
     */
    private forcedPosition: boolean = false;

    /**
     * @internal
     */
    private indexWhenOpened: number;

    /**
     * @internal
     */
    private get isAutocompleteList(): boolean {
        return this.autocomplete === "list" || this.isAutocompleteBoth;
    }

    /**
     * @internal
     */
    private get isAutocompleteInline(): boolean {
        return this.autocomplete === "inline";
    }

    /**
     * @internal
     */
    private get isAutocompleteBoth(): boolean {
        return this.autocomplete === "both";
    }

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
     * Reflects the placement for the listbox when the combobox is open.
     *
     * @public
     */
    @attr({ attribute: "position" })
    public positionAttribute: SelectPosition;

    /**
     * Holds the current state for the calculated position of the listbox.
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
     * Reference to the internal text input element.
     *
     * @internal
     */
    public control: HTMLInputElement;

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
            const selectedIndex = this._options.findIndex(
                el => el.value.toLowerCase() === next.toLowerCase()
            );

            const prevSelectedOption = this.options[this.selectedIndex];
            const nextSelectedOption = this.options[selectedIndex];

            const prevSelectedValue = prevSelectedOption
                ? prevSelectedOption.value
                : null;

            const nextSelectedValue = nextSelectedOption
                ? nextSelectedOption.value
                : null;

            if (prevSelectedValue !== nextSelectedValue) {
                next = "";
                this.selectedIndex = selectedIndex;
            }

            if (this.firstSelectedOption) {
                next = this.firstSelectedOption.value;
            }
        }

        if (prev !== next) {
            this._value = next;
            this.displayValue = this.firstSelectedOption
                ? this.firstSelectedOption.textContent || this.firstSelectedOption.value
                : next;
            super.valueChanged(prev, next);
            Observable.notify(this, "value");
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        this.forcedPosition = !!this.positionAttribute;
    }

    /**
     * Handle opening and closing the listbox when the select is clicked.
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
            this.displayValue = captured.text;
        }

        this.open = !this.open;

        if (!this.open) {
            this.updateValue(true);
        }

        return true;
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
     * Bypass the built-in listbox typeahead functionality
     * @internal
     */
    public handleTypeAhead = () => void 0;

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

        this.updateValue();
    }

    public inputHandler(e: InputEvent): boolean | void {
        if (this.isAutocompleteInline || this.isAutocompleteList) {
            this.typeaheadBuffer = this.control.value;
            return true;
        }

        this.value = this.control.value;
    }

    /**
     * Handles keydown actions for listbox navigation and typeahead
     *
     * @param e - the keyboard event
     * @internal
     */
    public keydownHandler(e: KeyboardEvent): boolean | void {
        const key = e.key || e.key.charCodeAt(0);

        switch (key) {
            case "Enter": {
                e.preventDefault();

                if (this.open) {
                    if (this.firstSelectedOption) {
                        this.updateValue(true);
                    }
                }

                this.open = !this.open;
                break;
            }

            case "Escape": {
                if (this.open) {
                    e.preventDefault();
                }

                this.typeaheadBuffer = this.control.value;
                this.open = false;
                break;
            }

            case "Tab": {
                if (!this.open) {
                    return true;
                }

                e.preventDefault();
                this.open = false;
                return true;
            }

            case "Home":
            case "End": {
                return true;
            }

            case "ArrowUp":
            case "ArrowDown": {
                if (this.typeaheadBuffer) {
                    e.preventDefault();
                    if (this.isAutocompleteInline && this.typeaheadBuffer) {
                        const increment = key === "ArrowUp" ? -1 : 1;
                        this.getNextInlineOption(increment);
                        return true;
                    }

                    if (this.isAutocompleteBoth) {
                        super.keydownHandler(e);
                        this.setInlineSelection(
                            (this.typeaheadBuffer && this.typeaheadBuffer.length) || 0
                        );
                        return true;
                    }
                }
                break;
            }
        }

        super.keydownHandler(e);

        return true;
    }

    getNextInlineOption(increment: number) {
        const filteredIndex = this.filteredOptions.indexOf(this.firstSelectedOption);
        const nextFilteredOption = this.filteredOptions[filteredIndex + increment];

        if (nextFilteredOption) {
            this.selectedIndex = this._options.findIndex(o =>
                o.isSameNode(nextFilteredOption)
            );

            this.setInlineSelection(this.typeaheadBuffer.length || 0);
        }
    }

    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    public formResetCallback = (): void => {
        this.setDefaultSelectedOption();
        this.updateValue();
    };

    /**
     * @internal
     */
    public setDefaultSelectedOption(): void {
        if (this.options && this.$fastController.isConnected) {
            const selectedIndex = this.options.findIndex(
                el => el.getAttribute("selected") !== null
            );

            this.selectedIndex = selectedIndex;
            this.setSelectedOptions();
        }
    }

    /**
     * Focuses and selects the content of the control based on the first selected option.
     * @param start - The index for the starting range
     * @internal
     */
    private setInlineSelection(start: number): void {
        if (this.firstSelectedOption) {
            this.control.value = this.firstSelectedOption.text;
            this.control.focus();
            this.control.setSelectionRange(
                start,
                this.firstSelectedOption.text.length,
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
    public typeaheadBufferChanged(prev: string = "", next: string) {
        const matchNext = next.toLowerCase();
        this.filteredOptions = this._options.filter((o: ListboxOption) => {
            return o.text.toLowerCase().startsWith(matchNext);
        });

        if (!this.filteredOptions.length) {
            this.options = this._options;
        }

        const selectedIndex = this.isAutocompleteInline
            ? this.options.findIndex(o => o.isSameNode(this.filteredOptions[0]))
            : this.isAutocompleteList &&
              this.filteredOptions.length !== this._options.length
            ? 0
            : -1;

        if (this.isAutocompleteList) {
            this._options.forEach(o => {
                o.hidden = !this.filteredOptions.includes(o);
            });
        }

        if (selectedIndex !== this.selectedIndex) {
            this.selectedIndex = selectedIndex;
        } else {
            this.setSelectedOptions();
        }

        if (
            next.length > prev.length &&
            (this.isAutocompleteInline || this.isAutocompleteBoth)
        ) {
            this.setInlineSelection(this.typeaheadBuffer.length);
        }
    }

    /**
     * @internal
     */
    private updateValue(shouldEmit?: boolean) {
        if (this.$fastController.isConnected) {
            if (this.firstSelectedOption) {
                this.value = this.firstSelectedOption.value;
            } else {
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
export class DelegatesARIACombobox extends ARIAGlobalStatesAndProperties {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @observable
    public ariaExpanded: "true" | "false" | undefined;

    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#button} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-pressed
     */
    @attr({ attribute: "aria-pressed", mode: "fromView" })
    public ariaPressed: "true" | "false" | "mixed" | undefined;

    /**
     * See {@link https://w3c.github.io/aria/#aria-autocomplete} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-autocomplete
     */
    @attr({ attribute: "aria-autocomplete", mode: "fromView" })
    public ariaAutocomplete: "inline" | "list" | "both" | "none" | undefined;
}

applyMixins(DelegatesARIACombobox, ARIAGlobalStatesAndProperties);

/**
 * @internal
 */
export interface Combobox extends StartEnd, DelegatesARIACombobox {}
applyMixins(Combobox, StartEnd, DelegatesARIACombobox);
