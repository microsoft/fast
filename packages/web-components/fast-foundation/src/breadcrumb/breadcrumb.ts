import { FASTElement, observable } from "@microsoft/fast-element";
import { BreadcrumbItem } from "../breadcrumb-item";

/**
 * A Breadcrumb Custom HTML Element.
 *
 * @public
 */
export class Breadcrumb extends FASTElement {
    @observable
    public slottedBreadcrumbItems: HTMLElement[];
    public slottedBreadcrumbItemsChanged() {
        if (this.$fastController.isConnected) {
            const lastNode: HTMLElement = this.slottedBreadcrumbItems[
                this.slottedBreadcrumbItems.length - 1
            ];

            // don't show separator on last item
            if (lastNode instanceof BreadcrumbItem) {
                (lastNode as BreadcrumbItem).showSeparator = false;
            }

            // if we have a child node inside the last breadcrumb item and it has
            // an href then set aria-current to page
            if (lastNode.childElementCount > 0) {
                lastNode.childNodes.forEach((item: HTMLElement) => {
                    if (item instanceof HTMLElement && item.hasAttribute("href")) {
                        item.setAttribute("aria-current", "page");
                    }
                });
            } else {
                if (lastNode.hasAttribute("href")) {
                    lastNode.setAttribute("aria-current", "page");
                }
            }
        }
    }
}
