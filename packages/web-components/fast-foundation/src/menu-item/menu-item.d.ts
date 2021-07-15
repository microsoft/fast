import { SyntheticViewTemplate } from "@microsoft/fast-element";
import { Direction } from "@microsoft/fast-web-utilities";
import type { AnchoredRegion } from "../anchored-region";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import { StartEnd } from "../patterns/start-end";
import { MenuItemRole } from "./menu-item.options";
export { MenuItemRole };
/**
 * Types of menu item column count.
 * @public
 */
export declare type MenuItemColumnCount = 0 | 1 | 2;
/**
 * Menu Item configuration options
 * @public
 */
export declare type MenuItemOptions = FoundationElementDefinition & {
    checkboxIndicator?: string | SyntheticViewTemplate;
    expandCollapseGlyph?: string | SyntheticViewTemplate;
    radioIndicator?: string | SyntheticViewTemplate;
};
/**
 * A Switch Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#menuitem | ARIA menuitem }, {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox | ARIA menuitemcheckbox}, or {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemradio | ARIA menuitemradio }.
 *
 * @public
 */
export declare class MenuItem extends FoundationElement {
    /**
     * The disabled state of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    /**
     * The expanded state of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: expanded
     */
    expanded: boolean;
    private expandedChanged;
    /**
     * @internal
     */
    startColumnCount: MenuItemColumnCount;
    /**
     * The role of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: role
     */
    role: MenuItemRole;
    /**
     * The checked value of the element.
     *
     * @public
     * @remarks
     * HTML Attribute: checked
     */
    checked: boolean;
    private checkedChanged;
    /**
     * reference to the anchored region
     *
     * @internal
     */
    submenuRegion: AnchoredRegion;
    /**
     * @internal
     */
    hasSubmenu: boolean;
    /**
     * Track current direction to pass to the anchored region
     *
     * @internal
     */
    currentDirection: Direction;
    /**
     * @internal
     */
    submenu: Element | undefined;
    private focusSubmenuOnLoad;
    private observer;
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
    handleMenuItemKeyDown: (e: KeyboardEvent) => boolean;
    /**
     * @internal
     */
    handleMenuItemClick: (e: MouseEvent) => boolean;
    /**
     * @internal
     */
    submenuLoaded: () => void;
    /**
     * @internal
     */
    handleMouseOver: (e: MouseEvent) => boolean;
    /**
     * @internal
     */
    handleMouseOut: (e: MouseEvent) => boolean;
    /**
     * @internal
     */
    private expandAndFocus;
    /**
     * @internal
     */
    private invoke;
    /**
     * Gets the submenu element if any
     *
     * @internal
     */
    private updateSubmenu;
    /**
     * get an array of valid DOM children
     */
    private domChildren;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface MenuItem extends StartEnd {}
