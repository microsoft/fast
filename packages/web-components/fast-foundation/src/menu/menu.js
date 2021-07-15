var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { observable } from "@microsoft/fast-element";
import { inRange, invert } from "lodash-es";
import {
    isHTMLElement,
    keyCodeArrowDown,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeHome,
} from "@microsoft/fast-web-utilities";
import { MenuItem, MenuItemRole } from "../menu-item/index";
import { FoundationElement } from "../foundation-element";
/**
 * A Menu Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @public
 */
export class Menu extends FoundationElement {
    constructor() {
        super(...arguments);
        this.expandedItem = null;
        /**
         * The index of the focusable element in the items array
         * defaults to -1
         */
        this.focusIndex = -1;
        /**
         * @internal
         */
        this.isNestedMenu = () => {
            return (
                this.parentElement !== null &&
                isHTMLElement(this.parentElement) &&
                this.parentElement.getAttribute("role") === "menuitem"
            );
        };
        /**
         * if focus is moving out of the menu, reset to a stable initial state
         * @internal
         */
        this.handleFocusOut = e => {
            if (!this.contains(e.relatedTarget)) {
                this.collapseExpandedItem();
                // find our first focusable element
                const focusIndex = this.menuItems.findIndex(this.isFocusableElement);
                // set the current focus index's tabindex to -1
                this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
                // set the first focusable element tabindex to 0
                this.menuItems[focusIndex].setAttribute("tabindex", "0");
                // set the focus index
                this.focusIndex = focusIndex;
            }
        };
        this.handleItemFocus = e => {
            const targetItem = e.target;
            if (targetItem !== this.menuItems[this.focusIndex]) {
                this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
                this.focusIndex = this.menuItems.indexOf(targetItem);
                targetItem.setAttribute("tabindex", "0");
            }
        };
        this.handleExpandedChanged = e => {
            if (
                e.defaultPrevented ||
                e.target === null ||
                this.menuItems.indexOf(e.target) < 0
            ) {
                return;
            }
            e.preventDefault();
            const changedItem = e.target;
            // closing an expanded item without opening another
            if (
                this.expandedItem !== null &&
                changedItem === this.expandedItem &&
                changedItem.expanded === false
            ) {
                this.expandedItem = null;
                return;
            }
            if (changedItem.expanded) {
                if (this.expandedItem !== null && this.expandedItem !== changedItem) {
                    this.expandedItem.expanded = false;
                }
                this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
                this.expandedItem = changedItem;
                this.focusIndex = this.menuItems.indexOf(changedItem);
                changedItem.setAttribute("tabindex", "0");
            }
        };
        this.setItems = () => {
            const menuItems = this.menuItems.filter(this.isMenuItemElement);
            // if our focus index is not -1 we have items
            if (menuItems.length) {
                this.focusIndex = 0;
            }
            let indent;
            function elementIndent(el) {
                if (!(el instanceof MenuItem)) {
                    return 1;
                }
                if (
                    el.role !== MenuItemRole.menuitem &&
                    el.querySelector("[slot=start]") === null
                ) {
                    return 1;
                } else if (
                    el.role === MenuItemRole.menuitem &&
                    el.querySelector("[slot=start]") !== null
                ) {
                    return 1;
                } else if (
                    el.role !== MenuItemRole.menuitem &&
                    el.querySelector("[slot=start]") !== null
                ) {
                    return 2;
                } else {
                    return 0;
                }
            }
            indent = menuItems.reduce((accum, current) => {
                const elementValue = elementIndent(current);
                return accum > elementValue ? accum : elementValue;
            }, 0);
            menuItems.forEach((item, index) => {
                item.setAttribute("tabindex", index === 0 ? "0" : "-1");
                item.addEventListener("expanded-change", this.handleExpandedChanged);
                item.addEventListener("focus", this.handleItemFocus);
                if (item instanceof MenuItem) {
                    item.startColumnCount = indent;
                }
            });
        };
        this.resetItems = oldValue => {
            oldValue.forEach(item => {
                item.removeEventListener("expanded-change", this.handleExpandedChanged);
                item.removeEventListener("focus", this.handleItemFocus);
            });
        };
        /**
         * handle change from child element
         */
        this.changeHandler = e => {
            const changedMenuItem = e.target;
            const changeItemIndex = this.menuItems.indexOf(changedMenuItem);
            if (changeItemIndex === -1) {
                return;
            }
            if (
                changedMenuItem.role === "menuitemradio" &&
                changedMenuItem.checked === true
            ) {
                for (let i = changeItemIndex - 1; i >= 0; --i) {
                    const item = this.menuItems[i];
                    const role = item.getAttribute("role");
                    if (role === MenuItemRole.menuitemradio) {
                        item.checked = false;
                    }
                    if (role === "separator") {
                        break;
                    }
                }
                const maxIndex = this.menuItems.length - 1;
                for (let i = changeItemIndex + 1; i <= maxIndex; ++i) {
                    const item = this.menuItems[i];
                    const role = item.getAttribute("role");
                    if (role === MenuItemRole.menuitemradio) {
                        item.checked = false;
                    }
                    if (role === "separator") {
                        break;
                    }
                }
            }
        };
        /**
         * check if the item is a menu item
         */
        this.isMenuItemElement = el => {
            return (
                isHTMLElement(el) &&
                Menu.focusableElementRoles.hasOwnProperty(el.getAttribute("role"))
            );
        };
        /**
         * check if the item is focusable
         */
        this.isFocusableElement = el => {
            return this.isMenuItemElement(el);
        };
    }
    itemsChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.menuItems = this.domChildren();
            this.resetItems(oldValue);
            this.setItems();
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.menuItems = this.domChildren();
        this.addEventListener("change", this.changeHandler);
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.menuItems = [];
        this.removeEventListener("change", this.changeHandler);
    }
    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    focus() {
        this.setFocus(0, 1);
    }
    /**
     * Collapses any expanded menu items.
     *
     * @public
     */
    collapseExpandedItem() {
        if (this.expandedItem !== null) {
            this.expandedItem.expanded = false;
            this.expandedItem = null;
        }
    }
    /**
     * @internal
     */
    handleMenuKeyDown(e) {
        if (e.defaultPrevented) {
            return;
        }
        switch (e.keyCode) {
            case keyCodeArrowDown:
                // go forward one index
                this.setFocus(this.focusIndex + 1, 1);
                return;
            case keyCodeArrowUp:
                // go back one index
                this.setFocus(this.focusIndex - 1, -1);
                return;
            case keyCodeEnd:
                // set focus on last item
                this.setFocus(this.menuItems.length - 1, -1);
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
     * get an array of valid DOM children
     */
    domChildren() {
        return Array.from(this.children);
    }
    setFocus(focusIndex, adjustment) {
        if (this.menuItems === undefined) {
            return;
        }
        while (inRange(focusIndex, this.menuItems.length)) {
            const child = this.menuItems[focusIndex];
            if (this.isFocusableElement(child)) {
                // change the previous index to -1
                if (
                    this.focusIndex > -1 &&
                    this.menuItems.length >= this.focusIndex - 1
                ) {
                    this.menuItems[this.focusIndex].setAttribute("tabindex", "-1");
                }
                // update the focus index
                this.focusIndex = focusIndex;
                // update the tabindex of next focusable element
                child.setAttribute("tabindex", "0");
                // focus the element
                child.focus();
                break;
            }
            focusIndex += adjustment;
        }
    }
}
Menu.focusableElementRoles = invert(MenuItemRole);
__decorate([observable], Menu.prototype, "items", void 0);
