import { attr, DOM, observable } from "@microsoft/fast-element";
import {
    getDisplayedNodes,
    isHTMLElement,
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyHome,
} from "@microsoft/fast-web-utilities";
import { isTreeItemElement, TreeItem } from "../tree-item";
import { FoundationElement } from "../foundation-element";

/**
 * A Tree view Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#TreeView | ARIA TreeView }.
 *
 * @public
 */
export class TreeView extends FoundationElement {
    /**
   /**
    * When true, the control will be appear expanded by user interaction.
    * @public
    * @remarks
    * HTML Attribute: render-collapsed-nodes
    */
    @attr({ attribute: "render-collapsed-nodes" })
    public renderCollapsedNodes: boolean;

    /**
     * The currently selected tree item
     * @public
     */
    @observable
    public currentSelected: HTMLElement | TreeItem | null;

    /**
     *  Slotted children
     *
     * @internal
     */
    @observable slottedTreeItems: HTMLElement[];
    private slottedTreeItemsChanged(): void {
        if (this.$fastController.isConnected) {
            // update for slotted children change
            this.setItems();
        }
    }

    /**
     * The tree item that is designated to be in the tab queue.
     *
     * @internal
     */
    public currentFocused: HTMLElement | TreeItem | null = null;

    /**
     * Handle focus events
     *
     * @internal
     */
    public handleFocus = (e: FocusEvent): void => {
        if (this.slottedTreeItems.length < 1) {
            // no child items, nothing to do
            return;
        }

        if (e.target === this) {
            if (this.currentFocused === null) {
                this.currentFocused = this.getValidFocusableItem();
            }

            if (this.currentFocused !== null) {
                TreeItem.focusItem(this.currentFocused);
            }

            return;
        }

        if (this.contains(e.target as Node)) {
            this.setAttribute("tabindex", "-1");
            this.currentFocused = e.target as HTMLElement;
        }
    };

    /**
     * Handle blur events
     *
     * @internal
     */
    public handleBlur = (e: FocusEvent): void => {
        if (
            e.target instanceof HTMLElement &&
            (e.relatedTarget === null || !this.contains(e.relatedTarget as Node))
        ) {
            this.setAttribute("tabindex", "0");
        }
    };

    /**
     * ref to the tree item
     *
     * @internal
     */
    public treeView: HTMLElement;

    private nested: boolean;

    public connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute("tabindex", "0");
        DOM.queueUpdate(() => {
            this.setItems();
        });
    }

    /**
     * KeyDown handler
     *
     *  @internal
     */
    public handleKeyDown = (e: KeyboardEvent): boolean | void => {
        if (e.defaultPrevented) {
            return;
        }

        if (this.slottedTreeItems.length < 1) {
            return true;
        }

        const treeItems: HTMLElement[] | void = this.getVisibleNodes();

        switch (e.key) {
            case keyHome:
                if (treeItems.length) {
                    TreeItem.focusItem(treeItems[0]);
                }
                return;
            case keyEnd:
                if (treeItems.length) {
                    TreeItem.focusItem(treeItems[treeItems.length - 1]);
                }
                return;
            case keyArrowLeft:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    const item = e.target as HTMLElement;
                    if (item instanceof TreeItem && item.childItemLength() > 0) {
                        item.expanded = false;
                    }
                }
                return false;
            case keyArrowRight:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    const item = e.target as HTMLElement;
                    if (item instanceof TreeItem && item.childItemLength() > 0) {
                        item.expanded = true;
                    }
                }
                return;
            case keyArrowDown:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    this.focusNextNode(1, e.target as TreeItem);
                }
                return;
            case keyArrowUp:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    this.focusNextNode(-1, e.target as TreeItem);
                }
                return;
            case keyEnter:
                // In single-select trees where selection does not follow focus (see note below),
                // the default action is typically to select the focused node.
                this.handleClick(e as Event);
                return;
        }

        // don't prevent default if we took no action
        return true;
    };

    /**
     * Handles click events bubbling up
     *
     *  @internal
     */
    public handleClick(e: Event): boolean | void {
        if (e.defaultPrevented) {
            // handled, do nothing
            return;
        }

        if (!(e.target instanceof Element) || !isTreeItemElement(e.target as Element)) {
            // not a tree item, ignore
            return true;
        }

        const item: TreeItem = e.target as TreeItem;

        if (!item.disabled) {
            item.selected = !item.selected;
        }

        return;
    }

    /**
     * Handles the selected-changed events bubbling up
     * from child tree items
     *
     *  @internal
     */
    public handleSelectedChange = (e: Event): boolean | void => {
        if (e.defaultPrevented) {
            return;
        }

        if (!(e.target instanceof Element) || !isTreeItemElement(e.target as Element)) {
            return true;
        }

        const item: TreeItem = e.target as TreeItem;

        if (item.selected) {
            if (this.currentSelected && this.currentSelected !== item) {
                (this.currentSelected as TreeItem).selected = false;
            }
            // new selected item
            this.currentSelected = item;
        } else if (!item.selected && this.currentSelected === item) {
            // selected item deselected
            this.currentSelected = null;
        }

        return;
    };

    /**
     * Move focus to a tree item based on its offset from the provided item
     */
    private focusNextNode(delta: number, item: TreeItem): void {
        const visibleNodes: HTMLElement[] | void = this.getVisibleNodes();
        if (!visibleNodes) {
            return;
        }

        const focusItem = visibleNodes[visibleNodes.indexOf(item) + delta];
        if (isHTMLElement(focusItem)) {
            TreeItem.focusItem(focusItem);
        }
    }

    /**
     * Updates the tree view when slottedTreeItems changes
     */
    private setItems = (): void => {
        // force single selection
        // defaults to first one found
        const selectedItem: HTMLElement | null = this.treeView.querySelector(
            "[aria-selected='true']"
        );
        this.currentSelected = selectedItem;

        // invalidate the current focused item if it is no longer valid
        if (this.currentFocused === null || !this.contains(this.currentFocused)) {
            this.currentFocused = this.getValidFocusableItem();
        }

        // toggle properties on child elements
        this.nested = this.checkForNestedItems();

        const treeItems: HTMLElement[] | void = this.getVisibleNodes();
        treeItems.forEach(node => {
            if (isTreeItemElement(node)) {
                (node as TreeItem).nested = this.nested;
            }
        });
    };

    /**
     * checks if there are any nested tree items
     */
    private getValidFocusableItem(): null | HTMLElement | TreeItem {
        const treeItems: HTMLElement[] | void = this.getVisibleNodes();
        // default to selected element if there is one
        let focusIndex = treeItems.findIndex(this.isSelectedElement);
        if (focusIndex === -1) {
            // otherwise first focusable tree item
            focusIndex = treeItems.findIndex(this.isFocusableElement);
        }
        if (focusIndex !== -1) {
            return treeItems[focusIndex];
        }

        return null;
    }

    /**
     * checks if there are any nested tree items
     */
    private checkForNestedItems(): boolean {
        return this.slottedTreeItems.some((node: HTMLElement) => {
            return isTreeItemElement(node) && node.querySelector("[role='treeitem']");
        });
    }

    /**
     * check if the item is focusable
     */
    private isFocusableElement = (el: Element): el is HTMLElement => {
        return isTreeItemElement(el);
    };

    private isSelectedElement = (el: TreeItem): el is TreeItem => {
        return el.selected;
    };

    private getVisibleNodes(): HTMLElement[] {
        return getDisplayedNodes(this, "[role='treeitem']") || [];
    }
}
