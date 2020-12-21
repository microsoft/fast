import { attr, FASTElement } from "@microsoft/fast-element";
import { keyCodeEnter, keyCodeSpace } from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
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
     * The name of the radio group this item belongs to.
     * Typically only relevant when the menu item's role is set to "menuitemradio"
     *
     * @public
     * @remarks
     * HTML Attribute: group
     */
    @attr
    public group: string;

    /**
     * @internal
     */
    public handleMenuItemKeyDown = (e: KeyboardEvent): boolean => {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.invoke();
                return false;
        }

        return true;
    };

    /**
     * @internal
     */
    public handleMenuItemClick = (e: MouseEvent): void => {
        this.invoke();
    };

    private invoke = (): void => {
        if (this.disabled) {
            return;
        }

        switch (this.role) {
            case MenuItemRole.menuitemcheckbox:
                this.checked = !this.checked;
                break;

            case MenuItemRole.menuitemradio:
                if (!this.checked) {
                    this.checked = true;
                }
                break;
        }

        this.$emit("change");
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
