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
            // don't show separator on last item
            (this.slottedBreadcrumbItems[
                this.slottedBreadcrumbItems.length - 1
            ] as BreadcrumbItem).showSeparator = false;
            // if we have a child node inside the last breadcrumb item and it has
            // an href then set aria-current to page
            this.slottedBreadcrumbItems[
                this.slottedBreadcrumbItems.length - 1
            ].childNodes.forEach((item: HTMLElement) => {
                if (item instanceof HTMLElement && item.hasAttribute("href")) {
                    item.setAttribute("aria-current", "page");
                }
            });
        }
    }
}
