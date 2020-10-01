import { FASTElement, observable, attr } from "@microsoft/fast-element";
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
            const lastNode: HTMLElement = this.slottedBreadcrumbItems[
                this.slottedBreadcrumbItems.length - 1
            ];

            if (lastNode instanceof BreadcrumbItem) {
                (lastNode as BreadcrumbItem).showSeparator = false;
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
                lastNode.setAttribute("aria-current", "page");
            } else if (childNodeWithHref !== null) {
                (childNodeWithHref as HTMLElement).setAttribute("aria-current", "page");
            }
        }
    }
}
