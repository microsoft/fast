import {
    attr,
    FASTElement,
    observable,
    SyntheticViewTemplate,
    Updates,
} from "@microsoft/fast-element";
import {
    Direction,
    keyArrowLeft,
    keyArrowRight,
    keyEnter,
    keySpace,
} from "@microsoft/fast-web-utilities";
import type { FASTAnchoredRegion } from "../anchored-region/anchored-region.js";
import type { FASTMenu } from "../menu/menu.js";
import {
    StartEnd,
    StartEndOptions,
    TemplateElementDependency,
} from "../patterns/index.js";
import { getDirection } from "../utilities/direction.js";
import { applyMixins } from "../utilities/apply-mixins.js";
import { MenuItemRole, roleForMenuItem } from "./menu-item.options.js";

export { MenuItemRole, roleForMenuItem };

/**
 * Types of menu item column count.
 * @public
 */
export type MenuItemColumnCount = 0 | 1 | 2;

/**
 * Menu Item configuration options
 * @public
 */
export type MenuItemOptions = StartEndOptions & {
    checkboxIndicator?: string | SyntheticViewTemplate;
    expandCollapseGlyph?: string | SyntheticViewTemplate;
    radioIndicator?: string | SyntheticViewTemplate;
    anchoredRegion: TemplateElementDependency;
};

/**
 * A Switch Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#menuitem | ARIA menuitem }, {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox | ARIA menuitemcheckbox}, or {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemradio | ARIA menuitemradio }.
 *
 * @slot checked-indicator - The checked indicator
 * @slot radio-indicator - The radio indicator
 * @slot start - Content which can be provided before the menu item content
 * @slot end - Content which can be provided after the menu item content
 * @slot - The default slot for menu item content
 * @slot expand-collapse-indicator - The expand/collapse indicator
 * @slot submenu - Used to nest menu's within menu items
 * @csspart input-container - The element representing the visual checked or radio indicator
 * @csspart checkbox - The element wrapping the `menuitemcheckbox` indicator
 * @csspart radio - The element wrapping the `menuitemradio` indicator
 * @csspart content - The element wrapping the menu item content
 * @csspart expand-collapse-glyph-container - The element wrapping the expand collapse element
 * @csspart expand-collapse - The expand/collapse element
 * @csspart submenu-region - The container for the submenu, used for positioning
 * @fires expanded-change - Fires a custom 'expanded-change' event when the expanded state changes
 * @fires change - Fires a custom 'change' event when a non-submenu item with a role of `menuitemcheckbox`, `menuitemradio`, or `menuitem` is invoked
 *
 * @public
 */
export class FASTMenuItem extends FASTElement {
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
    protected expandedChanged(oldValue: boolean): void {
        if (this.$fastController.isConnected) {
            if (this.submenu === undefined) {
                return;
            }
            if (this.expanded === false) {
                (this.submenu as FASTMenu).collapseExpandedItem();
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
    protected checkedChanged(oldValue: boolean, newValue: boolean): void {
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
    public submenuRegion: FASTAnchoredRegion;

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
        Updates.enqueue(() => {
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

        switch (e.key) {
            case keyEnter:
            case keySpace:
                this.invoke();
                return false;

            case keyArrowRight:
                //open/focus on submenu
                this.expandAndFocus();
                return false;

            case keyArrowLeft:
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
        return Array.from(this.children).filter(child => !child.hasAttribute("hidden"));
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface FASTMenuItem extends StartEnd {}
applyMixins(FASTMenuItem, StartEnd);
