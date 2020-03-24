import { attr, FastElement } from "@microsoft/fast-element";
import { MenuItemRole } from "../menu-item";
import { inRange, invert } from "lodash-es";
import {
    keyCodeArrowDown,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeArrowLeft,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";

export class Menu extends FastElement {
    @attr
    public autofocus: boolean = false;

    public menu: HTMLElement;

    /**
     * The index of the focusable element in the items array
     * defaults to -1
     */
    private focusIndex: number = -1;

    private static focusableElementRoles: { [key: string]: string } = invert(
        MenuItemRole
    );

    public connectedCallback(): void {
        const children: Element[] = this.domChildren();
        const focusIndex: number = children.findIndex(this.isFocusableElement);

        if (focusIndex !== -1) {
            this.focusIndex = focusIndex;
        }

        if (this.autofocus) {
            this.focus();
        }

        for (const child of children) {
            child.addEventListener("blur", () => this.handleMenuItemFocus);
        }
    }

    public handleMenuKeyDown = (e: KeyboardEvent): void => {
        switch (e.keyCode) {
            case keyCodeArrowDown:
            case keyCodeArrowRight:
                e.preventDefault();
                this.setFocus(this.focusIndex + 1, 1);

                break;

            case keyCodeArrowUp:
            case keyCodeArrowLeft:
                e.preventDefault();
                this.setFocus(this.focusIndex - 1, -1);

                break;

            case keyCodeEnd:
                e.preventDefault();
                this.setFocus(this.domChildren().length - 1, -1);

                break;

            case keyCodeHome:
                e.preventDefault();
                this.setFocus(0, 1);

                break;
        }
    };

    private isMenuItemElement(element: Element): element is HTMLElement {
        return (
            element instanceof HTMLElement &&
            Menu.focusableElementRoles.hasOwnProperty(element.getAttribute("role") as any)
        );
    }

    /**
     * Determines if a given element should be focusable by the menu
     */
    private isFocusableElement = (element: Element): element is HTMLElement => {
        return this.isMenuItemElement(element) && !this.isDisabledElement(element);
    };

    private isDisabledElement = (element: Element): element is HTMLElement => {
        return (
            this.isMenuItemElement(element) &&
            element.getAttribute("aria-disabled") === "true"
        );
    };

    /**
     * Return an array of all focusabled elements that are children
     * of the context menu
     */
    private domChildren(): Element[] {
        return Array.from(this.menu.children);
    }

    /**
     * Ensure we always validate our internal state on item focus events, otherwise
     * the component can get out of sync from click events
     */
    private handleMenuItemFocus = (e: FocusEvent): void => {
        const target: Element = e.currentTarget as Element;
        const focusIndex: number = this.domChildren().indexOf(target);
        console.log(e.target, "target in menu item focus");
        if (this.isDisabledElement(target)) {
            target.blur();

            return;
        }

        if (focusIndex !== this.focusIndex && focusIndex !== -1) {
            this.setFocus(focusIndex, focusIndex > this.focusIndex ? 1 : -1);
        }
    };

    /**
     * Sets focus to the nearest focusable element to the supplied focusIndex.
     * The adjustment controls how the function searches for other focusable elements
     * if the element at the focusIndex is not focusable. A positive number will search
     * towards the end of the children array, whereas a negative number will search towards
     * the beginning of the children array.
     */
    private setFocus(focusIndex: number, adjustment: number): void {
        const children: Element[] = this.domChildren();

        while (inRange(focusIndex, children.length)) {
            const child: Element = children[focusIndex];

            if (this.isFocusableElement(child)) {
                // set the previously focus element to -1
                children[this.focusIndex].setAttribute("tabindex", "-1");

                // set our new focused child to 0
                child.setAttribute("tabindex", "0");

                child.focus();

                this.focusIndex = focusIndex;

                break;
            }

            focusIndex += adjustment;
        }
    }
}
