import { FoundationElement } from "../foundation-element";
import { ListboxOption } from "../listbox-option/listbox-option";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
/**
 * A Listbox Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#listbox | ARIA listbox }.
 *
 * @public
 */
export declare class Listbox extends FoundationElement {
    /**
     * The index of the selected option
     *
     * @public
     */
    selectedIndex: number;
    selectedIndexChanged(prev: number, next: number): void;
    /**
     * Typeahead timeout in milliseconds.
     *
     * @internal
     */
    protected static readonly TYPE_AHEAD_TIMEOUT_MS = 1000;
    /**
     * @internal
     */
    protected typeaheadBuffer: string;
    typeaheadBufferChanged(prev: string, next: string): void;
    /**
     * @internal
     */
    protected typeaheadTimeout: number;
    /**
     * Flag for the typeahead timeout expiration.
     *
     * @internal
     */
    protected typeAheadExpired: boolean;
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    role: string;
    /**
     * The disabled state of the listbox.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    /**
     * @internal
     */
    slottedOptions: HTMLElement[];
    slottedOptionsChanged(prev: any, next: any): void;
    /**
     * The internal unfiltered list of selectable options.
     *
     * @internal
     */
    protected _options: ListboxOption[];
    /**
     * The list of options.
     *
     * @public
     */
    get options(): ListboxOption[];
    set options(value: ListboxOption[]);
    /**
     * A collection of the selected options.
     *
     * @public
     */
    selectedOptions: ListboxOption[];
    protected selectedOptionsChanged(prev: any, next: any): void;
    /**
     * @internal
     */
    get firstSelectedOption(): ListboxOption;
    /**
     * @internal
     */
    protected focusAndScrollOptionIntoView(): void;
    /**
     * A standard `click` event creates a `focus` event before firing, so a
     * `mousedown` event is used to skip that initial focus.
     *
     * @internal
     */
    private shouldSkipFocus;
    /**
     * @internal
     */
    focusinHandler(e: FocusEvent): void;
    /**
     * Prevents `focusin` events from firing before `click` events when the
     * element is unfocused.
     *
     * @internal
     */
    mousedownHandler(e: MouseEvent): boolean | void;
    /**
     * @internal
     */
    protected setDefaultSelectedOption(): void;
    /**
     * Sets an option as selected and gives it focus.
     *
     * @param index - option index to select
     * @public
     */
    protected setSelectedOptions(): void;
    /**
     * A static filter to include only enabled elements
     *
     * @param n - element to filter
     * @public
     */
    static slottedOptionFilter: (n: HTMLElement) => boolean;
    /**
     * Moves focus to the first selectable option
     *
     * @public
     */
    selectFirstOption(): void;
    /**
     * Moves focus to the last selectable option
     *
     * @internal
     */
    selectLastOption(): void;
    /**
     * Moves focus to the next selectable option
     *
     * @internal
     */
    selectNextOption(): void;
    get length(): number;
    /**
     * Moves focus to the previous selectable option
     *
     * @internal
     */
    selectPreviousOption(): void;
    /**
     * Handles click events for listbox options
     *
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    /**
     * Handles keydown actions for listbox navigation and typeahead
     *
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Move focus to an option whose label matches characters typed by the user.
     * Consecutive keystrokes are batched into a buffer of search text used
     * to match against the set of options.  If TYPE_AHEAD_TIMEOUT_MS passes
     * between consecutive keystrokes, the search restarts.
     *
     * @param key - the key to be evaluated
     */
    handleTypeAhead: (key: string) => void;
}
/**
 * Includes ARIA states and properties relating to the ARIA listbox role
 *
 * @public
 */
export declare class DelegatesARIAListbox {
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-activedescendant
     */
    ariaActiveDescendant: string;
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-disabled
     */
    ariaDisabled: "true" | "false";
    /**
     * See {@link https://www.w3.org/WAI/PF/aria/roles#listbox} for more information
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    ariaExpanded: "true" | "false" | undefined;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIAListbox extends ARIAGlobalStatesAndProperties {}
/**
 * @internal
 */
export interface Listbox extends DelegatesARIAListbox {}
