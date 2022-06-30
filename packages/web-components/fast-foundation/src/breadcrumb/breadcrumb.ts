import { FASTElement, observable } from "@microsoft/fast-element";
import { FASTBreadcrumbItem } from "../breadcrumb-item/breadcrumb-item.js";

/**
 * A Breadcrumb Custom HTML Element.
 * @slot - The default slot for the breadcrumb items
 * @csspart list - The element wrapping the slotted items
 *
 * @public
 */
export class FASTBreadcrumb extends FASTElement {
    /**
     * @internal
     */
    @observable
    public slottedBreadcrumbItems: HTMLElement[];
    protected slottedBreadcrumbItemsChanged() {
        if (this.$fastController.isConnected) {
            if (
                this.slottedBreadcrumbItems === undefined ||
                this.slottedBreadcrumbItems.length === 0
            ) {
                return;
            }

            const lastNode: HTMLElement = this.slottedBreadcrumbItems[
                this.slottedBreadcrumbItems.length - 1
            ];

            this.slottedBreadcrumbItems.forEach((item: HTMLElement) => {
                const itemIsLastNode: boolean = item === lastNode;

                this.setItemSeparator(item, itemIsLastNode);
                this.setAriaCurrent(item, itemIsLastNode);
            });
        }
    }

    private setItemSeparator(item: HTMLElement, isLastNode: boolean): void {
        if (item instanceof FASTBreadcrumbItem) {
            item.separator = !isLastNode;
        }
    }

    /**
     * Finds href on childnodes in the light DOM or shadow DOM.
     * We look in the shadow DOM because we insert an anchor when breadcrumb-item has an href.
     */
    private findChildWithHref(node: HTMLElement): HTMLElement | null {
        if (node.childElementCount > 0) {
            return node.querySelector("a[href]");
        } else if (node.shadowRoot?.childElementCount) {
            return node.shadowRoot?.querySelector("a[href]");
        } else return null;
    }

    /**
     *  Sets ARIA Current for the current node
     * If child node with an anchor tag and with href is found then set aria-current to correct value for the child node,
     * otherwise apply aria-current to the host element, with an href
     */
    private setAriaCurrent(item: HTMLElement, isLastNode: boolean): void {
        const childNodeWithHref: HTMLElement | null = this.findChildWithHref(item);

        if (
            childNodeWithHref === null &&
            item.hasAttribute("href") &&
            item instanceof FASTBreadcrumbItem
        ) {
            isLastNode
                ? item.setAttribute("aria-current", "page")
                : item.removeAttribute("aria-current");
        } else if (childNodeWithHref !== null) {
            isLastNode
                ? childNodeWithHref.setAttribute("aria-current", "page")
                : childNodeWithHref.removeAttribute("aria-current");
        }
    }
}
