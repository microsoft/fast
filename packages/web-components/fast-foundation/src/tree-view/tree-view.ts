import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import { keyCodeEnd, keyCodeHome } from "@microsoft/fast-web-utilities";
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

    /**
     * @deprecated - the tree itself is no longer a focusable area.
     */
    @observable
    public focusable: boolean = true;

    @observable
    public currentSelected: HTMLElement | TreeItem | null;

    /**
     * @deprecated - this property is no longer needed.
     */
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

    private treeItems: HTMLElement[];

    public handleBlur = (e: FocusEvent): void => {
        const { relatedTarget, target } = e;

        /**
         * Clean up previously focused item's tabindex if we've moved to another item in the tree
         */
        if (
            relatedTarget instanceof HTMLElement &&
            target instanceof HTMLElement &&
            this.contains(relatedTarget)
        ) {
            target.removeAttribute("tabindex");
        }
    };

    /**
     * @deprecated - no longer needed
     */
    /* eslint-disable-next-line */
    public handleFocus = (e: FocusEvent): void => {};

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

        switch (e.keyCode) {
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
}
