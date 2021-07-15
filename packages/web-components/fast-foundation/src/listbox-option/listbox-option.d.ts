import { StartEnd } from "../patterns/start-end";
import { FoundationElement } from "../foundation-element";
/**
 * Determines if the element is a {@link (ListboxOption:class)}
 *
 * @param element - the element to test.
 * @public
 */
export declare function isListboxOption(el: Element): el is ListboxOption;
/**
 * An Option Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#option | ARIA option }.
 *
 * @public
 */
export declare class ListboxOption extends FoundationElement {
    /**
     * @internal
     */
    private _value;
    /**
     * @internal
     */
    proxy: HTMLOptionElement;
    /**
     * The defaultSelected state of the option.
     * @public
     */
    defaultSelected: boolean;
    protected defaultSelectedChanged(): void;
    /**
     * Tracks whether the "selected" property has been changed.
     * @internal
     */
    private dirtySelected;
    /**
     * The disabled state of the option.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    protected disabledChanged(prev: any, next: any): void;
    /**
     * The selected attribute value. This sets the initial selected value.
     *
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    selectedAttribute: boolean;
    protected selectedAttributeChanged(): void;
    /**
     * The checked state of the control.
     *
     * @public
     */
    selected: boolean;
    protected selectedChanged(): void;
    /**
     * Track whether the value has been changed from the initial value
     */
    dirtyValue: boolean;
    /**
     * The initial value of the option. This value sets the `value` property
     * only when the `value` property has not been explicitly set.
     *
     * @remarks
     * HTML Attribute: value
     */
    protected initialValue: string;
    initialValueChanged(previous: string, next: string): void;
    get label(): string;
    get text(): string;
    set value(next: string);
    get value(): string;
    get form(): HTMLFormElement | null;
    constructor(
        text?: string,
        value?: string,
        defaultSelected?: boolean,
        selected?: boolean
    );
}
/**
 * @internal
 */
export interface ListboxOption extends StartEnd {}
