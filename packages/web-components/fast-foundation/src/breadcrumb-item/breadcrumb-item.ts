import { attr, FASTElement, observable } from "@microsoft/fast-element";
import { Anchor } from "../anchor";

/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export class BreadcrumbItem extends FASTElement {
    /**
     * The id of the element describing the current page.
     * @public
     * @remarks
     * HTML Attribute: aria-current
     */
    @attr({ attribute: "aria-current" })
    public ariaCurrent: string;

    /**
     * @internal
     */
    @observable
    public slottedBreadcrumbItems: HTMLElement[];
    public slottedBreadcrumbItemsChanged() {
        if (this.$fastController.isConnected) {
            this.setItems;
        }
    }

    private setItems = (): void => {
        this.slottedBreadcrumbItems.forEach((item: HTMLElement, index: number) => {
            item.setAttribute("aria-current", "page");
        });
    };
}
