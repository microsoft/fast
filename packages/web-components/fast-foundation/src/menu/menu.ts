import { FASTElement, observable } from "@microsoft/fast-element";
import { inRange, invert } from "lodash-es";
import {
    isHTMLElement,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";
import { MenuItem, MenuItemRole } from "../menu-item/index";

/**
 * A Menu Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @public
 */
export class Menu extends FASTElement {
    /**
     * @internal
     */
    @observable
    public items: HTMLSlotElement;
    private itemsChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            this.menuItems = this.domChildren();
            this.resetItems(oldValue);
            this.setItems();
        }
    }

    private menuItems: Element[];

    /**
     * The index of the focusable element in the items array
     * defaults to -1
     */
    private focusIndex: number = -1;

    private static focusableElementRoles: { [key: string]: string } = invert(
        MenuItemRole
    );

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();
        this.menuItems = this.domChildren();

        this.addEventListener("change", this.changeHandler);
    }

    /**
     * @internal
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.menuItems = [];

        this.removeEventListener("change", this.changeHandler);
    }

    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    public focus(): void {
        this.setFocus(0, 1);
    }

    /**
     * @internal
     */
    public handleMenuKeyDown(e: KeyboardEvent): void | boolean {
        if (e.defaultPrevented) {
            return;
        }
        switch (e.keyCode) {
            case keyCodeArrowDown:
            case keyCodeArrowRight:
                // go forward one index
                this.setFocus(this.focusIndex + 1, 1);
                return;
            case keyCodeArrowUp:
            case keyCodeArrowLeft:
                // go back one index
                this.setFocus(this.focusIndex - 1, -1);
                return;
            case keyCodeEnd:
                // set focus on last item
                this.setFocus(this.domChildren().length - 1, -1);
                return;
            case keyCodeHome:
                // set focus on first item
                this.setFocus(0, 1);
                return;

            default:
                // if we are not handling the event, do not prevent default
                return true;
        }
    }

    /**
     * if focus is moving out of the menu, reset to a stable initial state
     * @internal
     */
    public handleFocusOut = (e: FocusEvent) => {
        const isNestedEl = this.contains(e.relatedTarget as Element);

        if (!isNestedEl) {
            // find our first focusable element
            const focusIndex: number = this.menuItems.findIndex(this.isFocusableElement);

            // set the current focus index's tabindex to -1
            this.menuItems[this.focusIndex].setAttribute("tabindex", "");

            // set the first focusable element tabindex to 0
            this.menuItems[focusIndex].setAttribute("tabindex", "0");

            // set the focus index
            this.focusIndex = focusIndex;
        }
    };

    private setItems = (): void => {
        const focusIndex = this.menuItems.findIndex(this.isFocusableElement);

        // if our focus index is not -1 we have items
        if (focusIndex !== -1) {
            this.focusIndex = focusIndex;
        }

        for (let item: number = 0; item < this.menuItems.length; item++) {
            if (item === focusIndex) {
                this.menuItems[item].setAttribute("tabindex", "0");
            }

            this.menuItems[item].addEventListener("blur", this.handleMenuItemFocus);
        }
    };

    private resetItems = (oldValue: any): void => {
        for (let item: number = 0; item < oldValue.length; item++) {
            oldValue[item].removeEventListener("blur", this.handleMenuItemFocus);
        }
    };

    /**
     * handle change from child element
     */
    private changeHandler = (e: CustomEvent): void => {
        const changedMenuItem: MenuItem = e.target as MenuItem;
        const changeItemIndex: number = this.menuItems.indexOf(changedMenuItem);

        if (changeItemIndex === -1) {
            return;
        }

        if (
            changedMenuItem.role === "menuitemradio" &&
            changedMenuItem.checked === true
        ) {
            for (let i = changeItemIndex - 1; i >= 0; --i) {
                const item: Element = this.menuItems[i];
                const role: string | null = item.getAttribute("role");
                if (role === MenuItemRole.menuitemradio) {
                    (item as MenuItem).checked = false;
                }
                if (role === "separator") {
                    break;
                }
            }
            const maxIndex: number = this.menuItems.length - 1;
            for (let i = changeItemIndex + 1; i <= maxIndex; ++i) {
                const item: Element = this.menuItems[i];
                const role: string | null = item.getAttribute("role");
                if (role === MenuItemRole.menuitemradio) {
                    (item as MenuItem).checked = false;
                }
                if (role === "separator") {
                    break;
                }
            }
        }
    };

    /**
     * get an array of valid DOM children
     */
    private domChildren(): Element[] {
        return Array.from(this.children);
    }

    /**
     * check if the item is a menu item
     */
    private isMenuItemElement = (el: Element): el is HTMLElement => {
        return (
            isHTMLElement(el) &&
            Menu.focusableElementRoles.hasOwnProperty(el.getAttribute("role") as string)
        );
    };

    /**
     * check if the item is focusable
     */
    private isFocusableElement = (el: Element): el is HTMLElement => {
        return this.isMenuItemElement(el);
    };

    private handleMenuItemFocus = (e: KeyboardEvent): void => {
        const target = e.currentTarget as Element;
        const focusIndex: number = this.menuItems.indexOf(target);

        if (focusIndex !== this.focusIndex && focusIndex !== -1) {
            this.setFocus(focusIndex, focusIndex > this.focusIndex ? 1 : -1);
        }
    };

    private setFocus(focusIndex: number, adjustment: number): void {
        const children: Element[] = this.menuItems;

        while (inRange(focusIndex, children.length)) {
            const child: Element = children[focusIndex];

            if (this.isFocusableElement(child)) {
                // update the tabindex of next focusable element
                child.setAttribute("tabindex", "0");

                // focus the element
                child.focus();

                // change the previous index to -1
                children[this.focusIndex].setAttribute("tabindex", "");

                // update the focus index
                this.focusIndex = focusIndex;

                break;
            }

            focusIndex += adjustment;
        }
    }
}
