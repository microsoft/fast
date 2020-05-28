import { attr, FASTElement, observable } from "@microsoft/fast-element";
import {
    getDisplayedNodes,
    isHTMLElement,
    keyCodeEnd,
    keyCodeHome,
    keyCodeArrowDown,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeArrowLeft,
} from "@microsoft/fast-web-utilities";

import { inRange } from "lodash-es";

export class TreeView extends FASTElement {
    public treeView: HTMLElement;

    @attr({ attribute: "render-collapsed-nodes" })
    public renderCollapsedNodes: boolean = true;

    @observable
    public focusable: boolean = true;

    @observable
    private lastFocused: HTMLElement;

    @observable slottedTreeItems: HTMLElement[];
    private slottedTreeItemsChanged(oldValue, newValue): void {
        console.log("slottedTreeItemsChanged called");
        if (this.$fastController.isConnected) {
            this.treeItems = this.getVisibleNodes();
            //this.resetItems(oldValue);
            this.setItems();
        }
    }

    private treeItems: Element[];

    /**
     * The index of the focusable element in the items array
     * defaults to -1
     */
    private focusIndex: number = -1;

    public handleBlur = (e: FocusEvent): void => {
        const root: HTMLElement | null = this.treeView;

        /**
         * If we focus outside of the tree
         */
        if (isHTMLElement(root) && !root.contains(e.relatedTarget as HTMLElement)) {
            this.focusable = true;
        }
    };

    /**
     * if focus is moving out of the menu, reset to a stable initial state
     */
    public handleFocusOut = (e: FocusEvent) => {
        console.log("treeView handleFocusOut e:", e);
        const isNestedEl = this.contains(e.relatedTarget as Element);

        if (!isNestedEl) {
            console.log("treeView found isNestedEL");
        }
    };

    // public handleKeyDown(e: KeyboardEvent): void | boolean {
    //     console.log("treeView handleKeyDown e:", e);
    //     switch (e.keyCode) {
    //         case keyCodeArrowDown:
    //         case keyCodeArrowRight:
    //             // go forward one index
    //             e.preventDefault();
    //             // this.setFocus(this.focusIndex + 1, 1);
    //             break;
    //         case keyCodeArrowUp:
    //         case keyCodeArrowLeft:
    //             // go back one index
    //             e.preventDefault();
    //             // this.setFocus(this.focusIndex - 1, -1);
    //             break;
    //         case keyCodeEnd:
    //             // set focus on last item
    //             e.preventDefault();
    //             // this.setFocus(this.domChildren().length - 1, -1);
    //             break;
    //         case keyCodeHome:
    //             // set focus on first item
    //             e.preventDefault();
    //             // this.setFocus(0, 1);
    //             break;
    //         default:
    //             // if we are not handling the event, do not prevent default
    //             return true;
    //     }
    // }

