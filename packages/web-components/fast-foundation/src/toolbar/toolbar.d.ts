import { Direction, Orientation } from "@microsoft/fast-web-utilities";
import { FoundationElement } from "../foundation-element";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global";
import { StartEnd } from "../patterns/start-end";
/**
 * A Toolbar Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#Toolbar|ARIA Toolbar}.
 *
 * @public
 */
export declare class Toolbar extends FoundationElement {
    /**
     * The internal index of the currently focused element.
     *
     * @internal
     */
    private _activeIndex;
    /**
     * The index of the currently focused element, clamped between 0 and the last element.
     *
     * @internal
     */
    get activeIndex(): number;
    set activeIndex(value: number);
    /**
     * The text direction of the toolbar.
     *
     * @internal
     */
    direction: Direction;
    /**
     * The collection of focusable toolbar controls.
     *
     * @internal
     */
    private focusableElements;
    /**
     * The orientation of the toolbar.
     *
     * @public
     * @remarks
     * HTML Attribute: `orientation`
     */
    orientation: Orientation;
    /**
     * The elements in the default slot.
     *
     * @internal
     */
    slottedItems: HTMLElement[];
    /**
     * Prepare the slotted elements which can be focusable.
     *
     * @param prev - The previous list of slotted elements.
     * @param next - The new list of slotted elements.
     * @internal
     */
    protected slottedItemsChanged(prev: unknown, next: HTMLElement[]): void;
    /**
     * The elements in the label slot.
     *
     * @internal
     */
    slottedLabel: HTMLElement[];
    /**
     * Set the activeIndex when a focusable element in the toolbar is clicked.
     *
     * @internal
     */
    clickHandler(e: MouseEvent): boolean | void;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * When the toolbar receives focus, set the currently active element as focused.
     *
     * @internal
     */
    focusinHandler(e: FocusEvent): boolean | void;
    /**
     * Determines a value that can be used to iterate a list with the arrow keys.
     *
     * @param this - An element with an orientation and direction
     * @param key - The event key value
     * @internal
     */
    private getDirectionalIncrementer;
    /**
     * Handle keyboard events for the toolbar.
     *
     * @internal
     */
    keydownHandler(e: KeyboardEvent): boolean | void;
    /**
     * Set the activeIndex and focus the corresponding control.
     *
     * @param activeIndex - The new index to set
     * @internal
     */
    private setFocusedElement;
    /**
     * Reduce a collection to only its focusable elements.
     *
     * @param elements - Collection of elements to reduce
     * @param element - The current element
     *
     * @internal
     */
    private static reduceFocusableItems;
    /**
     * @internal
     */
    private setFocusableElements;
}
/**
 * Includes ARIA states and properties relating to the ARIA toolbar role
 *
 * @public
 */
export declare class DelegatesARIAToolbar {
    /**
     * The id of the element labeling the toolbar.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    ariaLabelledby: string;
    /**
     * The label surfaced to assistive technologies.
     *
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    ariaLabel: string;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIAToolbar extends ARIAGlobalStatesAndProperties {}
/**
 * @internal
 */
export interface Toolbar extends StartEnd, DelegatesARIAToolbar {}
