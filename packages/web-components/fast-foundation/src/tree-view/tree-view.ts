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

    @observable
    private nested: boolean;

    @observable slottedTreeItems: HTMLElement[];
    private slottedTreeItemsChanged(oldValue: unknown, newValue: HTMLElement[]): void {
        if (this.$fastController.isConnected) {
            // enforce single select
            this.treeItems.forEach((item: HTMLElement) => {
                if (item instanceof TreeItem) {
                    if (item !== newValue) {
                        (item as TreeItem).selected = false;
                    }
                }
            });
        }
    }

    /**
     *  Slotted children
     *
     * @internal
     */
    @observable slottedTreeItems: HTMLElement[];
    private slottedTreeItemsChanged(): void {
        if (this.$fastController.isConnected) {
            // update for slotted children change
            this.treeItems = this.getVisibleNodes();
            this.setItems();
        }
    }

    /**
     * The tree item that is designated to be in the tab queue.
     * If there is no currentFocused element the tree itself is in
     * the tab queue (ie. tabindex = 0)
     *
     * @internal
     */
    @observable
    public currentFocused: HTMLElement | TreeItem | null = null;
    private currentFocusedChanged(oldFocusItem, newFocusItemj): void {
        if (this.$fastController.isConnected) {
            this.treeItems.forEach((item: HTMLElement) => {
                if (item instanceof TreeItem) {
                    if (item !== newFocusItemj) {
                        item.setAttribute("tabindex", "-1");
                    }
                }
            });
            if (isTreeItemElement(newFocusItemj)) {
                (newFocusItemj as HTMLElement).setAttribute("tabindex", "0");
                this.setAttribute("tabindex", "-1");
            } else {
                // make the tree focusable
                this.setAttribute("tabindex", "0");
            }
        }
    }

    /**
     * Handle a bubbled focus event
     *
     * @internal
     */
    public handleFocus = (e: FocusEvent): void => {
        if (e.target === this) {
            // if the tree view gets focus shift it to a valid tree item if possible

            // if we have a currentFocus element
            // focus on that
            if (this.currentFocused !== null) {
                this.currentFocused.focus();
                return;
            }

            // otherwise use the first one we find
            const newFocusItem:
                | null
                | HTMLElement
                | TreeItem = this.getValidFocusableItem();
            if (newFocusItem !== null) {
                newFocusItem.focus();
            }
            return;
        }

        if (
            this.contains(e.target as Element) &&
            this.isFocusableElement(e.target as Element)
        ) {
            // focus event is from a valid tree item child
            //  it becomes currentFocused
            this.currentFocused = e.target as HTMLElement;
            return;
        }
    };

    /**
     * ref to the tree item
     *
     * @internal
     */
    public treeView: HTMLElement;

    private treeItems: HTMLElement[];
    private nested: boolean;

    public connectedCallback(): void {
        super.connectedCallback();
        this.setAttribute("tabindex", "0");
        this.setItems();
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

        if (!this.treeItems) {
            return true;
        }

        switch (e.key) {
            case keyHome:
                if (this.treeItems && this.treeItems.length) {
                    TreeItem.focusItem(this.treeItems[0]);
                }
                return;
            case keyEnd:
                if (this.treeItems && this.treeItems.length) {
                    TreeItem.focusItem(this.treeItems[this.treeItems.length - 1]);
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

        if (item.selected && this.currentSelected !== item) {
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
        this.treeItems = this.getVisibleNodes();

        // force single selection
        // defaults to first one found
        const selectedItem: HTMLElement | null = this.treeView.querySelector(
            "[aria-selected='true']"
        );
        this.currentSelected = selectedItem;

        // invalidate the current focused item if it is no longer valid
        if (this.currentFocused !== null && !this.contains(this.currentFocused)) {
            this.currentFocused = this.getValidFocusableItem();
        }

        // toggle the nested attribute on child elements
        this.nested = this.checkForNestedItems();
        this.slottedTreeItems.forEach(node => {
            if (isTreeItemElement(node)) {
                (node as TreeItem).nested = this.nested;
            }
        });
    };

    /**
     * checks if there are any nested tree items
     */
    private getValidFocusableItem(): null | HTMLElement | TreeItem {
        // default to selected element if there is one
        let focusIndex = this.treeItems.findIndex(this.isSelectedElement);
        if (focusIndex === -1) {
            // otherwise first focusable tree item
            focusIndex = this.treeItems.findIndex(this.isFocusableElement);
        }
        if (focusIndex !== -1) {
            return this.treeItems[focusIndex];
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
