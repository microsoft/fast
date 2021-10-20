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
    public treeView: HTMLElement;

    @attr({ attribute: "render-collapsed-nodes" })
    public renderCollapsedNodes: boolean;

    @observable
    public currentSelected: HTMLElement | TreeItem | null;

    @observable
    private nested: boolean;

    @observable slottedTreeItems: HTMLElement[];
    private slottedTreeItemsChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            // filter the tree items until that's done for us in the framework
            this.treeItems = this.getVisibleNodes();
            this.setItems();

            // check if any tree items have nested items
            // if they do, apply the nested attribute
            if (this.checkForNestedItems()) {
                this.slottedTreeItems.forEach(node => {
                    if (isTreeItemElement(node)) {
                        (node as TreeItem).nested = true;
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

    public currentFocused: HTMLElement | TreeItem | null;

    private treeItems: HTMLElement[];

    public handleBlur = (e: FocusEvent): void => {
        const { relatedTarget, target } = e;
        if (
            target instanceof HTMLElement &&
            (relatedTarget === null || !this.contains(relatedTarget as Node))
        ) {
            this.setAttribute("tabindex", "0");
        }
    };

    public handleFocus = (e: FocusEvent): void => {
        const { relatedTarget, target } = e;

        if (
            target instanceof HTMLElement &&
            (relatedTarget === null || !this.contains(relatedTarget as Node))
        ) {
            const treeView = this as HTMLElement;
            if (target === this && this.currentFocused instanceof TreeItem) {
                TreeItem.focusItem(this.currentFocused);
                this.currentFocused.setAttribute("tabindex", "0");
            }
            treeView.setAttribute("tabindex", "-1");
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
    }

    public handleKeyDown = (e: KeyboardEvent): void | boolean => {
        if (e.defaultPrevented) {
            return false;
        }

        if (!this.treeItems) {
            return true;
        }

        switch (e.key) {
            case keyHome:
                if (this.treeItems && this.treeItems.length) {
                    TreeItem.focusItem(this.treeItems[0]);
                    this.treeItems[0].setAttribute("tabindex", "0");
                }
                break;
            case keyEnd:
                if (this.treeItems && this.treeItems.length) {
                    TreeItem.focusItem(this.treeItems[this.treeItems.length - 1]);
                    this.treeItems[this.treeItems.length - 1].setAttribute(
                        "tabindex",
                        "0"
                    );
                }
                break;
            case keyArrowLeft:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    const item = e.target as HTMLElement;
                    if (item instanceof TreeItem && item.childItemLength() > 0) {
                        item.expanded = false;
                    }
                }
                break;
            case keyArrowRight:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    const item = e.target as HTMLElement;
                    if (item instanceof TreeItem && item.childItemLength() > 0) {
                        item.expanded = true;
                    }
                }
                break;
            case keyArrowDown:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    this.focusNextNode(1, e.target as TreeItem);
                }
                break;
            case keyArrowUp:
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    this.focusNextNode(-1, e.target as TreeItem);
                }
                break;
            case keyEnter:
                // In single-select trees where selection does not follow focus (see note below),
                // the default action is typically to select the focused node.
                this.handleClick(e as Event);
                break;
            default:
                return true;
        }
    };

    private focusNextNode(delta: number, item: TreeItem): void {
        const visibleNodes: HTMLElement[] | void = this.getVisibleNodes();
        if (!visibleNodes) {
            return;
        }

        const index = visibleNodes.indexOf(item);
        const lastItem = visibleNodes[index];
        if (delta < 0 && index > 0) {
            lastItem.setAttribute("tabindex", "-1");
        } else if (delta > 0 && index < visibleNodes.length - 1) {
            lastItem.setAttribute("tabindex", "-1");
        }
        const focusItem = visibleNodes[visibleNodes.indexOf(item) + delta];
        if (isHTMLElement(focusItem)) {
            TreeItem.focusItem(focusItem);
            focusItem.setAttribute("tabindex", "0");
            this.currentFocused = focusItem;
        }
    }

    private setItems = (): void => {
        let focusIndex = this.treeItems.findIndex(this.isSelectedElement);
        if (focusIndex === -1) {
            focusIndex = this.treeItems.findIndex(this.isFocusableElement);
        }

        for (let item: number = 0; item < this.treeItems.length; item++) {
            if (item === focusIndex) {
                this.treeItems[item].setAttribute("tabindex", "0");
                this.currentFocused = this.treeItems[item];
            }
        }
    };

    public handleClick(e: Event): boolean {
        if (
            e.defaultPrevented ||
            !(e.target instanceof HTMLElement) ||
            !isTreeItemElement(e.target as HTMLElement)
        ) {
            return true;
        }

        const item: TreeItem = e.target as TreeItem;

        if (this.currentSelected !== item) {
            item.setAttribute("tabindex", "0");
            if (this.currentSelected instanceof TreeItem && this.currentFocused) {
                if (!item.disabled) {
                    this.currentSelected.selected = false;
                }
                this.currentFocused.setAttribute("tabindex", "-1");
            }
            if (!this.currentSelected) {
                this.slottedTreeItems.forEach((item: HTMLElement) => {
                    if (item instanceof TreeItem) {
                        item.setAttribute("tabindex", "-1");
                    }
                });
            }
            if (!item.disabled) {
                item.selected = true;
                this.currentSelected = item;
            }
            this.currentFocused = item;
        }

        return false;
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
