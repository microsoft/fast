import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import {
    Direction,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeEnter,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import type { AnchoredRegion } from "../anchored-region";
import type { Menu } from "../menu/menu";
import { StartEnd } from "../patterns/start-end";
import { getDirection } from "../utilities/";
import { applyMixins } from "../utilities/apply-mixins";
import { MenuItemRole } from "./menu-item.options";

export { MenuItemRole };

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
     * HTML Attribute: expanded
     */
    @attr({ attribute: "expanded" })
    public expanded: boolean;
    private expandedChanged(oldValue: boolean): void {
        const submenu: Element | undefined = this.getSubmenu();
        if (this.$fastController.isConnected) {
            const submenu: Element | undefined = this.getSubmenu();
            if (submenu === undefined) {
                return;
            }
            if (this.expanded === false) {
                (submenu as Menu).collapseExpandedItem();
            } else {
                this.currentDirection = getDirection(this);
            }
            this.$emit("expanded-change", this, { bubbles: false });
        }
    }

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
    private checkedChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            this.$emit("change");
        }
    }

    /**
     * @internal
     */
    @observable
    public submenu: Element | undefined;

    /**
     * reference to the anchored region
     *
     * @internal
     */
    public submenuRegion: AnchoredRegion;

    /**
     * Track current direction to pass to the anchored region
     *
     * @internal
     */
    @observable
    public currentDirection: Direction = Direction.ltr;

    private focusSubmenuOnLoad: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        DOM.queueUpdate(() => {
            this.submenu = this.getSubmenu();
        });
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.submenu = undefined;
    }

    /**
     * @internal
     */
    public handleMenuItemKeyDown = (e: KeyboardEvent): boolean => {
        if (e.defaultPrevented) {
            return false;
        }

        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.invoke();
                return false;

            case keyCodeArrowRight:
                //open/focus on submenu
                this.expandAndFocus();
                return false;

            case keyCodeArrowLeft:
                //close submenu
                if (this.expanded) {
                    this.expanded = false;
                    this.focus();
                    return false;
                }
        }

        return true;
    };

    /**
     * @internal
     */
    public handleMenuItemClick = (e: MouseEvent): boolean => {
        if (e.defaultPrevented || this.disabled) {
            return false;
        }

        this.invoke();
        return false;
    };

    /**
     * @internal
     */
    public submenuLoaded = (): void => {
        if (!this.focusSubmenuOnLoad) {
            return;
        }
        this.focusSubmenuOnLoad = false;
        if (this.submenu !== undefined) {
            (this.submenu as HTMLElement).focus();
            this.setAttribute("tabindex", "-1");
        }
    };

    /**
     * @internal
     */
    public handleMouseOver = (e: MouseEvent): boolean => {
        if (this.disabled || this.submenu === undefined || this.expanded) {
            return false;
        }

        this.expanded = true;

        return false;
    };

    /**
     * @internal
     */
    public handleMouseOut = (e: MouseEvent): boolean => {
        if (!this.expanded || this.contains(document.activeElement)) {
            return false;
        }

        this.expanded = false;

        return false;
    };

    /**
     * @internal
     */
    private expandAndFocus = (): void => {
        if (this.submenu === undefined) {
            return;
        }
        this.focusSubmenuOnLoad = true;
        this.expanded = true;
    };

    /**
     * @internal
     */
    private invoke = (): void => {
        if (this.disabled) {
            return;
        }

        switch (this.role) {
            case MenuItemRole.menuitemcheckbox:
                this.checked = !this.checked;
                this.$emit("change");
                break;

            case MenuItemRole.menuitem:
                // update submenu
                this.submenu = this.getSubmenu();
                if (this.submenu !== undefined) {
                    this.expandAndFocus();
                } else {
                    this.$emit("change");
                }
                break;

            case MenuItemRole.menuitemradio:
                if (!this.checked) {
                    this.checked = true;
                }
                break;
        }
    };

    /**
     * Gets the submenu element if any
     *
     * @internal
     */
    private getSubmenu = (): undefined | Element => {
        const domChildren: Element[] = Array.from(this.children);
        return domChildren.find((element: Element) => {
            return element.getAttribute("role") === "menu";
        });
    };

    /**
     * get an array of valid DOM children
     */
    private domChildren(): Element[] {
        return Array.from(this.children);
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface MenuItem extends StartEnd {}
applyMixins(MenuItem, StartEnd);
