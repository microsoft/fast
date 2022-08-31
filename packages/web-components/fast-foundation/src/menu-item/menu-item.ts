import { attr, FASTElement, observable, Updates } from "@microsoft/fast-element";
import {
    Direction,
    keyArrowLeft,
    keyArrowRight,
    keyEnter,
    keySpace,
} from "@microsoft/fast-web-utilities";
import { computePosition, flip, autoUpdate } from "@floating-ui/dom";
import type { FASTMenu } from "../menu/menu.js";
import { StartEnd } from "../patterns/index.js";
import { getDirection } from "../utilities/direction.js";
import { applyMixins } from "../utilities/apply-mixins.js";
import {
    MenuItemColumnCount,
    MenuItemRole,
    roleForMenuItem,
    SubmenuPosition,
} from "./menu-item.options.js";

export { MenuItemRole, roleForMenuItem };

/**
 * A Menu Item Custom HTML Element.
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
                this.cleanupSubmenuPosition();
            } else {
                this.currentDirection = getDirection(this);
                this.setSubmenuPosition();
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
     * The positioning of the submenu
     *
     * @public
     */
    @attr
    public submenuPositioning: SubmenuPosition;

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

    public cleanupSubmenuPosition: () => void;

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
     * Sets the submenu position
     *
     * @public
     */
    public setSubmenuPosition = (): void => {
        if (!this.submenu) {
            return;
        }

        this.cleanupSubmenuPosition = autoUpdate(
            (this as unknown) as HTMLElement,
            this.submenu as HTMLElement,
            () => {
                computePosition(
                    (this as unknown) as HTMLElement,
                    this.submenu as HTMLElement,
                    {
                        placement: this.submenuPositioning || SubmenuPosition.rightStart,
                        middleware: [flip()],
                    }
                ).then(({ x, y }) => {
                    Object.assign((this.submenu as HTMLElement)!.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                });
            }
        );
    };

    /**
     * @internal
     */
    private expandAndFocus = (): void => {
        if (!this.hasSubmenu) {
            return;
        }

        this.expanded = true;

        Updates.enqueue(() => {
            (this.submenu as HTMLElement).focus();
            this.setAttribute("tabindex", "-1");
        });
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
