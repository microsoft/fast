import {
    attr,
    FASTElement,
    observable,
    SyntheticViewTemplate,
} from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import { ARIAGlobalStatesAndProperties } from "../patterns/aria-global.js";
import { StartEnd, StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * check if the item is a tree item
 * @public
 * @remarks
 * determines if element is an HTMLElement and if it has the role treeitem
 */
export function isTreeItemElement(el: Element): el is FASTTreeItem {
    return (
        isHTMLElement(el) &&
        (el.getAttribute("role") === "treeitem" || el.tagName.includes("TREE-ITEM"))
    );
}

/**
 * Tree Item configuration options
 * @public
 */
export type TreeItemOptions = StartEndOptions & {
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
export class FASTTreeItem extends FASTElement {
    /**
     * When true, the control will be appear expanded by user interaction.
     * @public
     * @remarks
     * HTML Attribute: expanded
     */
    @attr({ mode: "boolean" })
    public expanded: boolean = false;
    protected expandedChanged(prev: boolean | undefined, next: boolean): void {
        if (this.$fastController.isConnected) {
            this.ariaExpanded = next && this.childItems.length ? "true" : "false";
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
    protected selectedChanged(prev: boolean | undefined, next: boolean): void {
        if (this.$fastController.isConnected) {
            this.ariaSelected = next ? "true" : "false";
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
    protected disabledChanged(prev: boolean | undefined, next: boolean): void {
        if (this.$fastController.isConnected) {
            this.ariaDisabled = next ? "true" : "false";
        }
    }

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
    protected itemsChanged(prev: HTMLElement[] | undefined, next: HTMLElement[]): void {
        if (this.$fastController.isConnected) {
            next.forEach(node => {
                if (isTreeItemElement(node)) {
                    // TODO: maybe not require it to be a TreeItem?
                    (node as FASTTreeItem).nested = true;
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
        (el as FASTTreeItem).focusable = true;
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
    public handleExpandCollapseButtonClick = (e: MouseEvent): boolean | void => {
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
}

/**
 * Includes ARIA states and properties relating to the ARIA textbox role
 *
 * @public
 */
export class DelegatesARIATreeItem {
    /**
     * See {@link https://www.w3.org/TR/wai-aria-1.2/#treeitem} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-disabled`
     */
    @observable
    public ariaDisabled: "true" | "false" | string | null;

    /**
     * See {@link https://www.w3.org/TR/wai-aria-1.2/#treeitem} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-expanded`
     */
    @observable
    public ariaExpanded: "true" | "false" | string | null;

    /**
     * See {@link https://www.w3.org/TR/wai-aria-1.2/#treeitem} for more information
     * @public
     * @remarks
     * HTML Attribute: `aria-expanded`
     */
    @observable
    public ariaSelected: "true" | "false" | string | null;
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface DelegatesARIATreeItem extends ARIAGlobalStatesAndProperties {}
applyMixins(DelegatesARIATreeItem, ARIAGlobalStatesAndProperties);

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast-dna/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface FASTTreeItem extends StartEnd, DelegatesARIATreeItem {}
applyMixins(FASTTreeItem, StartEnd, DelegatesARIATreeItem);
