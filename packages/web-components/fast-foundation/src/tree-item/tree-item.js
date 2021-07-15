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
import { attr, observable, Observable } from "@microsoft/fast-element";
import {
    getDisplayedNodes,
    isHTMLElement,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnter,
} from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { FoundationElement } from "../foundation-element";
/**
 * check if the item is a tree item
 * @public
 * @remarks
 * determines if element is an HTMLElement and if it has the role treeitem
 */
export function isTreeItemElement(el) {
    return isHTMLElement(el) && el.getAttribute("role") === "treeitem";
}
/**
 * A Tree item Custom HTML Element.
 *
 * @public
 */
export class TreeItem extends FoundationElement {
    constructor() {
        super(...arguments);
        /**
         * When true, the control will be appear expanded by user interaction.
         * @public
         * @remarks
         * HTML Attribute: expanded
         */
        this.expanded = false;
        this.focusable = false;
        this.enabledChildTreeItems = [];
        /**
         * The keyboarding on treeview should conform to the following spec
         * https://w3c.github.io/aria-practices/#keyboard-interaction-23
         * @param e - Event object for keyDown event
         */
        this.handleKeyDown = e => {
            if (e.target !== e.currentTarget) {
                return true;
            }
            switch (e.keyCode) {
                case keyCodeArrowLeft:
                    // preventDefault to ensure we don't scroll the page
                    e.preventDefault();
                    this.collapseOrFocusParent();
                    break;
                case keyCodeArrowRight:
                    // preventDefault to ensure we don't scroll the page
                    e.preventDefault();
                    this.expandOrFocusFirstChild();
                    break;
                case keyCodeArrowDown:
                    // preventDefault to ensure we don't scroll the page
                    e.preventDefault();
                    this.focusNextNode(1);
                    break;
                case keyCodeArrowUp:
                    // preventDefault to ensure we don't scroll the page
                    e.preventDefault();
                    this.focusNextNode(-1);
                    break;
                case keyCodeEnter:
                    // In single-select trees where selection does not follow focus (see note below),
                    // the default action is typically to select the focused node.
                    this.handleSelected(e);
                    break;
            }
            return true;
        };
        this.handleExpandCollapseButtonClick = e => {
            if (!this.disabled) {
                e.preventDefault();
                this.setExpanded(!this.expanded);
            }
        };
        this.handleClick = e => {
            if (!e.defaultPrevented && !this.disabled) {
                this.handleSelected(e);
            }
        };
        this.isNestedItem = () => {
            return isTreeItemElement(this.parentElement);
        };
    }
    itemsChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.items.forEach(node => {
                if (isTreeItemElement(node)) {
                    // TODO: maybe not require it to be a TreeItem?
                    node.nested = true;
                }
            });
            this.enabledChildTreeItems = this.items.filter(item => {
                return isTreeItemElement(item) && !item.hasAttribute("disabled");
            });
        }
    }
    getParentTreeNode() {
        const parentNode = this.parentElement.closest("[role='tree']");
        return parentNode;
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        const parentTreeNode = this.getParentTreeNode();
        if (parentTreeNode) {
            if (parentTreeNode.hasAttribute("render-collapsed-nodes")) {
                this.renderCollapsedChildren =
                    parentTreeNode.getAttribute("render-collapsed-nodes") === "true";
            }
            this.notifier = Observable.getNotifier(parentTreeNode);
            this.notifier.subscribe(this, "renderCollapsedNodes");
        }
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.notifier) {
            this.notifier.unsubscribe(this, "renderCollapsedNodes");
        }
    }
    /**
     * Places document focus on a tree item and adds the item to the sequential tab order.
     * @param el - the element to focus
     */
    static focusItem(el) {
        el.setAttribute("tabindex", "0");
        el.focusable = true;
        el.focus();
    }
    handleChange(source, propertyName) {
        switch (propertyName) {
            case "renderCollapsedNodes":
                this.renderCollapsedChildren = source.renderCollapsedNodes;
                break;
        }
    }
    childItemLength() {
        const treeChildren = this.childItems.filter(item => {
            return isTreeItemElement(item);
        });
        return treeChildren ? treeChildren.length : 0;
    }
    collapseOrFocusParent() {
        if (this.expanded) {
            this.setExpanded(false);
        } else if (isHTMLElement(this.parentElement)) {
            const parentTreeItemNode = this.parentElement.closest("[role='treeitem']");
            if (isHTMLElement(parentTreeItemNode)) {
                TreeItem.focusItem(parentTreeItemNode);
            }
        }
    }
    expandOrFocusFirstChild() {
        if (typeof this.expanded !== "boolean") {
            return;
        }
        if (!this.expanded && this.childItemLength() > 0) {
            this.setExpanded(true);
        } else {
            if (this.enabledChildTreeItems.length > 0) {
                TreeItem.focusItem(this.enabledChildTreeItems[0]);
            }
        }
    }
    focusNextNode(delta) {
        const visibleNodes = this.getVisibleNodes();
        if (!visibleNodes) {
            return;
        }
        const currentIndex = visibleNodes.indexOf(this);
        if (currentIndex !== -1) {
            let nextElement = visibleNodes[currentIndex + delta];
            if (nextElement !== undefined) {
                while (nextElement.hasAttribute("disabled")) {
                    const offset = delta >= 0 ? 1 : -1;
                    nextElement = visibleNodes[currentIndex + delta + offset];
                    if (!nextElement) {
                        break;
                    }
                }
            }
            if (isHTMLElement(nextElement)) {
                TreeItem.focusItem(nextElement);
            }
        }
    }
    getVisibleNodes() {
        return getDisplayedNodes(this.getTreeRoot(), "[role='treeitem']");
    }
    getTreeRoot() {
        /* eslint-disable-next-line  @typescript-eslint/no-this-alias */
        const currentNode = this;
        if (!isHTMLElement(currentNode)) {
            return null;
        }
        return currentNode.closest("[role='tree']");
    }
    handleSelected(e) {
        this.selected = !this.selected;
        this.$emit("selected-change", e);
    }
    setExpanded(expanded) {
        this.expanded = expanded;
        this.$emit("expanded-change", this);
    }
}
__decorate([attr({ mode: "boolean" })], TreeItem.prototype, "expanded", void 0);
__decorate([attr({ mode: "boolean" })], TreeItem.prototype, "selected", void 0);
__decorate([attr({ mode: "boolean" })], TreeItem.prototype, "disabled", void 0);
__decorate([observable], TreeItem.prototype, "focusable", void 0);
__decorate([observable], TreeItem.prototype, "childItems", void 0);
__decorate([observable], TreeItem.prototype, "items", void 0);
__decorate([observable], TreeItem.prototype, "nested", void 0);
__decorate([observable], TreeItem.prototype, "renderCollapsedChildren", void 0);
applyMixins(TreeItem, StartEnd);
