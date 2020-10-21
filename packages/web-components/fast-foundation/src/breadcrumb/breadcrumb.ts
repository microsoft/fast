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

            if (lastNode instanceof BreadcrumbItem) {
                (lastNode as BreadcrumbItem).separator = false;
            }

            let childNodeWithHref: HTMLElement | null = null;

            if (lastNode.childElementCount > 0) {
                lastNode.childNodes.forEach((item: HTMLElement) => {
                    if (item instanceof HTMLElement && item.hasAttribute("href")) {
                        childNodeWithHref = item;
                    }
                });
            }

            /**
             *  If child node with href is found then apply aria-current to child node otherwise apply aria-current to the host element, with an href
             */
            if (
                childNodeWithHref === null &&
                lastNode.hasAttribute("href") &&
                lastNode instanceof BreadcrumbItem
            ) {
                (lastNode as BreadcrumbItem).ariaCurrent = "page";
            } else if (childNodeWithHref !== null) {
                (childNodeWithHref as HTMLElement).setAttribute("aria-current", "page");
            }
        }
    }
}
