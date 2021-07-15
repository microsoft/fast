import { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { ListboxOption } from "../listbox-option/listbox-option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
import { SelectPosition, SelectRole } from "../select/select.options";
import type { FoundationElementDefinition } from "../foundation-element";
import { FormAssociatedCombobox } from "./combobox.form-associated";
import { ComboboxAutocomplete } from "./combobox.options";
/**
 * Combobox configuration options
 * @public
 */
export declare type ComboboxOptions = FoundationElementDefinition & {
    indicator?: string | SyntheticViewTemplate;
};
/**
 * A Combobox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#combobox | ARIA combobox }.
 *
 * @public
 */
export declare class Combobox extends FormAssociatedCombobox {
    /**
     * The internal value property.
     *
     * @internal
     */
    private _value;
    /**
     * The autocomplete attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: autocomplete
     */
    autocomplete: ComboboxAutocomplete | undefined;
    /**
     * Reference to the internal text input element.
     *
     * @internal
     */
    control: HTMLInputElement;
    /**
     * The collection of currently filtered options.
     *
     * @public
     */
    filteredOptions: ListboxOption[];
    /**
     * The current filter value.
     *
     * @internal
     */
    private filter;
    /**
     * The initial state of the position attribute.
     *
     * @internal
     */
    private forcedPosition;
    /**
     * Reset the element to its first selectable option when its parent form is reset.
     *
     * @internal
     */
    formResetCallback: () => void;
    private get isAutocompleteInline();
    private get isAutocompleteList();
    private get isAutocompleteBoth();
    /**
     * The unique id of the internal listbox.
     *
     * @internal
     */
    listboxId: string;
    /**
     * The max height for the listbox when opened.
     *
     * @internal
     */
    maxHeight: number;
    /**
     * The open attribute.
     *
     * @public
     * @remarks
     * HTML Attribute: open
     */
    open: boolean;
    protected openChanged(): void;
    /**
     * The list of options.
     *
     * @public
     * @remarks
     * Overrides `Listbox.options`.
     */
    get options(): ListboxOption[];
    set options(value: ListboxOption[]);
    /**
     * Sets the placeholder value of the element, generally used to provide a hint to the user.
     * @public
     * @remarks
     * HTML Attribute: placeholder
     * Using this attribute is not a valid substitute for a labeling element.
     */
    placeholder: string;
    /**
     * Updates the placeholder on the proxy element.
     * @internal
     */
    protected placeholderChanged(): void;
    /**
     * The placement for the listbox when the combobox is open.
     *
     * @public
     */
    positionAttribute: SelectPosition;
    /**
     * The current state of the calculated position of the listbox.
     *
     * @public
     */
    position: SelectPosition;
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    role: SelectRole;
    /**
     * The value property.
     *
     * @public
     */
    get value(): string;
    set value(next: string);
    /**
     * Handle opening and closing the listbox when the combobox is clicked.
     *
     * @param e - the mouse event
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    connectedCallback(): void;
    /**
     * Synchronize the `aria-disabled` property when the `disabled` property changes.
     *
     * @param prev - The previous disabled value
     * @param next - The next disabled value
     *
     * @internal
     */
    disabledChanged(prev: boolean, next: boolean): void;
    /**
     * Filter available options by text value.
     *
     * @public
     */
    filterOptions(): void;
    /**
     * Handle focus state when the element or its children lose focus.
     *
     * @param e - The focus event
     * @internal
     */
    focusoutHandler(e: FocusEvent): boolean | void;
    /**
     * Handle content changes on the control input.
     *
     * @param e - the input event
     * @internal
     */
    inputHandler(e: InputEvent): boolean | void;
    /**
     * Handle keydown actions for listbox navigation.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e: Event & KeyboardEvent): boolean | void;
    /**
     * Handle keyup actions for value input and text field manipulations.
     *
     * @param e - the keyboard event
     * @internal
     */
    keyupHandler(e: KeyboardEvent): boolean | void;
    /**
     * Ensure that the selectedIndex is within the current allowable filtered range.
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.selectedIndexChanged`
     */
    selectedIndexChanged(prev: number, next: number): void;
    /**
     * Move focus to the previous selectable option.
     *
     * @internal
     * @remarks
     * Overrides `Listbox.selectPreviousOption`
     */
    selectPreviousOption(): void;
    /**
     * Set the default selected options at initialization or reset.
     *
     * @internal
     * @remarks
     * Overrides `Listbox.setDefaultSelectedOption`
     */
    setDefaultSelectedOption(): void;
    /**
     * Focus and select the content of the control based on the first selected option.
     *
     * @param start - The index for the starting range
     * @internal
     */
    private setInlineSelection;
    /**
     * Calculate and apply listbox positioning based on available viewport space.
     *
     * @param force - direction to force the listbox to display
     * @public
     */
    setPositioning(): void;
    /**
     * Ensure that the entire list of options is used when setting the selected property.
     *
     * @internal
     * @remarks
     * Overrides: `Listbox.selectedOptionsChanged`
     */
    selectedOptionsChanged(prev: any, next: any): void;
    /**
     * Synchronize the form-associated proxy and update the value property of the element.
     *
     * @param prev - the previous collection of slotted option elements
     * @param next - the next collection of slotted option elements
     *
     * @internal
     */
    slottedOptionsChanged(prev: any, next: any): void;
    /**
     * @internal
     */
    private updateValue;
}
/**
 * Includes ARIA states and properties relating to the ARIA combobox role.
 *
 * @public
 */
export declare class DelegatesARIACombobox {
    /**
     * See {@link https://w3c.github.io/aria/#aria-autocomplete} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-autocomplete
     */
    ariaAutocomplete: "inline" | "list" | "both" | "none" | undefined;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIACombobox extends ARIAGlobalStatesAndProperties {}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface Combobox extends StartEnd, DelegatesARIACombobox {}
