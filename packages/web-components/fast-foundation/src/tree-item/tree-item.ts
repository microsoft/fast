import { attr, observable, SyntheticViewTemplate } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";
import { StartEnd, StartEndOptions } from "../patterns/start-end";
import { applyMixins } from "../utilities/apply-mixins";
import { FoundationElement, FoundationElementDefinition } from "../foundation-element";

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
    private expandedChanged(): void {
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
    private selectedChanged(): void {
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
        }
    }

    /**
     * @internal
     */
    @observable
    public nested: boolean;

    @observable
    public renderCollapsedChildren: boolean;

    /**
     * Places document focus on a tree item
     * @param el - the element to focus
     */
    public static focusItem(el: HTMLElement) {
        (el as TreeItem).focusable = true;
        el.focus();
    }

    public handleExpandCollapseButtonClick = (e: MouseEvent): void => {
        if (!this.disabled && !e.defaultPrevented) {
            this.expanded = !this.expanded;
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
