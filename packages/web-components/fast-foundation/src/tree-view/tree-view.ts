import { attr, DOM, observable } from "@microsoft/fast-element";
import {
    getDisplayedNodes,
    isHTMLElement,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnd,
    keyCodeEnter,
    keyCodeHome,
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
            this.resetItems();
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
            relatedTarget === null ||
            (relatedTarget instanceof HTMLElement &&
                target instanceof HTMLElement &&
                !this.contains(relatedTarget))
        ) {
            const treeView = this as HTMLElement;
            treeView.setAttribute("tabindex", "0");
        }
    };

    public handleFocus = (e: FocusEvent): void => {
        const { relatedTarget, target } = e;

        if (
            relatedTarget === null ||
            (relatedTarget instanceof HTMLElement &&
                target instanceof HTMLElement &&
                !this.contains(relatedTarget))
        ) {
            const treeView = this as HTMLElement;
            if (this.currentFocused instanceof TreeItem) {
                TreeItem.focusItem(this.currentFocused);
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
        if (!this.treeItems) {
            return true;
        }

        switch (e.key) {
            case keyCodeHome:
                if (this.treeItems && this.treeItems.length) {
                    TreeItem.focusItem(this.treeItems[0]);
                }
                break;
            case keyCodeEnd:
                if (this.treeItems && this.treeItems.length) {
                    TreeItem.focusItem(this.treeItems[this.treeItems.length - 1]);
                }
                break;
            case keyCodeArrowLeft:
                e.preventDefault();
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    const item = e.target as HTMLElement;
                    if (item instanceof TreeItem && item.childItemLength() > 0) {
                        item.expanded = false;
                    }
                }
                break;
            case keyCodeArrowRight:
                e.preventDefault();
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    const item = e.target as HTMLElement;
                    if (item instanceof TreeItem && item.childItemLength() > 0) {
                        item.expanded = true;
                    }
                }
                break;
            case keyCodeArrowDown:
                e.preventDefault();
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    this.focusNextNode(1, e.target as HTMLElement);
                }
                break;
            case keyCodeArrowUp:
                e.preventDefault();
                if (e.target && this.isFocusableElement(e.target as HTMLElement)) {
                    this.focusNextNode(-1, e.target as HTMLElement);
                }
                break;
            case keyCodeEnter:
                // In single-select trees where selection does not follow focus (see note below),
                // the default action is typically to select the focused node.
                this.handleSelected(e.target as HTMLElement);
                break;
            default:
                return true;
        }
    };

    private focusNextNode(delta: number, item: HTMLElement): void {
        const visibleNodes: HTMLElement[] | void = this.getVisibleNodes();
        if (!visibleNodes) {
            return;
        }

        if (item instanceof TreeItem) {
            visibleNodes[visibleNodes.indexOf(item)].setAttribute("tabindex", "-1");
            const focusItem = visibleNodes[visibleNodes.indexOf(item) + delta];
            if (isHTMLElement(focusItem)) {
                TreeItem.focusItem(focusItem);
                this.currentFocused = focusItem;
            }
        }
    }

    private setItems = (): void => {
        const focusIndex = this.treeItems.findIndex(this.isFocusableElement);

        for (let item: number = 0; item < this.treeItems.length; item++) {
            if (item === focusIndex) {
                this.treeItems[item].setAttribute("tabindex", "0");
                this.currentFocused = this.treeItems[item];
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

    private handleSelected(item: HTMLElement): void {
        if (item instanceof TreeItem) {
            if (this.currentSelected !== item) {
                if (this.currentSelected instanceof TreeItem) {
                    this.currentSelected.selected = false;
                    this.currentSelected.setAttribute("tabindex", "-1");
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
                }
                item.setAttribute("tabindex", "0");
                this.currentFocused = item;
                this.currentSelected = item;
            }
        }
    }

    private handleItemSelected = (e: CustomEvent): void => {
        const newSelection: HTMLElement = e.target as HTMLElement;
        if (newSelection !== this.currentSelected) {
            this.handleSelected(newSelection);
        }
    };

    /**
     * check if the item is focusable
     */
    private isFocusableElement = (el: Element): el is HTMLElement => {
        return isTreeItemElement(el);
    };

    private getVisibleNodes(): HTMLElement[] {
        return getDisplayedNodes(this, "[role='treeitem']") || [];
    }
}
