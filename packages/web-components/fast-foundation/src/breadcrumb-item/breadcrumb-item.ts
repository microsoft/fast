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
    @observable
    public showSeparator: boolean = true;
}
