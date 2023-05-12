import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import type { StaticallyComposableHTML } from "../utilities/template-helpers.js";
import { StartEnd } from "../patterns/start-end.js";
import type { StartEndOptions } from "../patterns/start-end.js";
import { applyMixins } from "../utilities/apply-mixins.js";

/**
 * check if the item is a tree item
 * @public
 * @remarks
 * determines if element is an HTMLElement and if it has the role treeitem
 */
export function isTreeItemElement(el: Element): el is HTMLElement {
    return isHTMLElement(el) && (el as any).isTreeItem;
}

/**
 * Tree Item configuration options
 * @public
 */
export type TreeItemOptions = StartEndOptions<FASTTreeItem> & {
    expandCollapseGlyph?: StaticallyComposableHTML<FASTTreeItem>;
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
     *  Readonly property identifying the element as a tree item
     *
     * @internal
     */
    public readonly isTreeItem: boolean = true;

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
                    (node as FASTTreeItem).nested = true;
                }
            });
        }
    }

    /**
     * Indicates if the tree item is nested
     *
     * @public
     * @deprecated - will be removed in coming ALPHA version
     * HTML Attribute: nested
     */
    @attr({ mode: "boolean" })
    public nested: boolean = false;

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
    public get childItemLength(): number {
        if (this.$fastController.isConnected) {
            return this.childItems?.filter(item => isTreeItemElement(item)).length;
        }

        return 0;
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast-dna/issues/3317
 * @internal
 */
/* eslint-disable-next-line */
export interface FASTTreeItem extends StartEnd {}
applyMixins(FASTTreeItem, StartEnd);
