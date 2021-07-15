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
import { attr, DOM, observable } from "@microsoft/fast-element";
import { keyCodeEnd, keyCodeHome } from "@microsoft/fast-web-utilities";
import { isTreeItemElement, TreeItem } from "../tree-item";
import { FoundationElement } from "../foundation-element";
/**
 * A Tree view Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#TreeView | ARIA TreeView }.
 *
 * @public
 */
export class TreeView extends FoundationElement {
    constructor() {
        super(...arguments);
        this.handleBlur = e => {
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
        this.handleKeyDown = e => {
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
        this.setItems = () => {
            const focusIndex = this.treeItems.findIndex(this.isFocusableElement);
            for (let item = 0; item < this.treeItems.length; item++) {
                if (
                    item === focusIndex &&
                    !this.treeItems[item].hasAttribute("disabled")
                ) {
                    this.treeItems[item].setAttribute("tabindex", "0");
                }
                this.treeItems[item].addEventListener(
                    "selected-change",
                    this.handleItemSelected
                );
            }
        };
        this.resetItems = () => {
            for (let item = 0; item < this.treeItems.length; item++) {
                this.treeItems[item].removeEventListener(
                    "selected-change",
                    this.handleItemSelected
                );
            }
        };
        this.handleItemSelected = e => {
            const newSelection = e.target;
            if (newSelection !== this.currentSelected) {
                if (this.currentSelected) {
                    // TODO: fix this below, shouldn't need both
                    this.currentSelected.removeAttribute("selected");
                    this.currentSelected.selected = false;
                }
                this.currentSelected = newSelection;
            }
        };
        /**
         * check if the item is focusable
         */
        this.isFocusableElement = el => {
            return isTreeItemElement(el) && !this.isDisabledElement(el);
        };
        /**
         * check if the item is disabled
         */
        this.isDisabledElement = el => {
            return isTreeItemElement(el) && el.getAttribute("aria-disabled") === "true";
        };
    }
    slottedTreeItemsChanged(oldValue, newValue) {
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
                        node.nested = true;
                    }
                });
            }
        }
    }
    checkForNestedItems() {
        return this.slottedTreeItems.some(node => {
            return isTreeItemElement(node) && node.querySelector("[role='treeitem']");
        });
    }
    connectedCallback() {
        super.connectedCallback();
        this.treeItems = this.getVisibleNodes();
        DOM.queueUpdate(() => {
            //only supporting single select
            const node = this.treeView.querySelector("[aria-selected='true']");
            if (node) {
                this.currentSelected = node;
            }
        });
    }
    getVisibleNodes() {
        const treeItems = [];
        if (this.slottedTreeItems !== undefined) {
            this.slottedTreeItems.forEach(item => {
                if (isTreeItemElement(item)) {
                    treeItems.push(item);
                }
            });
        }
        return treeItems;
    }
}
__decorate(
    [attr({ attribute: "render-collapsed-nodes" })],
    TreeView.prototype,
    "renderCollapsedNodes",
    void 0
);
__decorate([observable], TreeView.prototype, "currentSelected", void 0);
__decorate([observable], TreeView.prototype, "nested", void 0);
__decorate([observable], TreeView.prototype, "slottedTreeItems", void 0);
