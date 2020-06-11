import {
    attr,
    FASTElement,
    Notifier,
    Observable,
    observable,
    DOM,
} from "@microsoft/fast-element";
import {
    getDisplayedNodes,
    isHTMLElement,
    keyCodeArrowDown,
    keyCodeArrowLeft,
    keyCodeArrowRight,
    keyCodeArrowUp,
    keyCodeEnter,
    keyCodeSpace,
} from "@microsoft/fast-web-utilities";
import { StartEnd } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { TreeView } from "../tree-view";

export class TreeItem extends FASTElement {
    @attr({ mode: "boolean" })
    public expanded: boolean = false;

    @attr({ mode: "boolean" })
    public selected: boolean;

    @attr({ mode: "boolean" })
    public disabled: boolean;

    public expandCollapseButton: HTMLDivElement;

    @observable
    public focusable: boolean = false;

    @observable
    public hasItems: boolean;

    public items: HTMLSlotElement;
    public handleItemsChange(): void {
        // we only want to project the slot of there will be items
        this.hasItems = this.querySelectorAll("[slot='item']").length > 0;

        if (this.$fastController.isConnected) {
            this.items.assignedNodes().forEach((node: HTMLElement) => {
                if (node instanceof TreeItem) {
                    (node as TreeItem).nested = true;
                }
            });
        }
    }

    @observable
    public nested: boolean;

    @observable
    public renderCollapsedChildren: boolean;

    private notifier: Notifier;

    constructor() {
        super();
        this.handleItemsChange();
    }

    private getParentTreeNode(): TreeView | null | undefined {
        const parentNode: Element | null | undefined = this.parentElement!.closest(
            "[role='tree']"
        );
        return parentNode as TreeView;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        const parentTreeNode: TreeView | null | undefined = this.getParentTreeNode();
        if (parentTreeNode) {
            if (parentTreeNode.hasAttribute("render-collapsed-nodes")) {
                this.renderCollapsedChildren =
                    parentTreeNode.getAttribute("render-collapsed-nodes") === "true";
            }
            this.notifier = Observable.getNotifier(parentTreeNode);
            this.notifier.subscribe(this, "renderCollapsedNodes");
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.notifier) {
            this.notifier.unsubscribe(this, "renderCollapsedNodes");
        }
    }

    public handleChange(source: any, propertyName: string) {
        switch (propertyName) {
            case "renderCollapsedNodes":
                this.renderCollapsedChildren = (source as TreeView).renderCollapsedNodes;
                break;
        }
    }

    public handleFocus = (e: Event): void => {
        if (e.target === e.currentTarget) {
            this.focusable = true;
        }
    };

    public handleBlur = (e: FocusEvent): void => {
        if (e.target !== e.currentTarget) {
            return;
        }

        this.focusable = false;
    };

    public handleKeyDown = (e: KeyboardEvent): void | boolean => {
        if (e.target !== e.currentTarget) {
            return;
        }

        switch (e.keyCode) {
            case keyCodeArrowLeft:
                this.handleArrowLeft();
                break;
            case keyCodeArrowRight:
                this.handleArrowRight();
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
                this.handleSelected(e);
                break;
            case keyCodeSpace:
                this.handleSpaceBar();
                break;
        }

        return true;
    };

    public handleExpandCollapseButtonClick = (): void => {
        if (!this.disabled) {
            this.setExpanded(!this.expanded);
        }
    };

    public handleContainerClick = (e: MouseEvent): void => {
        const expandButton: HTMLElement | null = this.expandCollapseButton;
        const isButtonAnHTMLElement: boolean = isHTMLElement(expandButton);
        if (
            (!isButtonAnHTMLElement ||
                (isButtonAnHTMLElement && expandButton !== e.target)) &&
            !this.disabled
        ) {
            this.handleSelected(e);
        }
    };

    private handleArrowLeft(): void {
        if (this.expanded) {
            this.setExpanded(false);
        } else if (isHTMLElement(this.parentElement)) {
            const parentTreeItemNode:
                | Element
                | null
                | undefined = this.parentElement!.closest("[role='treeitem']");

            if (isHTMLElement(parentTreeItemNode)) {
                (parentTreeItemNode as HTMLElement).focus();
            }
        }
    }

    private handleArrowRight(): void {
        if (typeof this.expanded !== "boolean") {
            return;
        }

        if (!this.expanded) {
            this.setExpanded(true);
        } else {
            this.focusNextNode(1);
        }
    }

    private handleSpaceBar(): void {
        if (typeof this.expanded !== "boolean") {
            return;
        }
        this.setExpanded(!this.expanded);
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
                nextElement.focus();
            }
        }
    }

    private getVisibleNodes(): HTMLElement[] | void {
        return getDisplayedNodes(this.getTreeRoot()!, "[role='treeitem']");
    }

    private getTreeRoot(): HTMLElement | null {
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
        if (this.hasItems) {
            this.expanded = expanded;
            this.$emit("expanded-change", this);
        }
    }
}

/* eslint-disable-next-line */
export interface TreeItem extends StartEnd {}
applyMixins(TreeItem, StartEnd);