    public handleFocus = (e: FocusEvent): void => {
        console.log("handleFocus e:", e);
        if (!isHTMLElement(this.treeView)) {
            return;
        }

        const root: HTMLElement | null = this.treeView;
        const lastFocused: HTMLElement | null = this.lastFocused;

        /**
         * If the tree view is receiving focus
         */
        if (isHTMLElement(root) && root === e.target) {
            // If we have a last focused item, focus it - otherwise check for an initially selected item or focus the first "[role='treeitem']"
            // If there is no "[role='treeitem']" to be focused AND no last-focused, then there are likely no children
            // or children are malformed so keep the tree in the tab-order in the hopes that the author cleans up
            // the children
            const selectedChild: HTMLElement | null = root.querySelector(
                "[aria-selected='true']"
            );

            const toBeFocused: HTMLElement | null = !!lastFocused
                ? lastFocused
                : !!selectedChild
                ? selectedChild
                : root.querySelector("[role='treeitem']");

            if (toBeFocused && isHTMLElement(toBeFocused)) {
                toBeFocused.focus();

                if (this.focusable) {
                    this.focusable = false;
                }
            }
        } else {
            // A child is receiving focus. While focus is within the tree, we simply need to ensure
            // that the tree is not focusable.
            if (this.focusable) {
                this.focusable = false;
            }
        }
    };

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.treeItems = this.getVisibleNodes();
        console.log("treeView connectedCallback this.treeItems:", this.treeItems);
        //this.ensureFocusability();
        //const treeItems = this.getVisibleNodes();
        // if (treeItems) {
        //     treeItems.forEach((item: HTMLElement) => {
        //         console.log("tree-item item:", item, " marked with tabindex -1");
        //         item.setAttribute("tabindex", "-1");
        //     });
        //     treeItems[0].setAttribute("tabindex", "0");
        // }
    }

    public handleKeyDown = (e: KeyboardEvent): void | boolean => {
        console.log("treeView handleKeyDown e:", e);
        const nodes: HTMLElement[] = this.getVisibleNodes();

        if (!nodes) {
            return true;
        }

        switch (e.keyCode) {
            case keyCodeHome:
                if (nodes && nodes.length) {
                    nodes[0].focus();
                }
                break;
            case keyCodeEnd:
                if (nodes && nodes.length) {
                    nodes[nodes.length - 1].focus();
                }
                break;
            default:
                return true;
        }
    };

    private setItems = (): void => {
        console.log("treeView setItems called...");
        const treeItems: HTMLElement[] = this.getVisibleNodes();

        const focusIndex = treeItems.findIndex(this.isFocusableElement);

        // if our focus index is not -1 we have items
        if (focusIndex !== -1) {
            this.focusIndex = focusIndex;
        }

        for (let item: number = 0; item < treeItems.length; item++) {
            if (item === focusIndex) {
                treeItems[item].setAttribute("tabindex", "0");
            }

            treeItems[item].addEventListener("blur", this.handleTreeItemFocus);
        }
    };

    private handleTreeItemFocus = (e: KeyboardEvent): void => {
        console.log("handleTreeItemFocus called, e:", e);
        const target = e.currentTarget as Element;
        const treeItems: HTMLElement[] = this.getVisibleNodes();
        const focusIndex: number = treeItems.indexOf(target as HTMLElement);

        if (this.isDisabledElement(target)) {
            target.blur();
            return;
        }

        if (focusIndex !== this.focusIndex && focusIndex !== -1) {
            this.setFocus(focusIndex, focusIndex > this.focusIndex ? 1 : -1);
        }
    };

    /**
     * check if the item is focusable
     */
    private isFocusableElement = (el: Element): el is HTMLElement => {
        return this.isTreeItemElement(el) && !this.isDisabledElement(el);
    };

    /**
     * check if the item is disabled
     */
    private isDisabledElement = (el: Element): el is HTMLElement => {
        return this.isTreeItemElement(el) && el.getAttribute("aria-disabled") === "true";
    };

    /**
     * check if the item is a menu item
     */
    private isTreeItemElement = (el: Element): el is HTMLElement => {
        return isHTMLElement(el) && (el.getAttribute("role") as string) === "treeitem";
    };

    private setFocus(focusIndex: number, adjustment: number): void {
        const children: Element[] = this.getVisibleNodes();

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

    private getVisibleNodes(): HTMLElement[] {
        const displayNodes = getDisplayedNodes(this.treeView, "[role='treeitem']");
        console.log("displayNodes:", displayNodes);
        console.log("raw this.slottedTreeItems:", this.slottedTreeItems);
        const treeItems: HTMLElement[] = [];
        if (this.slottedTreeItems !== undefined) {
            this.slottedTreeItems.forEach((item: any) => {
                console.log("next slottedItem:", item);
                if (item instanceof HTMLElement) {
                    console.log("item is an HTMLElement");
                    console.log("item.getAttribute(role):", item.getAttribute("role"));

                    // if (item.getAttribute("role") as string === "treeitem") {
                    console.log("pushed item:", item);
                    treeItems.push(item as any);
                    // }
                }
            });
        }
        return treeItems;
    }

    /**
     * Verifies that the tree has a focusable child.
     * If it does not, the tree will begin to accept focus
     */
    private ensureFocusability(): void {
        console.log("ensureFocusability");
        if (!this.focusable && isHTMLElement(this.treeView)) {
            console.log("!this.focusable && isHTMLElement(this.treeView)");
            const focusableChild: HTMLElement | null = this.querySelector(
                "[role='treeitem'][tabindex='0']"
            );

            if (!isHTMLElement(focusableChild)) {
                console.log("focusableChild not found, so setting first item");
                const firstItem: HTMLElement = this.getVisibleNodes()[0] as HTMLElement;
                if (firstItem) {
                    console.log("setting first item tabindex to 0");
                    firstItem.setAttribute("tabindex", "0");
                }
                this.focusable = true;
            } else {
                console.log("focusableChild was found focusableChild:", focusableChild);
            }
        }
    }
}
