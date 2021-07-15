import { FoundationElement } from "../foundation-element";
/**
 * A Menu Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @public
 */
export declare class Menu extends FoundationElement {
    /**
     * @internal
     */
    items: HTMLSlotElement;
    private itemsChanged;
    private menuItems;
    private expandedItem;
    /**
     * The index of the focusable element in the items array
     * defaults to -1
     */
    private focusIndex;
    private static focusableElementRoles;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * @internal
     */
    readonly isNestedMenu: () => boolean;
    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    focus(): void;
    /**
     * Collapses any expanded menu items.
     *
     * @public
     */
    collapseExpandedItem(): void;
    /**
     * @internal
     */
    handleMenuKeyDown(e: KeyboardEvent): void | boolean;
    /**
     * if focus is moving out of the menu, reset to a stable initial state
     * @internal
     */
    handleFocusOut: (e: FocusEvent) => void;
    private handleItemFocus;
    private handleExpandedChanged;
    private setItems;
    private resetItems;
    /**
     * handle change from child element
     */
    private changeHandler;
    /**
     * get an array of valid DOM children
     */
    private domChildren;
    /**
     * check if the item is a menu item
     */
    private isMenuItemElement;
    /**
     * check if the item is focusable
     */
    private isFocusableElement;
    private setFocus;
}
