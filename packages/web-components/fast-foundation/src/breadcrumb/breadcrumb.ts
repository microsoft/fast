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
     * Finds anchor childnodes in the light DOM or shadow DOM.
     * We look in the shadow DOM because we use an anchor inside the breadcrumb-item template.
     */
    private findChildAnchor(node: HTMLElement): HTMLElement | null {
        if (node.childElementCount > 0) {
            return node.querySelector("a");
        } else if (node.shadowRoot?.childElementCount) {
            return node.shadowRoot?.querySelector("a");
        } else return node;
    }

    /**
     * Sets ARIA Current for the "current" node
     * `aria-current` is not optional and should be set regardless of the href value of a given anchor
     */
    private setAriaCurrent(item: HTMLElement, isLastNode: boolean): void {
        const childNode: HTMLElement | null = this.findChildAnchor(item);

        if (childNode !== null) {
            isLastNode
                ? childNode.setAttribute("aria-current", "page")
                : childNode.removeAttribute("aria-current");
        }
    }
}
