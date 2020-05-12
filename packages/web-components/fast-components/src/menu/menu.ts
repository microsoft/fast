import { DOM, FASTElement, observable } from "@microsoft/fast-element";
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
import { MenuItemRole } from "../menu-item";

export class Menu extends FASTElement {
    @observable
    public items: HTMLSlotElement;
    private itemsChanged(): void {
        this.menuItems = this.domChildren();
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

    public connectedCallback(): void {
        super.connectedCallback();

        // We need to queue update currently to ensure that
        // the attributes on our menu items have time to be set
        DOM.queueUpdate(() => {
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
        });
    }

    public focus(): void {
        this.setFocus(0, 1);
    }

    public handleMenuKeyDown(e: KeyboardEvent): void | boolean {
        switch (e.keyCode) {
            case keyCodeArrowDown:
            case keyCodeArrowRight:
                // go forward one index
                e.preventDefault();
                this.setFocus(this.focusIndex + 1, 1);
                break;
            case keyCodeArrowUp:
            case keyCodeArrowLeft:
                // go back one index
                e.preventDefault();
                this.setFocus(this.focusIndex - 1, -1);
                break;
            case keyCodeEnd:
                // set focus on last item
                e.preventDefault();
                this.setFocus(this.domChildren().length - 1, -1);
                break;
            case keyCodeHome:
                // set focus on first item
                e.preventDefault();
                this.setFocus(0, 1);
                break;
            default:
                // if we are not handling the event, do not prevent default
                return true;
        }
    }

    /**
     * if focus is moving out of the menu, reset to a stable initial state
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
     * check if the item is disabled
     */
    private isDisabledElement = (el: Element): el is HTMLElement => {
        return this.isMenuItemElement(el) && el.getAttribute("aria-disabled") === "true";
    };

    /**
     * check if the item is focusable
     */
    private isFocusableElement = (el: Element): el is HTMLElement => {
        return this.isMenuItemElement(el) && !this.isDisabledElement(el);
    };

    private handleMenuItemFocus = (e: KeyboardEvent): void => {
        const target = e.currentTarget as Element;
        const focusIndex: number = this.menuItems.indexOf(target);

        if (this.isDisabledElement(target)) {
            target.blur();
            return;
        }

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
