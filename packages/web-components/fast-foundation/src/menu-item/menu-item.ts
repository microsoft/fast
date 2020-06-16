import { attr, booleanConverter, FASTElement } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * Menu items roles.
 * @public
 */
export enum MenuItemRole {
    menuitem = "menuitem",
    menuitemcheckbox = "menuitemcheckbox",
    menuitemradio = "menuitemradio",
}

/**
 * A Switch Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#menuitem | ARIA menuitem }, {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox | ARIA menuitemcheckbox}, or {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemradio | ARIA menuitemradio }.
 *
 * @public
 */
export class MenuItem extends FASTElement {
    /**
     * The disabled state of the element.
     * 
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     * The expanded state of the element.
     * 
     * @public
     * @remarks
     * HTML Attribute: aria-expanded
     */
    @attr({ attribute: "aria-expanded", mode: "reflect", converter: booleanConverter })
    public expanded: boolean = false;

    /**
     * The role of the element.
     * 
     * @public
     * @remarks
     * HTML Attribute: role
     */
    @attr
    public role: MenuItemRole = MenuItemRole.menuitem;

    /**
     * The checked value of the element.
     * 
     * @public
     * @remarks
     * HTML Attribute: checked
     */
    @attr
    public checked: boolean;

    /**
     * @internal
     */
    public handleMenuItemKeyDown = (e: KeyboardEvent): boolean => {
        this.change();

        return true;
    };

    /**
     * @internal
     */
    public handleMenuItemClick = (e: MouseEvent): void => {
        this.change();
    };

    private change = (): void => {
        this.$emit("change");
    };
}

/**
 * @public
 */
/* eslint-disable-next-line */
export interface MenuItem extends StartEnd {}
applyMixins(MenuItem, StartEnd);
