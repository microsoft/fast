import { attr, DOM, observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import {
    Direction,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeEnter,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import type { AnchoredRegion } from "../anchored-region";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
import type { Menu } from "../menu/menu";
import { StartEnd, StartEndOptions } from "../patterns/start-end";
import { getDirection } from "../utilities/";
import { applyMixins } from "../utilities/apply-mixins";
import { MenuItemRole } from "./menu-item.options";

export { MenuItemRole };

/**
 * Types of menu item column count.
 * @public
 */
export type MenuItemColumnCount = 0 | 1 | 2;

/**
 * Menu Item configuration options
 * @public
 */
export type MenuItemOptions = FoundationElementDefinition &
    StartEndOptions & {
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
export class MenuItem extends FoundationElement {
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
    @attr({ mode: "boolean" })
    public expanded: boolean;
    private expandedChanged(oldValue: boolean): void {
        if (this.$fastController.isConnected) {
            if (this.submenu === undefined) {
                return;
            }
            if (this.expanded === false) {
                (this.submenu as Menu).collapseExpandedItem();
            } else {
                this.currentDirection = getDirection(this);
            }
            this.$emit("expanded-change", this, { bubbles: false });
        }
    }

    /**
     * @internal
     */
    @observable
    public startColumnCount: MenuItemColumnCount;

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
    @attr({ mode: "boolean" })
    public checked: boolean;
    private checkedChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            this.$emit("change");
        }
    }

    /**
     * reference to the anchored region
     *
     * @internal
     */
    @observable
    public submenuRegion: AnchoredRegion;

    /**
     * @internal
     */
    @observable
    public hasSubmenu: boolean = false;

    /**
     * Track current direction to pass to the anchored region
     *
     * @internal
     */
    @observable
    public currentDirection: Direction = Direction.ltr;

    /**
     * @internal
     */
    @observable
    public submenu: Element | undefined;

    private focusSubmenuOnLoad: boolean = false;

    private observer: MutationObserver | undefined;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        DOM.queueUpdate(() => {
            this.updateSubmenu();
        });

        if (!this.startColumnCount) {
            this.startColumnCount = 1;
        }

        this.observer = new MutationObserver(this.updateSubmenu);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.submenu = undefined;
        if (this.observer !== undefined) {
            this.observer.disconnect();
            this.observer = undefined;
        }
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
        if (this.hasSubmenu) {
            (this.submenu as HTMLElement).focus();
            this.setAttribute("tabindex", "-1");
        }
    };

    /**
     * @internal
     */
    public handleMouseOver = (e: MouseEvent): boolean => {
        if (this.disabled || !this.hasSubmenu || this.expanded) {
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
        if (!this.hasSubmenu) {
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
                this.updateSubmenu();
                if (this.hasSubmenu) {
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
    private updateSubmenu = (): void => {
        this.submenu = this.domChildren().find((element: Element) => {
            return element.getAttribute("role") === "menu";
        });

        this.hasSubmenu = this.submenu === undefined ? false : true;
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
