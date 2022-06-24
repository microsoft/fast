import { attr, observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import {
    FoundationElement,
    FoundationElementDefinition,
} from "../foundation-element/foundation-element.js";
import { StartEnd, StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * check if the item is a tree item
 * @public
 * @remarks
 * determines if element is an HTMLElement and if it has the role treeitem
 */
export function isTreeItemElement(el: Element): el is HTMLElement {
    return (
        isHTMLElement(el) &&
        (el.getAttribute("role") === "treeitem" || el.tagName.includes("TREE-ITEM"))
    );
}

/**
 * Tree Item configuration options
 * @public
 */
export type TreeItemOptions = FoundationElementDefinition &
    StartEndOptions & {
        expandCollapseGlyph?: string | SyntheticViewTemplate;
    };

/**
 * A Tree item Custom HTML Element.
 *
 * @slot start - Content which can be provided before the tree item content
 * @slot end - Content which can be provided after the tree item content
 * @slot - The default slot for tree item text content
 * @slot item - The slot for tree items (fast tree items manage this assignment themselves)
 * @slot expand-collapse-button - The expand/collapse button
 * @csspart positioning-region - The element used to position the tree item content with exception of any child nodes
 * @csspart content-region - The element containing the expand/collapse, start, and end slots
 * @csspart items - The element wrapping any child items
 * @csspart expand-collapse-button - The expand/collapse button
 * @fires expanded-change - Fires a custom 'expanded-change' event when the expanded state changes
 * @fires selected-change - Fires a custom 'selected-change' event when the selected state changes
 *
 * @public
 */
export class TreeItem extends FoundationElement {
    /**
     * When true, the control will be appear expanded by user interaction.
     * @public
     * @remarks
     * HTML Attribute: expanded
     */
    @attr({ mode: "boolean" })
    public expanded: boolean = false;
    protected expandedChanged(): void {
        if (this.$fastController.isConnected) {
            this.$emit("expanded-change", this);
        }
    }

    /**
     * When true, the control will appear selected by user interaction.
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ mode: "boolean" })
    public selected: boolean;
    protected selectedChanged(): void {
        if (this.$fastController.isConnected) {
            this.$emit("selected-change", this);
        }
    }

    /**
     * When true, the control will be immutable by user interaction. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled | disabled HTML attribute} for more information.
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: "boolean" })
    public disabled: boolean;

    /**
     *  Reference to the expand/collapse button
     *
     * @internal
     */
    public expandCollapseButton: HTMLDivElement;

    /**
     * Whether the item is focusable
     *
     * @internal
     */
    @observable
    public focusable: boolean = false;

    /**
     *
     *
     * @internal
     */
    @observable
    public childItems: HTMLElement[];

    /**
     * The slotted child tree items
     *
     * @internal
     */
    @observable
    public items: HTMLElement[];
    protected itemsChanged(oldValue: unknown, newValue: HTMLElement[]): void {
        if (this.$fastController.isConnected) {
            this.items.forEach((node: HTMLElement) => {
                if (isTreeItemElement(node)) {
                    // TODO: maybe not require it to be a TreeItem?
                    (node as TreeItem).nested = true;
                }
            });
        }
    }

    /**
     * Indicates if the tree item is nested
     *
     * @internal
     */
    @observable
    public nested: boolean;

    /**
     *
     *
     * @internal
     */
    @observable
    public renderCollapsedChildren: boolean;

    /**
     * Places document focus on a tree item
     *
     * @public
     * @param el - the element to focus
     */
    public static focusItem(el: HTMLElement) {
        (el as TreeItem).focusable = true;
        el.focus();
    }

    /**
     * Whether the tree is nested
     *
     * @public
     */
    public readonly isNestedItem = (): boolean => {
        return isTreeItemElement(this.parentElement as Element);
    };

    /**
     * Handle expand button click
     *
     * @internal
     */
    public handleExpandCollapseButtonClick = (e: MouseEvent): void => {
        if (!this.disabled && !e.defaultPrevented) {
            this.expanded = !this.expanded;
        }
    };

    /**
     * Handle focus events
     *
     * @internal
     */
    public handleFocus = (e: FocusEvent): void => {
        this.setAttribute("tabindex", "0");
    };

    /**
     * Handle blur events
     *
     * @internal
     */
    public handleBlur = (e: FocusEvent): void => {
        this.setAttribute("tabindex", "-1");
    };

    /**
     * Gets number of children
     *
     * @internal
     */
    public childItemLength(): number {
        const treeChildren: HTMLElement[] = this.childItems.filter(
            (item: HTMLElement) => {
                return isTreeItemElement(item);
            }
        );
        return treeChildren ? treeChildren.length : 0;
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
