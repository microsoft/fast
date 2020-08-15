import { FASTElement, observable, attr } from "@microsoft/fast-element";
import { BreadcrumbItem } from "../breadcrumb-item";

/**
 * A Breadcrumb Custom HTML Element.
 *
 * @public
 */
export class Breadcrumb extends FASTElement {
    /**
     * The id of the element labeling the breadcrumb.
     * @public
     * @remarks
     * HTML Attribute: aria-labelledby
     */
    @attr({ attribute: "aria-labelledby" })
    public ariaLabelledby: string;

    /**
     * The label surfaced to assistive technologies.
     *
     * @public
     * @remarks
     * HTML Attribute: aria-label
     */
    @attr({ attribute: "aria-label" })
    public ariaLabel: string;

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

            if (lastNode.childElementCount > 0) {
                lastNode.childNodes.forEach((item: HTMLElement) => {
                    if (item instanceof HTMLElement && item.hasAttribute("href")) {
                        item.setAttribute("aria-current", "page");
                    }
                });
            } else {
                if (lastNode.hasAttribute("href")) {
                    if (lastNode instanceof BreadcrumbItem) {
                        (lastNode as BreadcrumbItem).isCurrent = true;
                    } else {
                        lastNode.setAttribute("aria-current", "page");
                    }
                }
            }
        }
    }
}
