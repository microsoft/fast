import {
    attr,
    FASTElement,
    Notifier,
    observable,
    Observable,
} from "@microsoft/fast-element";
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
import type { TreeView } from "../tree-view";
import { applyMixins } from "../utilities/apply-mixins";

/**
 * check if the item is a tree item
 * @public
 * @remarks
 * determines if element is an HTMLElement and if it has the role treeitem
 */
export function isTreeItemElement(el: Element): el is HTMLElement {
    return isHTMLElement(el) && (el.getAttribute("role") as string) === "treeitem";
}

/**
 * A Tree item Custom HTML Element.
 *
 * @public
 */
export class TreeItem extends FASTElement {
    /**
     * When true, the control will be appear expanded by user interaction.
     * @public
     * @remarks
     * HTML Attribute: expanded
     */
    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    /**
     * When true, the control will appear selected by user interaction.
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ mode: "boolean" })
    public selected: boolean;

    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    public expandCollapseButton: HTMLDivElement;

    @observable
    public focusable: boolean = false;

    @observable
    public childItems: HTMLElement[];

    @observable
    public items: HTMLElement[];
    private itemsChanged(oldValue, newValue): void {
        if (this.$fastController.isConnected) {
            this.items.forEach((node: HTMLElement) => {
                if (isTreeItemElement(node)) {
                    // TODO: maybe not require it to be a TreeItem?
                    (node as TreeItem).nested = true;
                }
            });
            this.enabledChildTreeItems = this.items.filter((item: HTMLElement) => {
                return isTreeItemElement(item) && !item.hasAttribute("disabled");
            });
        }
    }

    /**
     * @internal
     */
    @observable
    public nested: boolean;

    @observable
    public renderCollapsedChildren: boolean;

    private notifier: Notifier;
    private enabledChildTreeItems: HTMLElement[] = [];

    private getParentTreeNode(): HTMLElement | null | undefined {
        const parentNode: Element | null | undefined = this.parentElement!.closest(
            "[role='tree']"
        );
        return parentNode as HTMLElement;
    }

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        const parentTreeNode: HTMLElement | null | undefined = this.getParentTreeNode();

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
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.notifier) {
            this.notifier.unsubscribe(this, "renderCollapsedNodes");
        }
    }

    /**
     * Places document focus on a tree item and adds the item to the sequential tab order.
     * @param el - the element to focus
     */
    public static focusItem(el: HTMLElement) {
        el.setAttribute("tabindex", "0");
        (el as TreeItem).focusable = true;
        el.focus();
    }

    public handleChange(source: any, propertyName: string) {
        switch (propertyName) {
            case "renderCollapsedNodes":
                this.renderCollapsedChildren = (source as TreeView).renderCollapsedNodes;
                break;
        }
    }

    /**
     * @deprecated - no longer needed.
     * @param e - Event object
     */
    /* eslint-disable-next-line */
    public handleFocus = (e: Event): void => {};

    /**
     * @deprecated - no longer needed.
     * @param e - Event object
     */
    /* eslint-disable-next-line */
    public handleBlur = (e: FocusEvent): void => {};

    /**
     * The keyboarding on treeview should conform to the following spec
     * https://w3c.github.io/aria-practices/#keyboard-interaction-23
     * @param e - Event object for keyDown event
     */
    public handleKeyDown = (e: KeyboardEvent): void | boolean => {
        if (e.target !== e.currentTarget) {
            return true;
        }

        switch (e.keyCode) {
            case keyCodeArrowLeft:
                this.collapseOrFocusParent();
                break;
            case keyCodeArrowRight:
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

    public handleExpandCollapseButtonClick = (e: MouseEvent): void => {
        if (!this.disabled) {
            e.preventDefault();
            this.setExpanded(!this.expanded);
        }
    };

    public handleClick = (e: MouseEvent): void => {
        if (!e.defaultPrevented && !this.disabled) {
            this.handleSelected(e);
        }
    };

    public childItemLength(): number {
        const treeChildren: HTMLElement[] = this.childItems.filter(
            (item: HTMLElement) => {
                return isTreeItemElement(item);
            }
        );
        return treeChildren ? treeChildren.length : 0;
    }

    public readonly isNestedItem = (): boolean => {
        return isTreeItemElement(this.parentElement as Element);
    };

    private collapseOrFocusParent(): void {
        if (this.expanded) {
            this.setExpanded(false);
        } else if (isHTMLElement(this.parentElement)) {
            const parentTreeItemNode:
                | Element
                | null
                | undefined = this.parentElement!.closest("[role='treeitem']");

            if (isHTMLElement(parentTreeItemNode)) {
                TreeItem.focusItem(parentTreeItemNode as HTMLElement);
            }
        }
    }

    private expandOrFocusFirstChild(): void {
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

    private focusNextNode(delta: number): void {
        const visibleNodes: HTMLElement[] | void = this.getVisibleNodes();
        if (!visibleNodes) {
            return;
        }

        const currentIndex: number = visibleNodes.indexOf(this);
        if (currentIndex !== -1) {
            let nextElement: HTMLElement | undefined = visibleNodes[currentIndex + delta];
            if (nextElement !== undefined) {
                while (nextElement.hasAttribute("disabled")) {
                    const offset: number = delta >= 0 ? 1 : -1;
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

    private getVisibleNodes(): HTMLElement[] | void {
        return getDisplayedNodes(this.getTreeRoot()!, "[role='treeitem']");
    }

    private getTreeRoot(): HTMLElement | null {
        /* eslint-disable-next-line  @typescript-eslint/no-this-alias */
        const currentNode: HTMLElement = this;

        if (!isHTMLElement(currentNode)) {
            return null;
        }

        return currentNode.closest("[role='tree']") as HTMLElement;
    }

    private handleSelected(e?: Event): void {
        this.selected = !this.selected;
        this.$emit("selected-change", e);
    }

    private setExpanded(expanded: boolean): void {
        this.expanded = expanded;
        this.$emit("expanded-change", this);
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast-dna/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface TreeItem extends StartEnd {}
applyMixins(TreeItem, StartEnd);
