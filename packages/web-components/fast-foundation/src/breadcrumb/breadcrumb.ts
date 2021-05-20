import { FASTElement, html, observable, ViewTemplate } from "@microsoft/fast-element";
import { BreadcrumbItem } from "../breadcrumb-item";

const breadcrumbSeparatorTemplate: ViewTemplate<HTMLElement> = html`
    <svg
        slot="breadcrumb-separator"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6.10056 2L10.6592 6.55866H0V9.62011H10.6592L6.10056 14.1899H9.91061L16 8.08939L9.91061 2H6.10056Z"
        />
    </svg>
`;

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

            this.slottedBreadcrumbItems.forEach((item: HTMLElement) => {
                if (item instanceof BreadcrumbItem) {
                    (item as BreadcrumbItem).generateBreadcrumbItemSeparator = this.generateBreadcrumbSeparator;
                }
            });

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

    public generateBreadcrumbSeparator(): ViewTemplate {
        return breadcrumbSeparatorTemplate;
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
