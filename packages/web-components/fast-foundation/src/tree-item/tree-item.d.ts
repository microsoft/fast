import { SyntheticViewTemplate } from "@microsoft/fast-element";
import { StartEnd } from "../patterns/start-end";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";
/**
 * check if the item is a tree item
 * @public
 * @remarks
 * determines if element is an HTMLElement and if it has the role treeitem
 */
export declare function isTreeItemElement(el: Element): el is HTMLElement;
/**
 * Tree Item configuration options
 * @public
 */
export declare type TreeItemOptions = FoundationElementDefinition & {
    expandCollapseGlyph?: string | SyntheticViewTemplate;
};
/**
 * A Tree item Custom HTML Element.
 *
 * @public
 */
export declare class TreeItem extends FoundationElement {
    /**
     * When true, the control will be appear expanded by user interaction.
     * @public
     * @remarks
     * HTML Attribute: expanded
     */
    expanded: boolean;
    /**
     * When true, the control will appear selected by user interaction.
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    selected: boolean;
    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    disabled: boolean;
    expandCollapseButton: HTMLDivElement;
    focusable: boolean;
    childItems: HTMLElement[];
    items: HTMLElement[];
    private itemsChanged;
    /**
     * @internal
     */
    nested: boolean;
    renderCollapsedChildren: boolean;
    private notifier;
    private enabledChildTreeItems;
    private getParentTreeNode;
    /**
     * @internal
     */
    connectedCallback(): void;
    /**
     * @internal
     */
    disconnectedCallback(): void;
    /**
     * Places document focus on a tree item and adds the item to the sequential tab order.
     * @param el - the element to focus
     */
    static focusItem(el: HTMLElement): void;
    handleChange(source: any, propertyName: string): void;
    /**
     * The keyboarding on treeview should conform to the following spec
     * https://w3c.github.io/aria-practices/#keyboard-interaction-23
     * @param e - Event object for keyDown event
     */
    handleKeyDown: (e: KeyboardEvent) => void | boolean;
    handleExpandCollapseButtonClick: (e: MouseEvent) => void;
    handleClick: (e: MouseEvent) => void;
    childItemLength(): number;
    readonly isNestedItem: () => boolean;
    private collapseOrFocusParent;
    private expandOrFocusFirstChild;
    private focusNextNode;
    private getVisibleNodes;
    private getTreeRoot;
    private handleSelected;
    private setExpanded;
}
/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast-dna/issues/3317
 * @internal
 */
export interface TreeItem extends StartEnd {}
