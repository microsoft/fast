import { FoundationElement } from "../foundation-element";
/**
 * A Breadcrumb Custom HTML Element.
 *
 * @public
 */
export declare class Breadcrumb extends FoundationElement {
    /**
     * @internal
     */
    slottedBreadcrumbItems: HTMLElement[];
    slottedBreadcrumbItemsChanged(): void;
    private setItemSeparator;
    /**
     * @internal
     * Finds href on childnodes in the light DOM or shadow DOM.
     * We look in the shadow DOM because we insert an anchor when breadcrumb-item has an href.
     */
    private findChildWithHref;
    /**
     *  If child node with an anchor tag and with href is found then apply aria-current to child node otherwise apply aria-current to the host element, with an href
     */
    private setLastItemAriaCurrent;
}
