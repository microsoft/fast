import { FastElement, observable } from "@microsoft/fast-element";
import {
    isHTMLElement,
    keyCodeHome,
    keyCodeEnd,
    getDisplayedNodes,
} from "@microsoft/fast-web-utilities";

export class TreeView extends FastElement {
    public treeView: HTMLElement;

    @observable
    public focusable: boolean = true;

    @observable
    private lastFocused: HTMLElement;

    public handleBlur = (e: FocusEvent): void => {
        const root: HTMLElement | null = this.treeView;

        /**
         * If we focus outside of the tree
         */
        if (isHTMLElement(root) && !root.contains(e.relatedTarget as HTMLElement)) {
            this.focusable = true;
        }
    };

    public handleFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
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

    public handleKeyDown = (e: KeyboardEvent): void => {
        const nodes: HTMLElement[] | void = this.getVisibleNodes();

        if (!nodes) {
            return;
        }

        switch (e.keyCode) {
            case keyCodeHome:
                if (nodes && nodes.length) {
                    nodes[0].focus();
                }
                break;
            case keyCodeEnd:
                if (nodes && nodes.length) {
                    nodes[nodes.length - 1].focus();
                }
                break;
        }
    };

    public connectedCallback(): void {
        super.connectedCallback();

        this.ensureFocusability();
    }

    private getVisibleNodes(): HTMLElement[] | void {
        return getDisplayedNodes(this.treeView, "[role='treeitem]");
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
