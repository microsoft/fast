import { attr, FASTElement, observable } from "@microsoft/fast-element";

/**
 * A Breadcrumb Item Custom HTML Element.
 *
 * @public
 */
export class BreadcrumbItem extends FASTElement {
    @attr
    public separator: string = "/";

    /**
     * The id of the element describing the current page.
     * @public
     * @remarks
     * HTML Attribute: aria-current
     */
    @attr({ attribute: "aria-current" })
    public ariaCurrent: string;
}
