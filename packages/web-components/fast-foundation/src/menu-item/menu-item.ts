import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import {
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeEnter,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { MenuItemRole } from "./menu-item.options";
import { AnchoredRegion } from "../anchored-region";
import { Menu } from "../menu/menu";
import { times } from "lodash-es";

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
     * Whether the item opens a submenu.
     *
     * @public
     * @remarks
     * HTML Attribute: submenu
     */
    @attr({ mode: "boolean" })
    public submenu: boolean;

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
        if (this.submenu && this.$fastController.isConnected && oldValue === true) {
            this.submenuNodes.forEach(element => {
                (element as Menu).collapseExpandedMenus();
            });
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
     * The delay in milliseconds before a submenu expands after a hover event
     *
     * @defaultValue - 300
     * @public
     * HTML Attribute: hover-delay
     */
    @attr
    public hoverDelay: number = 300;

    /**
     * reference to the anchored region
     *
     * @internal
     */
    public subMenuRegion: AnchoredRegion;

    /**
     * reference to the slotted submenu nodes
     *
     * @internal
     */
    @observable
    public submenuNodes: HTMLElement[] = [];

    /**
     * The timer that tracks delay time before the submenu expands on hover
     */
    private hoverTimer: number | null = null;

    /**
     * Indicates whether the menu item is currently being hovered
     */
    private isHovered: boolean = false;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        if (this.submenu) {
            this.addEventListener("mouseover", this.handleMouseOver);
        }
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.submenu) {
            this.removeEventListener("mouseover", this.handleMouseOver);
            this.clearHoverTimer();
        }
    }

    /**
     * @internal
     */
    public handleMouseOver = (e: MouseEvent): void => {
        if (this.expanded || this.isHovered || e.defaultPrevented) {
            return;
        }

        e.preventDefault();

        if (this.hoverDelay > 1) {
            this.addEventListener("mouseout", this.handleMouseOut);
            this.isHovered = true;
            if (this.hoverTimer === null) {
                this.hoverTimer = window.setTimeout((): void => {
                    this.hoverTimerExpired();
                }, this.hoverDelay);
                return;
            }
        }

        // no delay, expand right away
        this.toggleExpanded();
    };

    /**
     * @internal
     */
    public handleMouseOut = (e: MouseEvent): void => {
        this.removeEventListener("mouseout", this.handleMouseOut);
        this.isHovered = false;
        this.clearHoverTimer();
    };

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
                if (this.submenu) {
                    this.toggleExpanded();
                }
                return false;

            case keyCodeArrowLeft:
                //close submenu
                if (this.submenu && this.expanded) {
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
    public handleAnchoredRegionChange = (e: Event): boolean => {
        if (e.defaultPrevented || this.disabled || this.submenuNodes.length === 0) {
            return false;
        }

        e.preventDefault();

        this.subMenuRegion.removeEventListener("change", this.handleAnchoredRegionChange);

        DOM.queueUpdate(() => {
            this.setAttribute("tabindex", "-1");
            if (this.submenuNodes.length > 0) {
                this.submenuNodes[0].focus();
            }
            this.subMenuRegion.update();
        });

        return false;
    };

    private toggleExpanded = (): void => {
        if (!this.submenu) {
            return;
        }
        this.expanded = !this.expanded;
        if (this.expanded) {
            DOM.queueUpdate(this.setRegionProps);
        }
        this.$emit("expanded-change", this, { bubbles: false });
    };

    private hoverTimerExpired = (): void => {
        this.toggleExpanded();
        this.clearHoverTimer();
    };

    /**
     * clears the hover timer
     */
    private clearHoverTimer = (): void => {
        if (this.hoverTimer !== null) {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = null;
        }
    };

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
                if (this.submenu) {
                    this.toggleExpanded();
                } else {
                    this.$emit("change");
                }
                break;

            case MenuItemRole.menuitemradio:
                if (!this.checked) {
                    this.checked = true;
                }
                break;

    };
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
