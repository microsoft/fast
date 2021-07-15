import { TreeItem } from "../tree-item";
import { FoundationElement } from "../foundation-element";
/**
 * A Tree view Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria-practices/#TreeView | ARIA TreeView }.
 *
 * @public
 */
export declare class TreeView extends FoundationElement {
    treeView: HTMLElement;
    renderCollapsedNodes: boolean;
    currentSelected: HTMLElement | TreeItem | null;
    private nested;
    slottedTreeItems: HTMLElement[];
    private slottedTreeItemsChanged;
    private checkForNestedItems;
    private treeItems;
    handleBlur: (e: FocusEvent) => void;
    connectedCallback(): void;
    handleKeyDown: (e: KeyboardEvent) => void | boolean;
    private setItems;
    private resetItems;
    private handleItemSelected;
    /**
     * check if the item is focusable
     */
    private isFocusableElement;
    /**
     * check if the item is disabled
     */
    private isDisabledElement;
    private getVisibleNodes;
}
