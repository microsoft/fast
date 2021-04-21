import { FASTElement, observable } from "@microsoft/fast-element";
import { BreadcrumbItem } from "../breadcrumb-item";

/**
 * A Breadcrumb Custom HTML Element.
 *
 * @public
 */
export class Breadcrumb extends FASTElement {
    /**
     * @internal
     */
    @observable
    public slottedBreadcrumbItems: HTMLElement[];
    public slottedBreadcrumbItemsChanged() {
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

            this.setItemSeparator(lastNode);
            this.setLastItemAriaCurrent(lastNode);
        }
    }

    private setItemSeparator(lastNode: HTMLElement): void {
        this.slottedBreadcrumbItems.forEach((item: HTMLElement) => {
            if (item instanceof BreadcrumbItem) {
                (item as BreadcrumbItem).separator = true;
            }
        });
        if (lastNode instanceof BreadcrumbItem) {
            (lastNode as BreadcrumbItem).separator = false;
        }
    }

    /**
     * @internal
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
     *  If child node with an anchor tag and with href is found then apply aria-current to child node otherwise apply aria-current to the host element, with an href
     */
    private setLastItemAriaCurrent(lastNode: HTMLElement): void {
        const childNodeWithHref: HTMLElement | null = this.findChildWithHref(lastNode);

        if (
            childNodeWithHref === null &&
            lastNode.hasAttribute("href") &&
            lastNode instanceof BreadcrumbItem
        ) {
            (lastNode as BreadcrumbItem).ariaCurrent = "page";
        } else if (childNodeWithHref !== null) {
            childNodeWithHref.setAttribute("aria-current", "page");
        }
    }
}
