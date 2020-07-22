import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { isHTMLElement, keyCodeEnd, keyCodeHome } from "@microsoft/fast-web-utilities";
import { isTreeItemElement, TreeItem } from "../tree-item";

/**
 * A Tree view Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#TreeView | ARIA TreeView }.
 *
 * @public
 */
export class TreeView extends FASTElement {
    public treeView: HTMLElement;

    @attr({ attribute: "render-collapsed-nodes" })
    public renderCollapsedNodes: boolean;

    @observable
    public focusable: boolean = true;

    @observable
    public currentSelected: HTMLElement | TreeItem | null;

    @observable
    private lastFocused: HTMLElement;

    @observable
    private nested: boolean;

    @observable slottedTreeItems: HTMLElement[];
    private slottedTreeItemsChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            // filter the tree items until that's done for us in the framework
            this.resetItems();
            this.treeItems = this.getVisibleNodes();
            this.setItems();

            // check if any tree items have nested items
            // if they do, apply the nested attribute
            if (this.checkForNestedItems()) {
                this.slottedTreeItems.forEach(node => {
                    if (isTreeItemElement(node)) {
                        node.setAttribute("nested", "true");
                    }
                });
            }
        }
    }

    private checkForNestedItems(): boolean {
        return this.slottedTreeItems.some((node: HTMLElement) => {
            return isTreeItemElement(node) && node.querySelector("[role='treeitem']");
        });
    }

    private treeItems: HTMLElement[];

    public handleBlur = (e: FocusEvent): void => {
        const root: HTMLElement | null = this.treeView;

        /**
         * If we focus outside of the tree
         */
        if (isHTMLElement(root) && !root.contains(e.relatedTarget as HTMLElement)) {
            this.focusable = true;
        }
        this.ensureFocusability();
    };

    public handleFocus = (e: FocusEvent): void => {
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

    public connectedCallback(): void {
        super.connectedCallback();
        this.treeItems = this.getVisibleNodes();

        DOM.queueUpdate(() => {
            //only supporting single select
            const node: HTMLElement | null = this.treeView.querySelector(
                "[aria-selected='true']"
            );
            if (node) {
                this.currentSelected = node;
            }
        });
        this.ensureFocusability();
    }

    public handleKeyDown = (e: KeyboardEvent): void | boolean => {
        if (!this.treeItems) {
            return true;
        }

        switch (e.keyCode) {
            case keyCodeHome:
                if (this.treeItems && this.treeItems.length) {
                    this.treeItems[0].focus();
                }
                break;
            case keyCodeEnd:
                if (this.treeItems && this.treeItems.length) {
                    this.treeItems[this.treeItems.length - 1].focus();
                }
                break;
            default:
                return true;
        }
    };

    private setItems = (): void => {
        const focusIndex = this.treeItems.findIndex(this.isFocusableElement);

        for (let item: number = 0; item < this.treeItems.length; item++) {
            if (item === focusIndex && !this.treeItems[item].hasAttribute("disabled")) {
                this.treeItems[item].setAttribute("tabindex", "0");
            }
            this.treeItems[item].addEventListener(
                "selected-change",
                this.handleItemSelected
            );
        }
    };

    private resetItems = (): void => {
        for (let item: number = 0; item < this.treeItems.length; item++) {
            this.treeItems[item].removeEventListener(
                "selected-change",
                this.handleItemSelected
            );
        }
    };

    private handleItemSelected = (e: CustomEvent): void => {
        const newSelection: HTMLElement = e.target as HTMLElement;
        if (newSelection !== this.currentSelected) {
            if (this.currentSelected) {
                // TODO: fix this below, shouldn't need both
                (this.currentSelected as HTMLElement).removeAttribute("selected");
                (this.currentSelected as TreeItem).selected = false;
            }
            this.currentSelected = newSelection;
        }
    };

    /**
     * check if the item is focusable
     */
    private isFocusableElement = (el: Element): el is HTMLElement => {
        return isTreeItemElement(el) && !this.isDisabledElement(el);
    };

    /**
     * check if the item is disabled
     */
    private isDisabledElement = (el: Element): el is HTMLElement => {
        return isTreeItemElement(el) && el.getAttribute("aria-disabled") === "true";
    };

    private getVisibleNodes(): HTMLElement[] {
        const treeItems: HTMLElement[] = [];
        if (this.slottedTreeItems !== undefined) {
            this.slottedTreeItems.forEach((item: any) => {
                if (isTreeItemElement(item)) {
                    treeItems.push(item as any);
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
        if (!this.focusable && isHTMLElement(this.treeView)) {
            const focusableChild: HTMLElement | null = this.querySelector(
                "[role='treeitem'][tabindex='0']"
            );

            if (!isHTMLElement(focusableChild)) {
                this.focusable = true;
            }
        }
    }
}
